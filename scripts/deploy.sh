#!/usr/bin/env bash
# Publica o build estático na Vercel (time WESLEY, projeto "baroneslabs2.0").
# Uso: bash scripts/deploy.sh            → produção
#      bash scripts/deploy.sh preview    → URL de prévia
# O token vem do ambiente (VERCEL_TOKEN) ou é injetado pelo proxy da sessão na nuvem.
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT="baroneslabs2.0"
SCOPE="wesley-a819"
TOKEN="${VERCEL_TOKEN:-proxy-injected}"
CLI="npx --yes vercel@39.1.1"

npm run build
cp vercel.json dist/vercel.json   # cabeçalhos de cache

cd dist
$CLI link --yes --project "$PROJECT" --scope "$SCOPE" --token "$TOKEN"
if [ "${1:-prod}" = "preview" ]; then
  $CLI deploy --yes --scope "$SCOPE" --token "$TOKEN"
else
  $CLI deploy --prod --yes --scope "$SCOPE" --token "$TOKEN"
fi
