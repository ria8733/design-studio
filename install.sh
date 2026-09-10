#!/usr/bin/env bash
# Design Studio — installation.
#
#   ./install.sh                 installe le studio pour TOUS les projets (~/.claude)
#   ./install.sh --link          idem, en liens symboliques (suit ce dépôt)
#   ./install.sh --init <dir>    équipe un projet précis (CLAUDE.md, .mcp.json, arbo)
#   ./install.sh --status        montre ce qui est installé
#   ./install.sh --uninstall     retire l'installation globale
#
# L'installation globale place :
#   ~/.claude/skills/<5 skills>    déclenchés automatiquement selon la demande
#   ~/.claude/commands/design.md   la commande /design
#   ~/.claude/CLAUDE.md            la doctrine, entre marqueurs, dans tous les projets

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CFG="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
SKILLS=(design-director design-system visual-qa anti-ai-slop landing-page)
BEGIN_MARK="<!-- BEGIN design-studio — géré par install.sh, ne pas éditer à la main -->"
END_MARK="<!-- END design-studio -->"

die() { printf 'erreur: %s\n' "$*" >&2; exit 1; }
ok()  { printf '  \033[32m✓\033[0m %s\n' "$*"; }
info(){ printf '  \033[2m•\033[0m %s\n' "$*"; }

# --- doctrine dans ~/.claude/CLAUDE.md (idempotent) --------------------------
install_doctrine() {
  local target="$CFG/CLAUDE.md" tmp
  tmp="$(mktemp)"
  if [[ -f "$target" ]]; then
    awk -v b="$BEGIN_MARK" -v e="$END_MARK" '
      index($0,b){skip=1} !skip{print} index($0,e){skip=0}
    ' "$target" > "$tmp"
    # retire les lignes vides en trop laissées par la suppression du bloc
    awk 'BEGIN{n=0} {if($0==""){n++}else{n=0} if(n<3)print}' "$tmp" > "$tmp.2" && mv "$tmp.2" "$tmp"
  fi
  [[ -s "$tmp" ]] && printf '\n' >> "$tmp"
  { printf '%s\n' "$BEGIN_MARK"; cat "$ROOT/doctrine.md"; printf '%s\n' "$END_MARK"; } >> "$tmp"
  mkdir -p "$CFG"
  mv "$tmp" "$target"
  ok "doctrine        → $target (bloc design-studio)"
}

# --- installation globale ----------------------------------------------------
install_global() {
  local mode="$1"
  mkdir -p "$CFG/skills" "$CFG/commands"
  for s in "${SKILLS[@]}"; do
    [[ -d "$ROOT/skills/$s" ]] || die "introuvable: $ROOT/skills/$s"
    rm -rf "$CFG/skills/$s"
    if [[ "$mode" == "link" ]]; then ln -s "$ROOT/skills/$s" "$CFG/skills/$s"
    else cp -R "$ROOT/skills/$s" "$CFG/skills/$s"; fi
  done
  ok "5 Skills        → $CFG/skills/  (${SKILLS[*]})"

  if [[ "$mode" == "link" ]]; then ln -sf "$ROOT/commands/design.md" "$CFG/commands/design.md"
  else cp "$ROOT/commands/design.md" "$CFG/commands/design.md"; fi
  ok "commande        → /design"

  install_doctrine

  printf '\n\033[1mStudio actif dans tous tes projets.\033[0m\n\n'
  cat <<'NOTE'
  Les Skills se déclenchent seuls quand tu parles design.
  La boucle complète en 8 passes :   /design <ton brief>

  Playwright est requis par visual-qa. S'il manque :
    npm i -g playwright && npx playwright install chromium

  Pour équiper un projet de son contexte (CLAUDE.md + MCP + arborescence) :
    ./install.sh --init /chemin/vers/le/projet
NOTE
}

# --- équipement d'un projet --------------------------------------------------
init_project() {
  local dir="${1:-}"
  [[ -n "$dir" ]] || die "usage: --init <chemin/du/projet>"
  [[ -d "$dir" ]] || die "dossier introuvable: $dir"
  dir="$(cd "$dir" && pwd)"
  local name; name="$(basename "$dir")"

  mkdir -p "$dir/design/brand"
  ok "design/brand/   → sorties DA et design system (à versionner)"

  if [[ -f "$dir/CLAUDE.md" ]]; then
    info "CLAUDE.md existe déjà — non écrasé. Template : $ROOT/templates/CLAUDE.project.md"
  else
    sed "s/{{PROJECT}}/$name/g" "$ROOT/templates/CLAUDE.project.md" > "$dir/CLAUDE.md"
    ok "CLAUDE.md       → contexte projet   ⚠ section 1 À REMPLIR"
  fi

  if [[ -f "$dir/.mcp.json" ]]; then
    info ".mcp.json existe déjà — non écrasé."
  else
    cp "$ROOT/templates/mcp.json" "$dir/.mcp.json"
    ok ".mcp.json       → Playwright + Context7"
  fi

  if [[ -f "$dir/.gitignore" ]] && ! grep -qE '^design/qa/?$' "$dir/.gitignore"; then
    [[ -n "$(tail -c1 "$dir/.gitignore" 2>/dev/null)" ]] && printf '\n' >> "$dir/.gitignore"
    printf '\n# Design Studio — captures et rapports de QA visuelle\ndesign/qa/\n' >> "$dir/.gitignore"
    ok ".gitignore      → design/qa/ ignoré"
  fi

  printf '\n  Remplis la section 1 de %s/CLAUDE.md, puis : /design <ton brief>\n\n' "$dir"
}

# --- état --------------------------------------------------------------------
status() {
  printf '\n\033[1mDesign Studio — état\033[0m\n  source: %s\n  config: %s\n\n' "$ROOT" "$CFG"
  for s in "${SKILLS[@]}"; do
    if [[ -L "$CFG/skills/$s" ]]; then ok "$s (lien)"
    elif [[ -d "$CFG/skills/$s" ]]; then ok "$s (copie)"
    else printf '  \033[31m✗\033[0m %s — absent\n' "$s"; fi
  done
  [[ -e "$CFG/commands/design.md" ]] && ok "commande /design" || printf '  \033[31m✗\033[0m commande /design — absente\n'
  if [[ -f "$CFG/CLAUDE.md" ]] && grep -qF "$BEGIN_MARK" "$CFG/CLAUDE.md"; then ok "doctrine dans $CFG/CLAUDE.md"
  else printf '  \033[31m✗\033[0m doctrine — absente de %s/CLAUDE.md\n' "$CFG"; fi
  if command -v npx >/dev/null && npx --no-install playwright --version >/dev/null 2>&1; then ok "playwright disponible"
  elif command -v playwright >/dev/null 2>&1; then ok "playwright disponible"
  else printf '  \033[33m!\033[0m playwright introuvable — npm i -g playwright && npx playwright install chromium\n'; fi
  printf '\n'
}

# --- désinstallation ---------------------------------------------------------
uninstall() {
  for s in "${SKILLS[@]}"; do rm -rf "$CFG/skills/$s" && ok "retiré $s"; done
  rm -f "$CFG/commands/design.md" && ok "retiré /design"
  local target="$CFG/CLAUDE.md" tmp
  if [[ -f "$target" ]] && grep -qF "$BEGIN_MARK" "$target"; then
    tmp="$(mktemp)"
    awk -v b="$BEGIN_MARK" -v e="$END_MARK" '
      index($0,b){skip=1} !skip{print} index($0,e){skip=0}
    ' "$target" > "$tmp" && mv "$tmp" "$target"
    ok "doctrine retirée de $target"
  fi
  printf '\n  Studio désinstallé. Les CLAUDE.md et design/ des projets sont intacts.\n\n'
}

case "${1:-}" in
  "")          printf '\n\033[1mInstallation globale du Design Studio\033[0m\n\n'; install_global copy ;;
  --link)      printf '\n\033[1mInstallation globale du Design Studio (liens)\033[0m\n\n'; install_global link ;;
  --init)      printf '\n\033[1mÉquipement du projet\033[0m\n\n'; init_project "${2:-}" ;;
  --status)    status ;;
  --uninstall) uninstall ;;
  -h|--help)   sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//' ;;
  *)           die "option inconnue: $1  (voir --help)" ;;
esac
