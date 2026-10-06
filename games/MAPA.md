# MAPA.md — dypesite/games

**Deploy:** commit + push na `main` → rsync automático (leva ~1 a 3 min). Validar sempre com cache-buster: `?cb=$(date +%s)`.
**Como usar:** ler este arquivo primeiro. Se o alvo está aqui, ir direto na linha. É proibido abrir arquivo inteiro (>300 linhas); usar `rg -n` → `sed -n 'A,Bp'` (máx. 80 linhas).

## Estrutura
| caminho | o que é |
|---|---|
| `games/index.html` | site atual · 470 KB · SPA com rotas `#/aba` · **não mexer sem pedido explícito** |
| `games/novo/index.html` | tela nova (vitrine neon) · ~60 KB · **é aqui que a tela nova vive** |
| `games/novo/dados.json` | dados dos cards da tela nova (destaques, jogos, consoles, acessórios, setup, era, gta, textos) |
| `games/novo/embed.css` | pele escura do site atual quando ele abre dentro do painel |
| `games/novo/media/` | `hero.mp4`, `hero.webm`, `hero-poster.jpg`, `miami.jpg`, `cidade.jpg` |
| `games/media/` | mídia do site atual (`media/gta/…`, `media/loja/…`, `media/nov/…`, `media/era/…`) |
| `games/assets/inline/` | fotos inline do site atual |

## games/index.html — site atual
| item | linha | seletor / função |
|---|---|---|
| faixa "Demonstração · produtos e preços de exemplo" | 1956 | `.demo` |
| cabeçalho do topo | 1957 | `header.hd` |
| botão do carrinho | 1964 | `#cartBtn` (`#cartN` é o contador) |
| menu de abas | 1967 | `nav.tabs#tabs` |
| linha da busca + chips | 1970-1972 | `.srow` · `#q` · `.pchip` ("Pré-venda disponível") |
| container onde as abas renderizam | 1974 | `.views#views` |
| rodapé | 1976 | `footer.foot` |
| menu inferior | 1977 | `nav.bnav` |
| carrinho (drawer) | 2009 | `aside.sheet#sheet` · lista `#cartList` |
| **WhatsApp** | 2020 | `var WA = 'https://wa.me/55XXXXXXXXXXX'` (trocar o número aqui) |
| animação (nome colide) | 2932 | `function show(el,kf,opt)` — NÃO é troca de aba |
| mapa das abas | 4181 | `var RENDER = {home,jogos,consoles,acess,controles,tcg,conserto,era,gta}` |
| **troca de aba** | 4188 | `function show(key,html)` → `#views.innerHTML = RENDER[key]()` |
| grava a rota na URL | 4198 | `history.replaceState(… '#/'+key)` |
| carrinho: dados | 4344 | `var cart = {}` |
| carrinho: add | 4345 | `function addCart(id,btn)` |
| carrinho: render | 4358 | `function renderCart()` |
| cupom (localStorage) | 4385 / 4394 | chave `dypeCupom` |
| reserva GTA (sessionStorage) | 3634 | chave `dypeGtvRes` |
| rota → aba | 4413 | `function fromHash()` (lê `#/aba`) |
| reação ao hash | 4414 | `window.addEventListener('hashchange', …)` → `show(k)` |
| montador de setup | 2632 | dentro da aba **Acessórios** (`#/acess`) |

**Links diretos:** `/games/#/jogos` · `#/consoles` · `#/acess` (inclui o Montador de Setup) · `#/era` · `#/gta` · `#/controles` · `#/tcg` · `#/conserto` · `#/home`.
Contato não é aba: está no `footer.foot` + WhatsApp (`var WA`).

## games/novo/index.html — tela nova
| item | linha | seletor / função |
|---|---|---|
| cores/fontes | 15 | `:root` (`--a1 --a2 --gold --cyan --bg --ink --muted --glass --line --f-*`) |
| **CSS prateleira de vidro** | 175 | `#pop.sheet` · `.shelf` 186 · `.srow` 190 (`--covw`/`--covh`) · `.sp` 192 · `.stage` 197 · `.cov` 198 · `.sinfo` 204 · `.seal` 210 · `.snav` 211 |
| **CSS painel sem armação** | 268 | `#pop .card` 269 (sem moldura/animação) · `#pop .inner` (transparente em cima, escuro embaixo) · `#pop .it` · `#pop.site .inner` opaco · `@media(min-width:900px)` escurece mais cedo · `@media(max-width:899px)` esconde o `.lead` |
| rodapé/dock | 325 | `nav.dock#dock` (tiles `.tile.k-<id>`) |
| painel | 326 | `section#pop.sheet` (`> .bob > .card > .inner`) |
| cabeçalho do painel | 327 | `#ph` (`flex:none`, nunca por cima) · `#popt` · `#pcount` · `#popOpen` (Abrir/Vitrine) · `#popX` |
| conteúdo das abas | 328 | `#pb` (fileiras `.shelf`) |
| site atual embutido | 329 | `#pf` + `iframe#ifr` |
| **CONFIG** | 341 | `const CFG` → `site`, `wa`, `waMsg`, `rota`, `esconder`, `pele` |
| cenas de fundo | 368 | `const SC` (hero-poster / miami / cidade) |
| dados | 445 | `DATA` + `KEY` (lê `dados.json`) |
| card da vitrine | 454 | `function card(x,k)` — capa + selo + preço; **sem reflexo** (era `.ref`, removido) |
| fileira | 459 | `function shelf(titulo,lista,k,dica)` |
| quais fileiras por aba | 463 | `const ROWS` |
| render da aba | 465 | `function render(id)` |
| **carrossel infinito** | 472 | `function makeInfinite(sc,auto)` — clona os itens 3x (o `.sp` aparece triplicado), desliga o snap e faz a vitrine andar sozinha; pula linha que não rola |
| preencher painel | 491 | `function fillPB(id)` (chama `makeInfinite` em cada `.srow`) |
| abas/dock | 506 | `const MODES` |
| **geometria da folha** | 547 | `function targetRect(i)` — espiada ~34% (celular) / 48% (desktop) → cheia ~16/18% |
| abre o site atual dentro | 586 | `function openSite(r)` |
| Abrir/Vitrine | 615 / 616 | `openSiteNow()` / `closeSiteNow()` |
| rádio (trilha + `--beat`) | 632 | `const Radio` |
| WhatsApp / toast | 687 / 699 | `openWA(msg)` / `toast(s)` |
| pele escura aplicada no iframe | 592 | injeta `#neon-embed` + `link[href=embed.css]` e põe `.neon-embed` no `<html>` do site |

## Avisos
- `.srow` existe nos **dois** arquivos com sentidos diferentes: em `games/index.html:1970` é a linha da busca; em `games/novo/index.html:190` é a fileira da prateleira. Ao buscar, filtrar por arquivo.
- `.sheet`: em `games/index.html:2009` é o drawer do carrinho; em `games/novo/index.html:296` é a folha de vidro do painel.
- `function show` também existe duplicado em `games/index.html` (2932 = animação, 4188 = troca de aba).
- Carrossel da vitrine: `makeInfinite` clona cada item 2x (antes e depois), então contar `.sp` no DOM dá 3x o número real. O contador `#pcount` é calculado antes de clonar.
- Botões "Quero" dos itens clonados funcionam por **delegação** no `document` (`closest('.it,.sp')`), não por listener individual — não trocar por listener direto.
- `.ref` (reflexo espelhado embaixo das capas) foi **removido** de propósito: nada de imagem repetida de ponta-cabeça.
- Regra de ouro: não alterar `games/index.html` sem pedido explícito.
