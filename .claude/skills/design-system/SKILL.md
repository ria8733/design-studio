---
name: design-system
description: Transforme une direction artistique en système cohérent et exploitable — tokens de couleur, typographie, échelle d'espacement, grilles, radius, ombres, états, motion, et composants réutilisables. À utiliser après la direction artistique et AVANT de coder des écrans, ou dès qu'apparaissent des valeurs arbitraires dans le CSS/les styles, des composants dupliqués, des espacements incohérents. Déclencher sur "design system", "tokens", "variables de thème", "harmoniser les styles", "échelle typographique", "spacing", "composants réutilisables", "refacto des styles". Couvre le web (CSS custom properties / Tailwind) et React Native (constants/theme.ts).
---

# Design System

Objectif : qu'aucune valeur esthétique ne soit décidée dans un composant.
Un système, ce n'est pas une liste de couleurs — c'est un **ensemble de contraintes qui
rend les mauvaises décisions difficiles**.

## Règle d'or

> Si une valeur apparaît deux fois, c'est un token.
> Si un token apparaît une seule fois, c'est probablement une erreur de conception.

Aucune valeur littérale de couleur, taille, espacement, radius, ombre ou durée dans un
composant. Exception unique et documentée : une valeur imposée par une contrainte
externe (dimension d'un asset, ratio d'une image).

---

## 1. Audit avant création

Ne jamais créer un système par-dessus un système. D'abord :

```bash
# valeurs arbitraires (web + RN)
grep -rEn "#[0-9a-fA-F]{3,8}\b" --include=*.tsx --include=*.ts --include=*.css . \
  | grep -v -E "theme\.ts|tailwind\.config"
grep -rEn "(padding|margin|gap|fontSize|borderRadius)[^:]*: *[0-9]+" --include=*.tsx .
```

Recense : combien de valeurs distinctes, lesquelles sont des quasi-doublons
(`#151B2E` vs `#151b2f`), quelles échelles existent déjà. **Réduis d'abord, ajoute ensuite.**

---

## 2. Les couches

Trois niveaux, dans cet ordre. Ne jamais utiliser le niveau 1 dans un composant.

1. **Primitives** — les valeurs brutes. `orange-500: #FF6A1F`, `space-4: 16`.
2. **Sémantiques** — le rôle. `bg.card`, `text.secondary`, `border.strong`,
   `accent.interactive`. C'est ce que consomment les composants.
3. **Composants** — uniquement si un composant a un besoin qui ne se dit pas
   sémantiquement (`card.tiltShadow`). Rare. Justifier.

Un composant qui a besoin d'une primitive révèle un token sémantique manquant.

---

## 3. Contenu du système

### Couleur
Fond (3 niveaux : base, surface, élevée) · texte (primaire, secondaire, atténué,
inversé) · bordure (subtile, défaut, forte) · marque (primaire, sombre, accent) ·
sémantique (succès, danger, avertissement, info) · overlay.
Chaque couleur de texte est validée contre chaque fond sur lequel elle peut apparaître.

### Typographie
Échelle nommée par **rôle**, pas par taille : `display`, `title`, `heading`,
`subheading`, `body`, `bodySmall`, `caption`, `mono`/`numeric`.
Chaque rôle porte : famille, taille, graisse, hauteur de ligne, tracking.
Maximum 7 rôles. Au-delà, le système ne sert plus à rien.

### Espacement
Une seule échelle, base 4 : `2 4 8 12 16 20 24 32 40 48 64 80 96`.
Interdit : `13`, `18`, `27`. Si une valeur hors échelle semble nécessaire, le problème
est le layout, pas l'échelle.

### Grille & layout
Largeur de contenu max · nombre de colonnes · gouttières · breakpoints
(web : 640 / 768 / 1024 / 1280 — RN : compact < 380, standard, large ≥ 430).
Rythme vertical des sections : 2 ou 3 valeurs de padding vertical, pas dix.

### Radius
Maximum 4 valeurs, dont `0` et `full`. Le radius est un **signal de personnalité** :
coins nets = brut/technique, coins doux = amical/consumer. Décider une fois.

### Élévation / ombres
Maximum 3 niveaux, avec une règle d'usage explicite (quoi flotte au-dessus de quoi).
Sur fond sombre, préférer une bordure claire à une ombre : une ombre noire sur du
sombre ne fait rien. Ombre dure décalée sans flou = look sérigraphie.

### États
Pour chaque élément interactif, définir les 6 : `default · hover · focus-visible ·
active · disabled · loading`. `focus-visible` n'est jamais supprimé — il est redessiné.

### Motion
Durées nommées (`fast` 140, `base` 220, `slow` 320), 2 courbes d'easing nommées,
et la règle de réduction de mouvement.

---

## 4. Composants

Créer un composant seulement quand la règle des trois est atteinte : **3 usages réels**,
ou 2 usages plus une certitude d'un troisième. Avant ça, du style local suffit.

Ordre de construction : primitives d'interaction (bouton, champ, contrôle de sélection)
→ conteneurs (surface, section, liste) → composés (carte, en-tête, barre de navigation).

Pour chaque composant, écrire : variantes (≤ 3), tailles (≤ 3), états, contraintes
(ce qu'il ne fait pas), et un exemple d'usage.

**Les cards ne sont pas un layout par défaut.** Une card se justifie quand l'élément est
autonome, cliquable et comparable à ses voisins. Une liste de lignes séparées par des
filets est souvent plus lisible, plus dense et moins générique. Si la page compte plus
de deux familles de cards, le système est en train de dériver.

---

## 5. Implémentation

**React Native** — source unique : un `constants/theme.ts`, exports `as const`
et types dérivés. `tailwind.config.js` reflète les mêmes valeurs pour NativeWind : les
deux doivent rester synchronisés, `theme.ts` fait autorité en cas de divergence.

**Web** — CSS custom properties sur `:root`, redéfinies pour le thème sombre ;
Tailwind consomme les variables plutôt que de dupliquer les valeurs.

Dans les deux cas, exporter aussi les **types** : un token invalide doit échouer à la
compilation, pas au rendu.

---

## Livrable

- Le code du thème mis à jour (`constants/theme.ts` et/ou les variables CSS).
- `design/brand/<projet>-SYSTEM.md` : la table des tokens sémantiques avec leur usage,
  et les règles de composition (ce qui va avec quoi).
- Un rapport court : combien de valeurs arbitraires supprimées, quels doublons fusionnés.

Enchaîne ensuite sur le build, puis obligatoirement sur `visual-qa`.
