#!/usr/bin/env bash
# Sync environment variables from a local env file to the linked Vercel project.
#
# Usage:
#   scripts/sync-vercel-env.sh [--dry-run] [--file .env] [--env production,preview]
#
# - Only the keys listed in KEYS are pushed; anything else in the file is ignored.
# - Existing values are overwritten (`--force`).
# - Secrets are stored as Vercel "sensitive" variables (write-only in the dashboard).
# - Sensitive variables can't target `development`, so it is not a default target;
#   local development reads `.env` directly.
# - The database URL is not synced: the Vercel ↔ Neon integration
#   (neon-copper-candle) injects DATABASE_URL into the project.
# - Requires `vercel link` to have been run (creates .vercel/project.json).
set -euo pipefail

ENV_FILE=".env"
TARGETS="production,preview"
DRY_RUN=0
VERCEL="${VERCEL_BIN:-npx -y vercel@latest}"

# key:kind — kind is "secret" or "config"
KEYS=(
  "NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY:config"
  "NUXT_CLERK_SECRET_KEY:secret"
  "NUXT_ADMIN_EMAIL:config"
  "NUXT_SITE_URL:config"
)

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --file) ENV_FILE="$2"; shift ;;
    --env) TARGETS="$2"; shift ;;
    -h|--help) sed -n '2,13p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done

cd "$(dirname "$0")/.."

[[ -f "$ENV_FILE" ]] || { echo "Env file not found: $ENV_FILE" >&2; exit 1; }
[[ -f .vercel/project.json ]] || { echo "Project not linked. Run: npx vercel link" >&2; exit 1; }

# Read KEY's value from the env file without sourcing it (URLs contain & and ?).
read_value() {
  local key="$1" line value
  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 || true)"
  [[ -z "$line" ]] && return 1
  value="${line#*=}"
  # Strip one layer of matching surrounding quotes.
  if [[ "$value" =~ ^\"(.*)\"$ || "$value" =~ ^\'(.*)\'$ ]]; then
    value="${BASH_REMATCH[1]}"
  fi
  printf '%s' "$value"
}

mask() {
  local v="$1"
  if (( ${#v} <= 8 )); then printf '****'; else printf '%s…%s' "${v:0:4}" "${v: -2}"; fi
}

synced=0 skipped=0
for entry in "${KEYS[@]}"; do
  key="${entry%%:*}"
  kind="${entry##*:}"

  if ! value="$(read_value "$key")" || [[ -z "$value" ]]; then
    echo "skip  $key (not set in $ENV_FILE)"
    skipped=$((skipped + 1))
    continue
  fi

  flag="--no-sensitive"
  [[ "$kind" == "secret" ]] && flag="--sensitive"
  shown="$value"
  [[ "$kind" == "secret" ]] && shown="$(mask "$value")"

  echo "sync  $key=$shown → $TARGETS ($kind)"
  if (( DRY_RUN == 0 )); then
    IFS=',' read -ra envs <<<"$TARGETS"
    for target in "${envs[@]}"; do
      # Value goes over stdin so it never shows up in the process list.
      printf '%s' "$value" | $VERCEL env add "$key" "$target" $flag --force --yes >/dev/null
    done
  fi
  synced=$((synced + 1))
done

echo
echo "Done: $synced synced, $skipped skipped$( (( DRY_RUN )) && echo ' (dry run)')."
(( DRY_RUN )) || echo "Redeploy for changes to take effect: npx vercel --prod"
