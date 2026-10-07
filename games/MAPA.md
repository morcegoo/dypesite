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
| cabeçalho da seção (1 linha) | 416 · CSS 193-196 | `.ph` · `#popt` · `.pcount` (sem botão Abrir/✕; só `#popOpen` = "Ver site") |
| **CSS painel sem armação** | 280 | `#pop .card` (sem moldura/animação) · `#pop .inner` (transparente em cima, escuro embaixo) · `#pop .it` · `#pop.site .inner` opaco |
| **2 estados: hero ⇄ seção** | 321-372 | `body` sem classe = HERO · `body.sec` = SEÇÃO · `#gtabar` (faixa 50px GTA, `top:var(--gtatop)`) 323 · `body:not(.sec) #gtabar` escondida 330 · `body:not(.sec) .dock` (4×2, `height:auto`, bloco centrado) 332 · `body.sec .dock` (barra fixa 1 linha, `--barh:60px`) 350 · `#pop` área rolável entre faixa e barra 364 · `#pullhint` 370 |
| **fase: CSS** | 374-470 | `#ticker`/`#tkT` (frase de ofertas do hero) 377 · `.tintsec` (tingimento radial `--sa`/`--sb`, .28) 389 · `.intro`+`.tt`+`.rot` 391-399 · `.chips2`/`.chip2` 400 · `.brands`/`.brand` 404 · `.spot`/`.stage2`/`.pv`/`.pcv` 408-418 · `.sinfo2`+`.specs` 421 · `.nav2`/`.sdots` 431 · `.bento`/`.bt` 437 · `.yrs`/`.yr` 445 · `.count` 452 · `.allbtn`/`.all`/`.pc` 456 |
| **frase de ofertas (hero)** | 671 | `#ticker` + `TKF` + `tkShow()` — troca a cada 3,4 s, palavra por palavra, preço em `--gold` |
| ~~painel aberto (full)~~ | 306 | removido: não existe mais espiar/`full`/`Abrir`/`✕` (regras órfãs ficaram no CSS) |
| conteúdo das abas | 361 | `#pb` (fileiras `.shelf`); `padding-bottom:calc(var(--dockh) + 24px)` em 199 |
| site atual embutido | 362 | `#pf` + `iframe#ifr` |
| **CONFIG** | 374 | `const CFG` → `site`, `wa`, `waMsg`, `rota`, `esconder`, `pele` |
| cenas de fundo | 401 | `const SC` (hero-poster / miami / cidade) |
| dados | 478 | `DATA` + `KEY` (lê `dados.json`) |
| card da vitrine | 487 | `function card(x,k)` — capa + selo + preço; **sem reflexo** |
| fileira | 492 | `function shelf(titulo,lista,k,dica)` |
| destaques da categoria | 496 | `function pickHighlights(list)` — até 3 itens da própria categoria (selo primeiro, senão as últimas 3 capas) |
| **fases (uma por seção)** | 679-777 | `const PH` (cor `--sa/--sb`, cena, eyebrow, título, 3 frases) · `BRANDC`/`brandOf`/`CPF`/`SPECS` 683 · `AFC` (filtro por seção) 688 · `clearT()`/`laterT()` (todos os timers da seção) 690 · `render(id)` 715 (intro + chips/marcas + `.spot` + `.bento`/`.yrs`/`.count` + `.allbtn`) · `spotDraw` 730 · `spotGo`/`spotArm` (auto 5 s; pausa no dedo/ficha/aba) 745 · `afterRender(id)` 749 (`--sa/--sb`, `setScene`, arrasto >40 px, clique no centro = ficha) · `toggleAll` 774 |
| ~~render antigo (Destaques + fileira)~~ | — | removido: cada seção agora é uma fase; `shelf`/`pickHighlights` continuam no arquivo mas não são mais usados |
| carrossel: decide se rola | 518 | `function evalRow(sc,auto,final)` — mede quando o painel já tem largura (ResizeObserver) e centraliza/esconde `.snav` se a fileira couber |
| **carrossel infinito** | 541 | `function makeInfinite(sc,auto)` — clona os itens 3x, desliga o snap e faz a vitrine andar sozinha |
| preencher painel | 812 | `function fillPB(id)` — `clearT()` + contador `DATA[KEY[id]].length` + `makeInfinite` + `afterRender` |
| abas/dock | 567 | `const MODES` |
| **layout do dock / FLIP** | 869-895 | `const pop/pb/inner` 869 · `syncSecTop()` (mede `.top`, seta `--gtatop` + `--sectop`, síncrono) 875 · `layoutDock()` (hero: ícones + `#ticker` = **um bloco** centrado; seta `--docktop/--ticktop/--wavesy`) 878 · `enterTiles()` 887 · `flipTiles(fn)` (FLIP 480ms, 22ms/ícone) 894 |
| abre/fecha o site dentro | 729-741 | `openSite` · `openSiteNow`/`closeSiteNow` (`#popOpen`) · `openModeFull(id)` |
| **abre seção / volta pro hero** | 907-931 | `goSec(id,'push'\|'replace'\|'none')` 907 (para a troca automática de cena, `syncSecTop`) · `goHero()` 920 (`clearT()` + `restart()` da cena) · `backFromSec()` 929 · `popstate` 960 · logo 980 · pull-to-back + wheel 971-979 |
| rádio (trilha + `--beat`) | 700 | `const Radio` |
| mini arcade (recorde + tela cheia) | 989 | `arcBox` / `placeArc()` (**escondido no hero: `.arc{display:none}`**, não vai mais pro `#pb`) / `arcF` / `#arcRec` / `#arcFull` |
| ~~dica da 1ª visita~~ | — | removida junto com o `.dragtip` (não existe mais "puxe pra cima pra abrir") |
| link direto (seção) | 855 | `function fromHash()` — aceita `#jogos`, `#/jogos` etc.; abre já em `body.sec` |
| WhatsApp / toast | 846 / 861 | `openWA(msg)` / `toast(s)` |
| pele escura aplicada no iframe | 659 | injeta `#neon-embed` + `link[href=embed.css]` e põe `.neon-embed` no `<html>` do site |
| pele escura aplicada no iframe | 592 | injeta `#neon-embed` + `link[href=embed.css]` e põe `.neon-embed` no `<html>` do site |

## Avisos
- **Dois estados:** `#dock` é a mesma fileira de `.tile` nos dois: no HERO vira grade 4×2 centralizada no espaço livre abaixo do `#hero`; em `body.sec` vira barra fixa embaixo (1 linha, rolagem lateral, ativo com traço). Toda a geometria vem de `--docktop/--dockhh/--wavesy` (JS em `layoutDock`).
- Link direto agora usa `#jogos` (sem barra) e abre direto no estado seção; `#/jogos` continua valendo.
- `--sectop` é medido no `requestAnimationFrame` (no modo `prefers-reduced-motion` o `*{transition-duration:.01ms}` prende o `top` do `.top` no primeiro frame — por isso `body.sec .top{transition:none}`).
- `.srow` existe nos **dois** arquivos com sentidos diferentes: em `games/index.html:1970` é a linha da busca; em `games/novo/index.html:190` é a fileira da prateleira. Ao buscar, filtrar por arquivo.
- `.sheet`: em `games/index.html:2009` é o drawer do carrinho; em `games/novo/index.html:296` é a folha de vidro do painel.
- `function show` também existe duplicado em `games/index.html` (2932 = animação, 4188 = troca de aba).
- Carrossel da vitrine: `makeInfinite` clona cada item 2x (antes e depois), então contar `.sp` no DOM dá 3x o número real. O contador `#pcount` é calculado antes de clonar.
- **Faixa GTA:** fica **abaixo** do cabeçalho (`.top`), em `top:var(--gtatop)`; `--sectop` = fim do `.top` + 50 + 8. No hero ela é `visibility:hidden`.
- **Hero:** ícones + `#ticker` são um bloco só, centrado no espaço livre abaixo do `#hero` (`layoutDock`); as ondas ficam logo acima (`--wavesy`).
- **Fase:** cada seção tem `--sa/--sb` próprios (topo do `<style>` parte 2). `--sa` NÃO é `--a1/--a2` (essas vêm da paleta da cena).
- **Vitrine:** auto 5 s com barra na bolinha ativa; arrasto >40 px, setas ‹ ›, chips (Jogos/Acessórios), marcas (Consoles) e "Ver todos" funcionam por delegação de clique em `document`.
- Toque no produto do **centro** = abrir a ficha (site real via `#popOpen`/`data-site`); no **vizinho** = trazer pro centro.
- Botões "Quero" dos itens clonados funcionam por **delegação** no `document` (`closest('.it,.sp')`), não por listener individual — não trocar por listener direto.
- `.ref` (reflexo espelhado embaixo das capas) foi **removido** de propósito: nada de imagem repetida de ponta-cabeça.
- `.snav` (setas) é escondido por JS quando a fileira cabe na largura: a fileira fica centralizada e sem loop (`evalRow` decide sempre depois que o painel ganhou largura — nunca confie na 1ª medida).
- O painel (`#pop`) vive dentro de `max-width:1200px`; no desktop o `targetRect` devolve `w=min(innerWidth,1200)` centrado.
- `games/novo/arcade/astro.html` é o mini arcade próprio (jogo "Astro", recorde em `localStorage.astroRec`). Se existir um arcade oficial, é só subir por cima desse caminho.
- Regra de ouro: não alterar `games/index.html` sem pedido explícito.

## games/novo/index.html — parte 3 (TCG, banners do hero, topo, montador, fotos)
| item | linha | seletor / função |
|---|---|---|
| **CSS parte 3** | 483-520 | `.fdots i.on::after` (barra de progresso do banner) · `.tile.cards` (ícone TCG, `--c:#7ff6ff`/`--ex:#8b5cf6`) · `.pcount` (rótulo pixel `#e8dcff` + bolinha `--sa`) · `.tor` (card do torneio) · `.steps/.step/.opts/.opt/.total` (montador) · `.pcv img.bg|img.fg` e `.bt img.bg|img.fg` (foto: fundo desfocado + produto inteiro) |
| ícone de cartas | 592 | `I.tcg` (dois retângulos sobrepostos) |
| dados extras | 646 | `KEY.tcg` + `fetch('dados.json')` chama `suBuild()` |
| **fase TCG** | 721 | `PH.tcg` (`--sa:#2ee6c8` `--sb:#8b5cf6`, eb `CARTAS`, tt `TCG`, 3 frases) |
| rótulos do topo | 749 | `LAB` (CARTAS/BIBLIOTECA/HARDWARE/ACESSÓRIOS/MONTADOR/LINHA DO TEMPO/PRÉ-VENDA/CONTATO) |
| chips + torneio TCG | 750-755 | `TCG_CHIPS` · `tcgList(f)` · `torHTML(t)` |
| **montador de setup** | 756-765 | `SU` (escolhas) · `SUP` (4 passos) · `suBuild()` (junta `setup` + Teclado/Mouse de `acessorios`) · `suTotal()` · `stepsHTML()` · `#suT` · `#suGo` |
| foto desfocada + contain | 766 / 775 | `pv(x)` → `<img class="bg">` + `<img class="fg">` · `bentoHTML` idem |
| render: setup/tcg | 778-800 | `if(id==='setup')` → `stepsHTML()` (sem carrossel) · `if(id==='tcg')` → `torHTML(DATA.tcgTorneio)` + chips `data-tcg` + `spotT(tcgList)` + "Ver todas as cartas" |
| topo da seção | 880 | `fillPB(id)` → `#pcount` = `<i></i>ROTULO · N ITENS` (N do `dados.json`) · `#popOpen` ("Site completo") só quando `id==='ct'` |
| **banners do hero** | 887-911 | `FEAT` (4: GTA VI / TCG / Consoles / Setup) · `showFeat(i)` (bolinhas + `--dur` + atualiza `#gtabar`) · `fArm()` (auto 5 s) · `openBanner(m)` (toque em qualquer ponto = `goSec`) |
| dock | 913 | `MODES` — o 1º item virou `{id:'tcg',l:'TCG',k:'tcg',c:'cards'}`; `Início` saiu (o logo volta pro hero) |
| delegação | 1142-1144 | `[data-su]` (montador) · `#suGo` (WhatsApp com itens + total) · `[data-tcg]` (chips) |

### Avisos da parte 3
- **TCG** usa `DATA.tcg` (10 itens) e `DATA.tcgTorneio`, ambos reais do site antigo, agora no `dados.json`; não existe chip de Magic/Yu-Gi-Oh/One Piece porque não há dados.
- O banner do hero **não** abre mais o site antigo por cima: toque = `goSec` (mesma animação FLIP dos ícones). O site real continua no botão "Detalhes" da ficha.
- `#gtabar` mostra o banner atual (`FEAT[fi].bar`), inclusive o botão (`barB`).
- `CONTENT.tcg` existe como fallback caso o `dados.json` ainda não tenha carregado (link direto `#tcg`).
- Fotos: sempre **duas** `<img>` na mesma moldura (`bg` com `blur(18px) brightness(.45) saturate(1.3)` em `cover`, `fg` em `contain`).
