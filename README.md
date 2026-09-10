# Design Studio

Une chaîne de conception d'interfaces pour Claude Code, installée une fois et active
dans **tous** tes projets.

```
IDÉE → STRATÉGIE PRODUIT → DIRECTION ARTISTIQUE → DESIGN SYSTEM → BUILD
     → REVUE NAVIGATEUR → CRITIQUE → POLISH → QA RESPONSIVE → LIVRAISON
```

Le critère de fin n'est pas « le code compile ».
C'est **« ça marche ET ça a l'air conçu par un excellent designer ».**

---

## Installation

```bash
git clone https://github.com/ria8733/design-studio.git ~/design-studio
cd ~/design-studio && ./install.sh
```

Ça place dans `~/.claude/` :

| Quoi | Où | Effet |
|---|---|---|
| 5 Skills | `~/.claude/skills/` | se déclenchent seuls dès que tu parles design, dans n'importe quel projet |
| Commande `/design` | `~/.claude/commands/` | lance la boucle complète en 8 passes |
| Doctrine | `~/.claude/CLAUDE.md` | règles permanentes, injectées entre marqueurs sans toucher au reste du fichier |

Playwright est requis par la QA visuelle :

```bash
npm i -g playwright && npx playwright install chromium
```

**Autres commandes** — `./install.sh --link` (liens symboliques, suit le dépôt) ·
`--status` (état de l'installation) · `--uninstall` (retrait propre, restaure ton
`CLAUDE.md` à l'identique) · `--init <dir>` (équipe un projet, voir plus bas).

---

## Usage

Une fois installé, rien à invoquer : les Skills se déclenchent sur l'intention.

```
« crée-moi la landing page de ce projet, premium et différenciante »
« ça fait générique, non ? »
« vérifie le rendu en mobile »
« harmonise les espacements, c'est parti dans tous les sens »
```

Pour la boucle complète et explicite :

```
/design refonte de l'écran de collection, plus dense et plus lisible
```

---

## Les 5 Skills

| Skill | Ce qu'il fait | Se déclenche sur |
|---|---|---|
| **design-director** | Brief business → direction artistique **décidée** : concept, références réelles, typo, palette, composition, rythme, motion. Trois questions bloquantes maximum, le reste est tranché et assumé | concevoir un écran, une page, une identité · « premium » · « différenciant » · « quelle vibe » |
| **design-system** | DA → tokens sémantiques, échelles, grilles, états, motion, composants. Audite et **réduit** les valeurs arbitraires avant d'en créer | « design system » · « tokens » · « harmonise les styles » · styles incohérents |
| **visual-qa** | Ouvre réellement l'interface dans Chromium, capture en mobile / tablette / desktop, audite le DOM rendu, puis **lit** les captures | après tout build visuel · « ça donne quoi » · « teste en mobile » · « responsive » |
| **anti-ai-slop** | Critique de directeur artistique extérieur. Exactement 5 défauts majeurs, chacun avec son remplacement concret | « ça fait générique » · « ça fait IA » · « c'est fade » · avant livraison |
| **landing-page** | Proposition de valeur → architecture de l'info → message → storytelling → sections → build → conversion | landing page · page produit · page de vente · homepage |

---

## La QA visuelle

C'est la brique qui distingue ce studio d'un fichier de bonnes intentions : le rendu est
**réellement regardé**, pas déduit du code.

```bash
node ~/.claude/skills/visual-qa/scripts/shoot.mjs http://localhost:5173 \
  --viewports mobile,tablet,desktop
node ~/.claude/skills/visual-qa/scripts/shoot.mjs page.html --dark
```

Produit par viewport une capture pleine page, une capture au-dessus de la ligne de
flottaison, et un `report.json`. Détecte automatiquement :

- débordement horizontal et éléments hors viewport ;
- contraste sous WCAG AA, calculé sur le fond effectif hérité ;
- texte sous 12 px, cibles tactiles sous 44 px ;
- `alt` manquants, contrôles sans nom accessible, sauts de niveau de titre ;
- erreurs console.

Plus des **signaux anti-générique** : dispersion de l'échelle typographique, radius et
ombres incohérents, gradients en excès, mur de cards, nombre de `h1`.

Les métriques ne remplacent pas l'œil : le script ne voit pas une composition molle ni un
rythme plat. Il sert à ce que Claude ouvre les captures et les lise.

---

## Équiper un projet

L'installation globale suffit pour travailler. Pour qu'un projet porte **son contexte**
— sans quoi la production part générique :

```bash
~/design-studio/install.sh --init /chemin/vers/le/projet
```

Crée un `CLAUDE.md` de projet (section 1 à remplir : stack, utilisateur, objectif, DA en
vigueur, chemin des tokens), un `.mcp.json` (Playwright + Context7), `design/brand/`, et
ajoute `design/qa/` au `.gitignore`. N'écrase jamais un fichier existant.

```
<projet>/
├── CLAUDE.md          contexte spécifique  ← la seule partie à écrire à la main
├── .mcp.json          Playwright + Context7
└── design/
    ├── brand/         DA et design systems validés (versionné)
    └── qa/            captures et rapports (ignoré par git)
```

`design/brand/` est la mémoire du projet : une DA validée ne se réinvente pas à chaque écran.

---

## Ce que le studio refuse

Gradient violet/bleu gratuit · murs de cards · glassmorphism non justifié ·
border-radius XXL partout · hero « texte à gauche + dashboard à droite » · icônes
décoratives répétitives · sections toutes identiques · témoignages inventés · métriques
inventées · faux dashboards · animations gratuites · stock photos génériques · emoji en
guise d'iconographie.

Catalogue complet, symptôme par symptôme, avec les remplacements :
`skills/anti-ai-slop/references/tells.md`.

---

## Outillage

- **Playwright** — les yeux. Script direct pour les captures, MCP quand il faut
  interagir avec la page (clics, formulaires, états au survol).
- **Context7** (MCP) — documentation à jour plutôt qu'API inventée.
- **Figma** (connecteur claude.ai) — lire un design, récupérer composants et variables,
  comparer design ↔ implémentation. Pas de maquette obligatoire : code-first est
  légitime sur un prototype rapide.
- **Framer** — publication et design interactif en aval.

Écartés volontairement, avec les raisons : shadcn MCP, Chrome DevTools MCP, et les
plugins `figma` et `design` du catalogue. Voir `docs/AUDIT-ENVIRONNEMENT.md`.

---

## Structure

```
design-studio/
├── install.sh                 installation globale, --init, --status, --uninstall
├── doctrine.md                injecté dans ~/.claude/CLAUDE.md
├── skills/                    les 5 Skills
│   └── visual-qa/scripts/shoot.mjs
├── commands/design.md         la commande /design
├── templates/                 CLAUDE.project.md · mcp.json
└── docs/AUDIT-ENVIRONNEMENT.md
```
