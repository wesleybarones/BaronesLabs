#!/usr/bin/env bash
# PreToolUse: bloqueia edição, sobrescrita ou remoção dos arquivos de marca (imagens e vídeos).
# Liberar de propósito: exporte BARONES_ALLOW_ASSET_EDIT=1 antes de abrir o Claude Code.
# Sem dependências além de bash, grep e sed.

[ "${BARONES_ALLOW_ASSET_EDIT:-0}" = "1" ] && exit 0

input=$(cat)
exts='png|jpe?g|webp|gif|svg|ico|mp4|mov|webm'

field() { printf '%s' "$input" | grep -o "\"$1\" *: *\"[^\"]*\"" | head -1 | sed 's/^.*: *"//; s/"$//'; }

block() {
  echo "Bloqueado pelo hook protect-assets: '$1' é um arquivo de marca do BaronesLabs." >&2
  echo "Crie uma versão nova com outro nome em vez de alterar o original, ou peça ao usuário para liberar (BARONES_ALLOW_ASSET_EDIT=1)." >&2
  exit 2
}

case "$(field tool_name)" in
  Write|Edit|MultiEdit|NotebookEdit)
    path=$(field file_path)
    # Criar arquivo novo é permitido; mexer em um que já existe, não.
    if printf '%s' "$path" | grep -Eiq "\.($exts)$" && [ -e "$path" ]; then
      block "$path"
    fi
    ;;
  Bash)
    cmd=$(printf '%s' "$input" | grep -o '"command" *: *".*' | head -1)
    hit=$(printf '%s' "$cmd" | grep -Eio "(\brm\b|\bmv\b|\bcp\b|\btruncate\b|\bshred\b|\bconvert\b|\bmogrify\b|\bffmpeg\b.*-y|>)[^|;&\\]*\.($exts)\b" | head -1)
    [ -n "$hit" ] && block "$hit"
    ;;
esac
exit 0
