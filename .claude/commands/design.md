---
description: Lance la boucle de production design complète (8 passes) sur un brief
argument-hint: <brief — ex: "landing page premium et différenciante pour Snaff">
---

Exécute la boucle de production complète du Design Studio sur ce brief :

**$ARGUMENTS**

Déroule les 8 passes définies dans `CLAUDE.md`, sans en sauter :

1. **STRATEGY** — Skill `design-director`, PASS 1. Trois questions bloquantes maximum,
   puis tu décides le reste et tu le déclares.
2. **ART DIRECTION** — Skill `design-director`, PASS 2. Livrable écrit dans
   `design/brand/`, avec le bloc « Ce que ce design refuse ».
3. **DESIGN SYSTEM** — Skill `design-system`. Tokens et règles avant tout composant.
4. **BUILD** — Code. Réutilise l'existant. Zéro valeur arbitraire.
5. **VISUAL TEST** — Skill `visual-qa`. Playwright, captures réelles, et tu **lis** les PNG.
6. **CRITIQUE** — Skill `anti-ai-slop`. Exactement 5 défauts majeurs, posture de DA extérieur.
7. **POLISH** — Corrige les 5 défauts directement, sans demander.
8. **FINAL QA** — Recapture. Vérifie responsive, UX, cohérence, accessibilité, code, perf.

S'il s'agit d'une landing page, d'une page produit ou d'une page de vente, utilise le
Skill `landing-page` : il porte sa propre séquence, qui remplace les passes 1 à 3.

Ne t'arrête pas après le build. Une page non regardée dans un navigateur n'est pas livrée.

Termine par un récapitulatif court : le concept en une phrase, les arbitrages
structurants, les 5 défauts corrigés, et ce qui reste à trancher côté humain.
