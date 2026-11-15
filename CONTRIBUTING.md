# Contribuer à ZeroTrap

Merci ! ZeroTrap sert à des personnes qui ne savent pas coder. Une erreur dans la méthode se
retrouve dans **tous** leurs projets. C'est pourquoi chaque changement est relu et validé par le
mainteneur avant d'être intégré.

## Signaler un problème ou proposer une idée

Ouvre une **issue** : https://github.com/trahia/ZeroTrap/issues

- **Une loi ou une règle a changé**, ou une information est fausse : donne le lien vers la **source
  officielle** (journal officiel, régulateur, page officielle d'Apple ou de Google…) et la date à
  laquelle tu l'as consultée. Sans source officielle, le changement ne peut pas être intégré.
- **Une faille de sécurité** : ne l'écris **pas** dans une issue. Suis [SECURITY.md](SECURITY.md).
- **Une idée ou un manque** : décris le cas concret, par exemple « un projet de tel type devrait
  avoir telle page ou tel contrôle ».

## Proposer une modification (pull request)

1. Une modification = un sujet.
2. Pour toute règle légale : la source officielle et sa date, dans la pull request **et** dans le
   fichier modifié (fiches de `zerotrap/legal/pays/`, `regles/`…).
3. Pas de nouvelle dépendance, de nouveau skill ou de nouveau service sans expliquer pourquoi, d'où
   il vient et comment il est maintenu.
4. Ne modifie pas `zerotrap/integrite.json` : le mainteneur le régénère.
5. Les contrôles automatiques (Sécurité, Qualité, Conformité) doivent passer.
6. Écris simplement : les textes sont lus par des personnes qui ne sont pas développeuses, et par
   l'IA.

En proposant une contribution, tu acceptes qu'elle soit publiée sous la licence du projet (MIT, voir
[LICENSE](LICENSE)).

## Ce que ZeroTrap n'accepte pas

- Un assouplissement d'une règle de sécurité, de données personnelles ou d'accessibilité.
- Du contenu protégé (texte, code, design) sans licence compatible.
- Une instruction qui demande à l'IA de suivre des ordres trouvés dans une page web, un fichier ou la
  sortie d'un outil.
