---
name: visual-qa
description: Contrôle réel du rendu d'une interface après développement — ouverture dans un vrai navigateur via Playwright, captures desktop/tablette/mobile, détection de débordements, contraste, cibles tactiles, hiérarchie, accessibilité de base et signaux de design générique. À utiliser systématiquement après avoir codé ou modifié une page, un écran ou un composant visuel, et dès que l'utilisateur dit "vérifie le rendu", "ça donne quoi", "teste en mobile", "responsive", "QA visuelle", "regarde la page", "screenshot". Ne jamais déclarer une interface bonne parce que le code compile.
allowed-tools: Bash, Read, Glob, Grep, Edit, Write
---

# Visual QA

Le code qui compile ne prouve rien. **Regarde.**
Une QA visuelle sans capture ouverte et lue est une QA inventée.

## 1. Capturer

```bash
# installation globale du studio
node ~/.claude/skills/visual-qa/scripts/shoot.mjs <url|fichier.html> [options]

# projet équipé en local (install.sh --init)
node .claude/skills/visual-qa/scripts/shoot.mjs <url|fichier.html> [options]
```

Options : `--viewports mobile,tablet,desktop` (défaut `mobile,desktop`) ·
`--out <dir>` (défaut `design/qa/<horodatage>`) · `--wait <ms>` ·
`--selector <css>` (attendre un élément) · `--dark`.

Le script produit par viewport un PNG pleine page, un PNG au-dessus de la ligne de
flottaison, et un `report.json`. Il détecte automatiquement :
débordement horizontal · éléments hors viewport · contraste sous WCAG AA ·
texte < 12 px · cibles tactiles < 44 px · images sans `alt` · contrôles sans nom
accessible · sauts de niveau de titre · erreurs console.
Plus des **signaux anti-slop** : nombre de tailles de texte, de couleurs, de radius,
d'ombres, de gradients, de blocs type card.

**Puis ouvre les PNG avec l'outil Read.** Les métriques ne remplacent pas l'œil :
le script ne voit pas une composition molle, un rythme plat ou une typo sans intention.

Si Playwright est indisponible et ne peut pas être installé, dis-le explicitement et
mène la QA en lecture de code — sans jamais présenter le résultat comme vérifié visuellement.

## 2. Cibles selon le projet

**Web** — servir puis capturer :
```bash
npx --yes serve -l 4173 dist &   # ou: npm run dev
node ~/.claude/skills/visual-qa/scripts/shoot.mjs http://localhost:4173 --viewports mobile,tablet,desktop
```
Un fichier HTML statique peut être passé directement en chemin, sans serveur.

**React Native / Expo** — Playwright voit l'app via Expo Web.
Prérequis à installer une fois : `npx expo install react-dom react-native-web`.
Puis :
```bash
npx expo start --web --port 8081 &
node ~/.claude/skills/visual-qa/scripts/shoot.mjs http://localhost:8081 --viewports mobile --wait 2500
```
Expo Web ne rend pas fidèlement Reanimated, `expo-blur` ni les haptics : traiter le
résultat comme un contrôle de **mise en page, densité, contraste et hiérarchie**, pas
comme un rendu de référence. Pour un contrôle fidèle, demander une capture sur appareil.

Si Expo Web n'est pas installé, ne l'installe pas en silence : signale la commande et
mène la QA sur les composants isolés — extraire un composant dans une page HTML de test
avec les tokens du projet reste un contrôle valable de proportions et de couleur.

## 3. Grille de lecture des captures

Regarde dans cet ordre. C'est l'ordre dans lequel un défaut coûte cher.

**Structure**
- Y a-t-il **une** chose que l'œil voit en premier ? Si deux éléments se disputent
  l'attention, la hiérarchie est cassée.
- Le CTA principal est-il visible sans scroll, sur mobile aussi ?
- La page se lit-elle sans lire le texte — juste par les masses ?

**Rythme**
- Les sections varient-elles en hauteur, en fond, en alignement ? Trois sections
  consécutives identiques = page morte.
- Les espacements sont-ils issus de l'échelle, ou improvisés ? Un écart de 6 px entre
  deux blocs censés être frères se voit.

**Alignement & proportions**
- Bords gauches alignés sur la grille, colonne après colonne.
- Longueur de ligne du corps de texte : 45–75 caractères. Au-delà, illisible.
- Le texte respire-t-il par rapport à ses bordures (padding ≥ 1.5× la taille du texte) ?

**Couleur & contraste**
- L'accent reste-t-il rare ? Au-delà de ~10 % de la surface il ne signale plus rien.
- Le texte secondaire est-il encore lisible, ou juste « décoratif gris » ?

**Mobile spécifiquement**
- Rien ne déborde (le script le dit — mais regarde aussi les tableaux et les titres longs).
- Les titres display ne se cassent pas en escalier illisible.
- Les cibles tactiles ne se touchent pas (≥ 8 px entre deux zones cliquables).
- La navigation reste atteignable au pouce.

**États**
- Vérifier `hover`, `focus-visible`, `active`, `disabled`, `loading`, et les états
  **vide** et **erreur** — presque toujours oubliés et presque toujours vus par l'utilisateur.

## 4. Rapport

Ne rends pas une liste de 40 points. Rends :

1. **Bloquants** — ce qui casse l'usage (débordement, illisible, CTA invisible, contraste).
2. **Majeurs** — ce qui fait « pas fini » (rythme, alignements, proportions, hiérarchie).
3. **Détails** — finition.

Puis **corrige directement** les bloquants et les majeurs sans demander l'autorisation,
et **recapture** pour prouver la correction. Une correction non revérifiée n'est pas une
correction.

Enchaîne sur `anti-ai-slop` pour la critique esthétique — la QA dit si c'est cassé,
`anti-ai-slop` dit si c'est générique.
