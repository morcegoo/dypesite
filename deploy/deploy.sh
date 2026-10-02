#!/bin/bash
# Deploy automatico dos sites: GitHub (origin/main) -> /var/www/dypesite
# O que vale e o arquivo de estado (ultimo commit publicado), nao o working tree.
# Nunca edite os arquivos na VPS: a fonte da verdade e o repositorio.
set -uo pipefail

SRC=/srv/dypesite-src
WEB=/var/www/dypesite
LOG=/var/log/dypesite-deploy.log
BK=/var/backups/dypesite-deploy
STATE=/var/lib/dypesite-deploy/deployed
BR="${DEPLOY_BRANCH:-main}"
SITES="${DEPLOY_SITES:-games}"

log(){ echo "$(date -Is) $*" >> "$LOG"; }

[ -d "$SRC/.git" ] || exit 0
cd "$SRC" || exit 0
git remote get-url origin >/dev/null 2>&1 || exit 0

exec 9>/var/run/dypesite-deploy.lock
flock -n 9 || exit 0

mkdir -p "$(dirname "$STATE")"

git fetch -q --prune origin "$BR" 2>>"$LOG" || { log "fetch falhou (rede/credencial)"; exit 0; }
REMOTE=$(git rev-parse "origin/$BR" 2>/dev/null || echo "")
[ -n "$REMOTE" ] || { log "origin/$BR nao encontrado"; exit 0; }
DEPLOYED=$(cat "$STATE" 2>/dev/null || echo none)
[ "$REMOTE" = "$DEPLOYED" ] && exit 0

log "deploy ${DEPLOYED:0:8} -> ${REMOTE:0:8}"
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BK"
for s in $SITES; do
  [ -d "$SRC/$s" ] || continue
  mkdir -p "$BK/$s-$STAMP"
  rsync -a "$WEB/$s/" "$BK/$s-$STAMP/" 2>>"$LOG"
done

git reset -q --hard "$REMOTE" || { log "ERRO no git reset --hard"; exit 1; }

FAIL=0
for s in $SITES; do
  [ -d "$SRC/$s" ] || continue
  mkdir -p "$WEB/$s"
  if rsync -a --delete "$SRC/$s/" "$WEB/$s/" 2>>"$LOG"; then
    chown -R www-data:www-data "$WEB/$s"
  else
    log "ERRO no rsync de $s"; FAIL=1
  fi
done

find "$BK" -maxdepth 1 -mindepth 1 -type d -mtime +14 -exec rm -rf {} + 2>/dev/null

if [ "$FAIL" = 0 ]; then
  echo "$REMOTE" > "$STATE"
  log "ok publicado ${REMOTE:0:8} (backup $STAMP)"
else
  log "falhou ${REMOTE:0:8} - estado mantido, tenta de novo no proximo ciclo"
fi
exit 0
