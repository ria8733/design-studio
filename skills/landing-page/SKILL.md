---
name: landing-page
description: Conception complète d'une landing page ou d'une page de vente — proposition de valeur, architecture de l'information, message principal, storytelling, structure des sections, direction artistique, design system, développement, QA visuelle et optimisation de la conversion. À utiliser dès que l'utilisateur demande une landing page, une page d'accueil, une page produit, une page de vente, un site vitrine, une page de lancement, ou dit "crée-moi la landing de ce projet", "page premium et différenciante", "homepage". Priorise toujours la compréhension et la conversion avant l'effet visuel.
---

# Landing Page

Une landing page a **un seul travail** : faire comprendre, puis faire agir.
Tout ce qui ne sert ni l'un ni l'autre est du décor à supprimer.

Process obligatoire, dans l'ordre. Les étapes 1 à 3 se font **avant** toute décision visuelle.

---

## 1. Proposition de valeur

Remplis ces quatre lignes avant tout le reste :

- **Pour** [qui, précisément — pas « les entreprises »]
- **qui** [situation ou douleur, avec ses mots]
- **[Produit]** est [catégorie que l'utilisateur reconnaît déjà]
- **qui** [bénéfice unique, vérifiable]
- **Contrairement à** [l'alternative réelle, y compris « ne rien faire »]

Si le bénéfice n'est pas vérifiable, il ne va pas sur la page.
Si tu ne peux pas nommer l'alternative, le positionnement n'existe pas encore : signale-le
en une phrase et continue avec l'hypothèse la plus probable, déclarée.

## 2. Architecture de l'information

Liste les questions du visiteur **dans l'ordre où il se les pose** :

1. C'est quoi ? (3 secondes)
2. C'est pour moi ? (10 secondes)
3. Ça marche comment ? (30 secondes)
4. Pourquoi lui et pas un autre ?
5. Qu'est-ce qui m'empêche d'y aller ? (prix, effort, risque, engagement)
6. Je fais quoi maintenant ?

**Chaque section de la page répond à exactement une de ces questions.**
Une section qui ne répond à aucune est supprimée. Deux sections qui répondent à la même
sont fusionnées. C'est la règle qui produit une page courte et forte.

## 3. Message principal

Le titre du hero. Contraintes :

- Dit ce que fait le produit ou ce qu'il change — pas ce qu'on ressent en l'utilisant.
- Compréhensible sans le sous-titre.
- Sous 12 mots.
- Ne contient ni « révolutionnaire », ni « propulsé par l'IA », ni « seamless », ni « empower ».
- Test : lu hors contexte à quelqu'un qui ne connaît pas le produit, il doit pouvoir
  répéter ce que fait le produit.

Écris 5 candidats, garde 1, explique en une ligne pourquoi.

## 4. Storytelling

Choisis **une** structure narrative et tiens-la :

- **Problème → Agitation → Solution** — douleur connue et douloureuse.
- **Avant / Après / Pont** — transformation visible.
- **Démonstration** — le produit se montre plus vite qu'il ne s'explique.
- **Contre-position** — le marché fait X, nous faisons Y. Fort si le positionnement est net.

Interdit : enchaîner des sections de bénéfices sans fil narratif. C'est la structure
par défaut, et elle ne convainc personne.

## 5. Structure des sections

Un canevas de départ, à **couper** plutôt qu'à compléter :

1. **Hero** — message, sous-titre (1 phrase, la précision que le titre a sacrifiée), CTA principal, preuve visuelle réelle.
2. **Ancrage du problème** — courte, tendue. Le visiteur doit se reconnaître.
3. **Démonstration** — le produit en action. La section la plus importante et la plus souvent bâclée.
4. **Différenciation** — 3 points maximum, chacun avec sa preuve.
5. **Objections** — prix, effort, risque, réversibilité. Traitées frontalement.
6. **CTA final** — la même action que le hero, formulée pareil.

Sections optionnelles, uniquement si le contenu est **réel** : preuve sociale, tarifs, FAQ.
Pas de témoignage inventé, pas de métrique inventée, pas de logo client fictif — jamais,
même « en attendant ». Une section vide vaut mieux qu'une section fausse.

**Un seul CTA par page**, répété. Deux actions concurrentes divisent la conversion.

## 6. Direction artistique

Invoque le Skill `design-director`. Spécificités landing :

- Le **rythme vertical** est la variable la plus sous-exploitée : alterner largeur,
  densité et fond de section. Trois sections consécutives de même hauteur avec un titre
  centré tuent la page.
- Le hero porte la personnalité. S'il ressemble à un template, la page entière est morte
  avant la seconde section.
- Un moment de **vide** avant le CTA final lui donne son poids.

## 7. Design system

Invoque le Skill `design-system`. Une landing n'a pas besoin d'un système complet :
tokens de couleur, échelle typo, échelle d'espacement, un bouton avec ses états, un
conteneur de section. Pas de bibliothèque de composants pour six sections.

## 8. Développement

- HTML sémantique : un seul `h1`, ordre de titres respecté, `<section>` nommées.
- Mobile-first. La landing est vue majoritairement sur téléphone.
- Pas de framework si une page statique suffit. Le poids est un facteur de conversion.
- Images : dimensions explicites (pas de décalage de mise en page), `loading="lazy"`
  sous la ligne de flottaison, format moderne, `alt` réel.
- Polices : au maximum 2 familles, sous-ensembles chargés, `font-display: swap`.
- `prefers-reduced-motion` respecté.

## 9. QA visuelle

Invoque `visual-qa`, sur `mobile,tablet,desktop`. Points spécifiques :

- Le CTA est-il visible sans scroll sur mobile ?
- Le titre du hero tient-il en 2 ou 3 lignes sur 390 px, sans coupure laide ?
- Le parcours de lecture est-il continu, sans section qui casse le rythme au mauvais moment ?

Puis `anti-ai-slop`. Une landing est la surface la plus exposée au design générique.

## 10. Optimisation de la conversion

Avant de livrer, vérifier :

- **Friction** — combien de clics et de champs jusqu'à l'action ? Réduire.
- **Formulation du CTA** — ce que l'utilisateur obtient (« Voir une démo »), jamais
  ce qu'il donne (« Envoyer »). Identique partout sur la page.
- **Objection non traitée** — s'il en reste une, elle coûtera plus que n'importe quel effet visuel.
- **Clarté avant persuasion** — si un visiteur ne comprend pas le produit, aucune preuve
  sociale ne le convaincra.
- **Vitesse** — objectif LCP < 2,5 s, aucun décalage de mise en page.
- **Titre de page et méta description** — écrits, pas laissés par défaut.

---

## Livrables

- `design/brand/<projet>-DA.md` (direction artistique)
- La page, avec ses tokens
- `design/qa/<horodatage>/` (captures + rapport)
- Un résumé court : le message retenu, la structure, les arbitrages, ce qui a été refusé
