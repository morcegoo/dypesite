# dypesite

Repositório dos sites hospedados em **dypesite.com**.
Cada pasta de site é publicada automaticamente na VPS a cada push na branch `main`.

## Sites

| Pasta    | URL pública                     | Destino na VPS              |
|----------|---------------------------------|-----------------------------|
| `games/` | https://dypesite.com/games/     | `/var/www/dypesite/games/`  |

## Como publicar

1. Edite os arquivos do site na pasta correspondente.
2. `git add`, `git commit`, `git push origin main`.
3. Em até 1 minuto a VPS busca o commit e publica sozinha.

## Como funciona

- A VPS mantém o checkout em `/srv/dypesite-src`.
- O timer `dypesite-deploy.timer` roda `dypesite-deploy` a cada 60s: `git fetch`,
  compara com o que está no ar, faz backup do site atual em
  `/var/backups/dypesite-deploy/` e só então publica com `rsync --delete`.
- Log: `/var/log/dypesite-deploy.log` (`journalctl -u dysite-deploy`).
- Deploy manual: `systemctl start dysite-deploy`.
- Cache: o HTML é dinâmico (sem cache); assets em `/games/assets/`,
  `/games/imagens/` e `/games/media/` têm cache de 30 dias pelo Cloudflare/nginx,
  então ao trocar um asset, mude o nome ou adicione `?v=N` na referência.

## Adicionar outro site

1. Crie a pasta do site na raiz do repositório (ex.: `loja/`).
2. Acrescente o nome em `DEPLOY_SITES` no script `/usr/local/bin/dypesite-deploy`
   da VPS (ou em `/etc/dysite-deploy.env`).
3. Faça o push — o destino na VPS é `/var/www/dypesite/<pasta>/`.
