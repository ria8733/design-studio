# Audit de l'environnement Claude Code — Design Studio

Date : 2026-09-10 · Dépôt : `ria8733/snaff` · Poste : conteneur distant Claude Code

---

## 1. État constaté avant intervention

**Dépôt** — aucun `CLAUDE.md`, aucun `.claude/`, aucun `.mcp.json`.
Le seul document de design était `DESIGN_HANDOFF.md` (bon contenu, mais passif :
un document que Claude doit penser à ouvrir n'est pas une règle).
Stack : Expo 54 / React Native 0.81 / expo-router / TypeScript / NativeWind.
Design system déjà présent et correct dans `constants/theme.ts`, miroir dans
`tailwind.config.js`.

**Configuration globale** — hooks git (identité, contrôle au Stop). Aucun réglage design.

**Skills disponibles (synchronisés)** — `client-app-design`, `audit-ia-tpe`,
`agence-juridique-fr`, `cold-loom-outreach` (métier agence) + `canvas-design`,
`algorithmic-art`, `skill-creator`, `mcp-builder`, `docx`/`pptx`/`pdf`/`xlsx`,
`internal-comms`, `morning`, `import-memory`.

**Connecteurs** — Canva, Gmail, Google Calendar, Google Drive, Indeed : connectés.
Notion : à reconnecter. `httpl.to.design` : présent, non connecté.
**Figma : absent.**

**MCP** — aucun MCP de design. Playwright 1.56.1 et Chromium présents en global sur la
machine, mais non exposés à Claude.

---

## 2. Arbitrages

### Ajouté

| Outil | Forme | Justification |
|---|---|---|
| **Playwright** | script direct + MCP (`.mcp.json`) | Les yeux du studio. Le script `shoot.mjs` couvre 90 % du besoin (captures multi-viewport + audit DOM) sans charger le contexte ; le MCP sert quand il faut **interagir** avec la page (clics, formulaires, états au survol) |
| **Context7** | MCP HTTP | Documentation à jour plutôt qu'API inventée. Serveur distant, coût en contexte négligeable |

### Écarté volontairement

| Outil | Raison |
|---|---|
| **shadcn MCP** | Sans objet sur ce dépôt : shadcn est web, Snaff est React Native. À activer **par projet web** qui l'utilise réellement, pas globalement. Ajouter un MCP inutilisé pour 90 % des sessions coûte du contexte à chaque tour |
| **Chrome DevTools MCP** | Redondant avec Playwright pour l'inspection et les captures. À n'ajouter que pour un besoin réel de profiling de performance |
| **Plugin `figma` du catalogue** | 14 Skills + 1 MCP chargés en permanence, alors que l'usage réel de Figma est ponctuel. Le connecteur Figma seul couvre le besoin de lecture (composants, variables, comparaison design ↔ code). À réévaluer si l'usage devient quotidien |
| **Plugin `design` du catalogue** | Fait doublon avec les Skills créés ici (`design-critique` ≈ `anti-ai-slop`, `design-system` ≈ `design-system`) et embarque 9 MCP métier (Asana, Jira, Intercom, Linear, Notion, Slack) sans rapport avec le workflow. Ses Skills utiles et non couverts — `ux-copy`, `accessibility-review`, `research-synthesis` — peuvent être activés seuls plus tard |
| **Plugin `modern-web-guidance`** | Pertinent le jour où un projet web démarre ici. Sur un dépôt React Native, c'est du contexte inutile |
| **Skill « Impeccable »** | Introuvable dans le catalogue accessible à ce compte. Ses fonctions supposées (polish de finition) sont couvertes par la passe 7 et par `anti-ai-slop` |

### Redondances traitées

- `client-app-design` (Skill existant) et `design-director` (créé) se recouvrent en
  apparence. Frontière posée : `client-app-design` cadre un **projet client** (grilling
  des exigences, personas, architecture d'information, spec de livraison) ;
  `design-director` produit une **direction artistique exécutable**. Le premier précède
  le second sur une mission client, et ne sert pas sur un projet perso.
- `canvas-design` et `algorithmic-art` restent : art statique et génératif, hors périmètre UI.
- Le plugin catalogue `design` porte lui aussi un Skill nommé `design-system`. Les Skills
  de plugin sont préfixés (`design:design-system`), donc pas de collision — mais il vaut
  mieux ne pas activer ce plugin pour éviter l'ambiguïté de déclenchement.

---

## 3. Vérifications effectuées

| Point | Résultat |
|---|---|
| Playwright + Chromium présents | ✅ playwright 1.56.1 global, Chromium dans `/opt/pw-browsers` |
| `shoot.mjs` fonctionne | ✅ testé sur une page piégée : débordement horizontal, contraste 1.56:1, texte 9 px, cible 20×20, `alt` manquant, bouton sans nom, saut h1→h3 — **tous détectés** |
| Paquet `@playwright/mcp` | ✅ publié, version 0.0.80 |
| Serveur Context7 joignable | ⚠️ bloqué **depuis ce conteneur distant** (proxy 403, politique réseau de l'environnement). Fonctionnera sur le poste local — configuration laissée en place |
| Connecteur Figma | ❌ non connecté — seule action manuelle requise |

---

## 4. Reste à faire côté humain

1. **Connecter Figma** — claude.ai → Paramètres → Connecteurs → Figma. C'est la seule
   action que je ne peux pas effectuer.
2. *(optionnel)* **Expo Web pour la QA visuelle sur Snaff** — `npx expo install react-dom
   react-native-web`. Non exécuté volontairement : ce dépôt a un historique de builds
   Gradle fragiles, et ajouter des dépendances au projet mobile est une décision produit,
   pas une décision d'outillage.
3. *(optionnel)* **Reconnecter Notion** si le suivi de projet doit revenir dans la boucle.
