// ZeroTrap — charges d'attaque pour les tests obligatoires (règle 01, section 4 : « Tests d'attaque »).
//
// Pour CHAQUE formulaire et CHAQUE route d'API qui reçoit des données, un test envoie ces valeurs
// dans chaque champ et vérifie le résultat attendu :
//   1. la requête est refusée par la validation (code 400 ou 422, message générique)
//      OU la valeur est enregistrée telle quelle et réaffichée comme du TEXTE ;
//   2. aucun script ne s'exécute (aucune boîte de dialogue, aucune requête vers un autre site) ;
//   3. aucune erreur de base de données, aucune trace technique, aucun chemin de fichier dans la réponse ;
//   4. aucune donnée d'un autre utilisateur dans la réponse ;
//   5. aucune redirection vers un autre domaine.
//
// La preuve config.preuves.tests_attaques pointe vers un fichier de test qui importe ces listes.
//
// Exemple (Vitest, route d'API) :
//
//   import { PAYLOADS_XSS, PAYLOADS_SQL } from '@/lib/security/attack-payloads';
//   for (const valeur of [...PAYLOADS_XSS, ...PAYLOADS_SQL]) {
//     it(`refuse ou neutralise : ${valeur.slice(0, 30)}`, async () => {
//       const res = await POST(requete({ nom: valeur }));
//       expect([200, 201, 400, 422]).toContain(res.status);
//       const corps = await res.text();
//       expect(corps).not.toMatch(/syntax error|sqlstate|postgres|prisma|stack|at \w+ \(/i);
//     });
//   }
//
// Exemple (Playwright, affichage) : saisir chaque PAYLOADS_XSS, enregistrer, recharger la page, puis
// vérifier qu'aucune boîte de dialogue ne s'ouvre (page.on('dialog') ne doit jamais être appelé)
// et que le texte s'affiche tel quel.

/** XSS : du code HTML ou JavaScript glissé dans un champ, qui ne doit jamais s'exécuter. */
export const PAYLOADS_XSS: readonly string[] = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "'><svg onload=alert(1)>",
  'javascript:alert(1)',
  '<iframe src="javascript:alert(1)"></iframe>',
  '<a href="javascript:alert(1)">clic</a>',
  '{{7*7}}${7*7}<%= 7*7 %>',
  '</textarea><script>alert(1)</script>',
  '<details open ontoggle=alert(1)>',
];

/** Injection SQL : la valeur doit rester une valeur, jamais devenir un morceau de requête. */
export const PAYLOADS_SQL: readonly string[] = [
  "' OR '1'='1",
  "' OR 1=1 --",
  '" OR "1"="1',
  "admin'--",
  "1; DROP TABLE users; --",
  "' UNION SELECT NULL, NULL --",
  "1' AND SLEEP(5) --",
  "'; WAITFOR DELAY '0:0:5' --",
];

/** Injection de commande système. */
export const PAYLOADS_COMMANDE: readonly string[] = [
  '; ls -la',
  '| whoami',
  '`id`',
  '$(id)',
  '&& ping -c 1 127.0.0.1',
];

/** Traversée de chemins : accès à des fichiers en dehors du dossier prévu. */
export const PAYLOADS_CHEMIN: readonly string[] = [
  '../../../../etc/passwd',
  '..\\..\\..\\windows\\win.ini',
  '%2e%2e%2f%2e%2e%2fetc%2fpasswd',
  '/etc/passwd',
];

/** Redirection ouverte : les paramètres de retour (?next=, ?returnTo=) ne doivent mener qu'au site. */
export const PAYLOADS_REDIRECTION: readonly string[] = [
  'https://exemple-malveillant.test',
  '//exemple-malveillant.test',
  '/\\exemple-malveillant.test',
  'javascript:alert(1)',
];

/** Valeurs limites : longueur, caractères spéciaux, types inattendus (la validation doit tenir). */
export const PAYLOADS_LIMITES: readonly string[] = [
  'a'.repeat(100_000),
  '',
  ' ',
  '\u0000',
  '😀'.repeat(1000),
  'ü̈̈̈̈̈̈̈̈̈̈',
  '-1',
  '1e309',
  'null',
  '{"$ne": null}',
];

/** Toutes les charges textuelles, pour un test qui les envoie dans chaque champ. */
export const TOUTES_LES_CHARGES: readonly string[] = [
  ...PAYLOADS_XSS,
  ...PAYLOADS_SQL,
  ...PAYLOADS_COMMANDE,
  ...PAYLOADS_CHEMIN,
  ...PAYLOADS_REDIRECTION,
  ...PAYLOADS_LIMITES,
];
