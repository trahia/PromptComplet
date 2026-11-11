-- PromptComplet — socle de base de données Supabase (PostgreSQL).
-- À copier dans supabase/migrations/<horodatage>_socle.sql.
-- Principe : accès REFUSÉ par défaut (RLS sur chaque table) ; chaque utilisateur ne voit que ses données.
-- Le script de conformité vérifie que chaque table créée active la Row Level Security.

-- ---------------------------------------------------------------------------
-- Profils (une ligne par utilisateur, créée automatiquement à l'inscription)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  locale text not null default 'fr' check (locale ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles : lecture de son propre profil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles : modification de son propre profil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
-- Pas de règle insert/delete : création par le déclencheur ci-dessous, suppression en cascade avec le compte.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Journal d'audit des actions sensibles (connexion admin, changement de droits, export, suppression…)
-- Écrit uniquement côté serveur (clé service). Jamais de donnée personnelle ni de secret dans « details ».
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  action text not null check (char_length(action) <= 100),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
-- Aucune règle : table inaccessible aux clients (anon / authenticated).
revoke all on public.audit_log from anon, authenticated;
create index if not exists audit_log_created_at_idx on public.audit_log (created_at);

-- ---------------------------------------------------------------------------
-- Droit d'accès et de portabilité : export des données de l'utilisateur connecté
-- ---------------------------------------------------------------------------
create or replace function public.export_my_data()
returns jsonb language sql stable security invoker set search_path = ''
as $$
  select jsonb_build_object(
    'exported_at', now(),
    'profile', (select to_jsonb(p) from public.profiles p where p.id = (select auth.uid()))
    -- IA : ajoute ici CHAQUE table contenant des données de l'utilisateur.
  );
$$;
revoke execute on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;

-- Suppression du compte : via une Edge Function serveur qui, après une nouvelle authentification,
-- supprime les fichiers de l'utilisateur dans le stockage puis appelle auth.admin.deleteUser(uid).
-- Les tables liées à auth.users sont supprimées par ON DELETE CASCADE.

-- ---------------------------------------------------------------------------
-- Stockage privé : chaque utilisateur dans son propre dossier « <uid>/… »
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('prive', 'prive', false)
on conflict (id) do nothing;

create policy "stockage : lire ses propres fichiers"
  on storage.objects for select to authenticated
  using (bucket_id = 'prive' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "stockage : ajouter ses propres fichiers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'prive' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "stockage : supprimer ses propres fichiers"
  on storage.objects for delete to authenticated
  using (bucket_id = 'prive' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------------------------
-- MODÈLE pour toute nouvelle table (à copier, jamais sans RLS) :
-- ---------------------------------------------------------------------------
-- create table public.items (
--   id uuid primary key default gen_random_uuid(),
--   owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
--   title text not null check (char_length(title) between 1 and 200),
--   created_at timestamptz not null default now()
-- );
-- alter table public.items enable row level security;
-- create policy "items : lecture" on public.items for select to authenticated using ((select auth.uid()) = owner_id);
-- create policy "items : création" on public.items for insert to authenticated with check ((select auth.uid()) = owner_id);
-- create policy "items : modification" on public.items for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
-- create policy "items : suppression" on public.items for delete to authenticated using ((select auth.uid()) = owner_id);
-- create index on public.items (owner_id);
-- Puis : un test automatique « l'utilisateur A ne voit pas les items de B » (tests/security/).
