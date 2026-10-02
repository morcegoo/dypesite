#!/bin/bash
# Deploy automatico dos sites: /srv/dypesite-src  ->  /var/www/dypesite
# Roda pelo timer systemd (1x por minuto). Nunca apaga o que esta no ar sem backup.
set -uo pipefail

SRC=/srv/dypesite-src
WEB=/var/www/dypesite
LOG=/var/log/dypesite-deploy.log
BK=/var/backups/dypesite-deploy
BR="${DEPLOY_BRANCH:-main}"
SITES="${DEPLOY_SITES:-games}"

log(){ echo "$(date -Is) $*" >> "$LOG"; }

[ -d "$SRC/.git" ] || exit 0
cd "$SRC" || exit 0
git remote get-url origin >/dev/null 2>&1 || exit 0

exec 9>/var/run/dypesite-deploy.lock
flock -n 9 || exit 0

git fetch -q --prune origin "$BR" 2>>"$LOG" || { log "fetch falhou (rede)"; exit 0; }
LOCAL=$(git rev-parse HEAD 2>/dev/null || echo none)
REMOTE=$(git rev-parse "origin/$BR" 2>/dev/null || echo none)
[ -n "$REMOTE" ] || exit 0
[ "$LOCAL" = "$REMOTE" ] && exit 0

log "deploy $LOCAL -> $REMOTE"
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BK"
for s in $SITES; do
  [ -d "$SRC/$s" ] || continue
  mkdir -p "$BK/$s-$STAMP"
  rsync -a "$WEB/$s/" "$BK/$s-$STAMP/" 2>>"$LOG"
done

git reset -q --hard "$REMOTE" || { log "ERRO reset"; exit 1; }

FAIL=0
for s in $SITES; do
  [ -d "$SRC/$s" ] || continue
  mkdir -p "$WEB/$s"
  if rsync -a --delete "$SRC/$s/" "$WEB/$s/" 2>>"$LOG"; then
    chown -R www-data:www-data "$WEB/$s"
  else
    log "ERRO rsync $s"; FAIL=1
  fi
done

find "$BK" -maxdepth 1 -mindepth 1 -type d -mtime +14 -exec rm -rf {} + 2>/dev/null

if [ "$FAIL" = 0 ]; then log "ok $REMOTE"; else log "falhou $REMOTE"; fi
exit 0
