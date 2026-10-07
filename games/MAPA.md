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
| cores/fontes | 21 | `:root` (`--a1 --a2 --gold --cyan --bg --ink --muted --glass --line --f-* --wrap:1200px --pad:24px`) |
| **container 1200px** | 94 | `.top` · `.dock` · `.hero` (todos `max-width:var(--wrap); padding:0 var(--pad)`) |
| **CSS hero 2 colunas** | 93-107 | `.hero` 94 · `.hero-in` 95 (`minmax(0,1fr) minmax(0,1.1fr)`, `height:min(62vh,560px)`) · `.hero-col` 96 · `.arc` 97 · `.arc-frame` 99 (16/9, cantos chanfrados, borda neon) · `.arc-bar` 103 |
| **CSS prateleira de vidro** | 192 | `#pop.sheet` · `.shelf` 202 · `.srow` 206 (`--covw`/`--covh`) · `.sp` · `.stage` · `.cov` · `.sinfo` · `.seal` · `.snav` |
| cabeçalho do painel em 1 linha | 165 / 193-196 | `.ph` (`flex`, `space-between`) · `#pop.sheet .ph` · `#popt` · `.pcount` · `.pacts` |
| **CSS painel sem armação** | 280 | `#pop .card` (sem moldura/animação) · `#pop .inner` (transparente em cima, escuro embaixo) · `#pop .it` · `#pop.site .inner` opaco |
| painel aberto (full) | 306 | `#pop.full .inner` (escurece já no topo + blur) · `#pop.full .ph` (faixa opaca, z-index 5) |
| conteúdo das abas | 361 | `#pb` (fileiras `.shelf`); `padding-bottom:calc(var(--dockh) + 24px)` em 199 |
| site atual embutido | 362 | `#pf` + `iframe#ifr` |
| **CONFIG** | 374 | `const CFG` → `site`, `wa`, `waMsg`, `rota`, `esconder`, `pele` |
| cenas de fundo | 401 | `const SC` (hero-poster / miami / cidade) |
| dados | 478 | `DATA` + `KEY` (lê `dados.json`) |
| card da vitrine | 487 | `function card(x,k)` — capa + selo + preço; **sem reflexo** |
| fileira | 492 | `function shelf(titulo,lista,k,dica)` |
| destaques da categoria | 496 | `function pickHighlights(list)` — até 3 itens da própria categoria (selo primeiro, senão as últimas 3 capas) |
| render da aba | 500 | `function render(id)` — `Destaques` + a fileira da categoria; sem repetir GTA/Setup em todo painel |
| carrossel: decide se rola | 518 | `function evalRow(sc,auto,final)` — mede quando o painel já tem largura (ResizeObserver) e centraliza/esconde `.snav` se a fileira couber |
| **carrossel infinito** | 541 | `function makeInfinite(sc,auto)` — clona os itens 3x, desliga o snap e faz a vitrine andar sozinha |
| preencher painel | 548 | `function fillPB(id)` (contador vem de `DATA[KEY[id]].length`; chama `makeInfinite`) |
| abas/dock | 567 | `const MODES` |
| **geometria da folha** | 608 / 609 | `const WRAP=1200` · `function targetRect(i)` — painel de 1200px; espiando fica 16px abaixo do fim do `#hero` |
| abre o site atual dentro | 653 | `function openSite(r)` |
| rádio (trilha + `--beat`) | 700 | `const Radio` |
| mini arcade (recorde + tela cheia) | 756 | `arcBox` / `placeArc()` (celular: vira a seção ARCADE em `#pb`) / `arcF` / `#arcRec` / `#arcFull` |
| dica da 1ª visita | 763 | `.dragtip` — some após 4s (`localStorage dypeNovoTip`); com `pointer:fine` vira "Clique em Abrir para ver tudo" |
| WhatsApp / toast | 769 / 781 | `openWA(msg)` / `toast(s)` |
| pele escura aplicada no iframe | 659 | injeta `#neon-embed` + `link[href=embed.css]` e põe `.neon-embed` no `<html>` do site |
| pele escura aplicada no iframe | 592 | injeta `#neon-embed` + `link[href=embed.css]` e põe `.neon-embed` no `<html>` do site |

## Avisos
- `.srow` existe nos **dois** arquivos com sentidos diferentes: em `games/index.html:1970` é a linha da busca; em `games/novo/index.html:190` é a fileira da prateleira. Ao buscar, filtrar por arquivo.
- `.sheet`: em `games/index.html:2009` é o drawer do carrinho; em `games/novo/index.html:296` é a folha de vidro do painel.
- `function show` também existe duplicado em `games/index.html` (2932 = animação, 4188 = troca de aba).
- Carrossel da vitrine: `makeInfinite` clona cada item 2x (antes e depois), então contar `.sp` no DOM dá 3x o número real. O contador `#pcount` é calculado antes de clonar.
- Botões "Quero" dos itens clonados funcionam por **delegação** no `document` (`closest('.it,.sp')`), não por listener individual — não trocar por listener direto.
- `.ref` (reflexo espelhado embaixo das capas) foi **removido** de propósito: nada de imagem repetida de ponta-cabeça.
- `.snav` (setas) é escondido por JS quando a fileira cabe na largura: a fileira fica centralizada e sem loop (`evalRow` decide sempre depois que o painel ganhou largura — nunca confie na 1ª medida).
- O painel (`#pop`) vive dentro de `max-width:1200px`; no desktop o `targetRect` devolve `w=min(innerWidth,1200)` centrado.
- `games/novo/arcade/astro.html` é o mini arcade próprio (jogo "Astro", recorde em `localStorage.astroRec`). Se existir um arcade oficial, é só subir por cima desse caminho.
- Regra de ouro: não alterar `games/index.html` sem pedido explícito.
