# Deploy

Automacao: quando chega push na `main`, a VPS publica sozinha em ate 1 minuto.

| Arquivo | Destino na VPS |
|---|---|
| `deploy.sh` | `/usr/local/bin/dypesite-deploy` |
| `dypesite-deploy.service` / `.timer` | `/etc/systemd/system/` |
| `dypesite-deploy.env` | `/etc/dypesite-deploy.env` |

Instalar/atualizar na VPS:

```bash
cp deploy/deploy.sh /usr/local/bin/dypesite-deploy && chmod 755 /usr/local/bin/dypesite-deploy
cp deploy/dypesite-deploy.service deploy/dypesite-deploy.timer /etc/systemd/system/
cp deploy/dypesite-deploy.env /etc/dypesite-deploy.env
systemctl daemon-reload && systemctl enable --now dysite-deploy.timer
```

Forcar publicacao agora: `systemctl start dysite-deploy`
Acompanhar: `journalctl -u dysite-deploy -n 50 --no-pager` ou `/var/log/dypesite-deploy.log`
Reverter: `git -C /srv/dypesite-src reset --hard <commit>` e `systemctl start dysite-deploy`
