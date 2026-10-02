/*!
 * Parceiros 3D \u2014 Fa\xedsca, Brotto e Bolha (m\xf3dulo independente)
 * Se\xe7\xe3o "Escolha seu parceiro" + companheiro que anda pela tela + poderes (fogo, \xe1gua, folhas)
 * + fogo nas bordas dos cards + cupons. Sem bibliotecas: WebGL pr\xf3prio.
 *
 * Uso:   <div id="parceiros"></div>   (onde a se\xe7\xe3o deve aparecer)
 *        <script src="parceiros.js" defer></script>   (modelos em ./modelos/ ao lado do arquivo)
 * Config opcional ANTES do script:
 *   window.PARCEIROS_CONFIG = { base:'/assets/modelos/', cards:'.product-card', addToCart:'.add-to-cart', root:'main' }
 * API: Parceiros.get() -> {id,nome,cupom,beneficio,categoria} | null ; evento document 'parceiro:change'
 */
(function(){
  if (window.Parceiros) return;
  var CFG = window.PARCEIROS_CONFIG || {};
  var ME = document.currentScript && document.currentScript.src;
  var BASE = CFG.base || (ME ? ME.replace(/[^\/]*$/, '') : '') + 'modelos/';
  var CARDS = CFG.cards || '.fc,.catc,.oft,.ax-c,.product-card,.produto,.card-produto,[data-produto]';
  var ADD = CFG.addToCart || '[data-add],.add-to-cart,.btn-comprar,[data-add-cart]';
  function ROOT(){ return (CFG.root && document.querySelector(CFG.root)) || document.body; }
  function ready(f){ if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', f); else f(); }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LAY = {docH:0, subs:[]};
  function absTop(el){ var y = 0; while (el){ y += el.offsetTop; el = el.offsetParent; } return y; }
  (function(){ var t = 0; function run(){ t = 0; LAY.docH = document.documentElement.scrollHeight; LAY.subs.forEach(function(f){ try { f(); } catch(e){} }); }
    function req(){ if (!t) t = setTimeout(run, 120); } addEventListener('resize', req); addEventListener('load', req);
    ready(function(){ run(); if ('ResizeObserver' in window) new ResizeObserver(req).observe(document.body); }); })();
  var CSS = "  .pcs{position:relative;margin-top:40px;border-radius:30px;overflow:hidden;isolation:isolate;color:#fff;padding:46px 26px 30px;background:#1b1035;}\n  .pcs-sky{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,#2a1563 0%,#5b2a8c 45%,#ff7a59 100%);}\n  .pcs-sky i{position:absolute;left:-5%;right:-5%;bottom:0;will-change:transform;}\n  .pcs-sky .l1{height:60%;background:radial-gradient(60% 100% at 30% 100%,#3d2272 0 60%,transparent 61%),radial-gradient(50% 90% at 80% 100%,#432579 0 60%,transparent 61%);opacity:.9;}\n  .pcs-sky .l2{height:42%;background:radial-gradient(45% 100% at 15% 100%,#2b1757 0 60%,transparent 61%),radial-gradient(55% 100% at 65% 100%,#2f195e 0 60%,transparent 61%);}\n  .pcs-sky .l3{height:26%;bottom:-6%;background:radial-gradient(70% 100% at 50% 100%,#1b1035 0 60%,transparent 61%);}\n  .pcs-sky .spk{position:absolute;inset:0;background-image:radial-gradient(1.5px 1.5px at 12% 18%,#fff,transparent),radial-gradient(1.2px 1.2px at 28% 8%,#fff,transparent),radial-gradient(1.6px 1.6px at 46% 22%,#ffe9a8,transparent),radial-gradient(1.2px 1.2px at 63% 12%,#fff,transparent),radial-gradient(1.5px 1.5px at 82% 20%,#fff,transparent),radial-gradient(1.2px 1.2px at 92% 6%,#ffe9a8,transparent);animation:twk 3.2s ease-in-out infinite alternate;}\n  @keyframes twk{to{opacity:.4;}}\n  .pcs-in{max-width:1100px;margin:0 auto;}\n  .pcs-h{text-align:center;margin-bottom:26px;will-change:transform,opacity;}\n  .pcs-k{display:inline-block;font:800 11.5px 'Poppins',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#1b1035;background:#ffd34a;padding:5px 12px;border-radius:999px;}\n  .pcs-h h2{margin:14px 0 8px;font:900 clamp(32px,5vw,62px)/1 'Poppins',sans-serif;text-transform:uppercase;letter-spacing:-.01em;text-shadow:0 4px 0 rgba(0,0,0,.25),0 0 40px rgba(255,180,90,.5);}\n  .pcs-h p{margin:0;color:rgba(255,255,255,.85);font-size:15px;}\n  .pcs-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;}\n  .pcard{position:relative;border-radius:22px;padding:14px 14px 16px;background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.06));border:1.5px solid rgba(255,255,255,.22);box-shadow:0 20px 40px -20px rgba(0,0,0,.6);text-align:center;transition:transform .35s cubic-bezier(.2,.9,.3,1.3),border-color .3s,box-shadow .3s;animation:pcIn .6s cubic-bezier(.2,.9,.3,1.2) both;animation-delay:calc(var(--i) * 120ms);}\n  @keyframes pcIn{from{transform:translateY(30px) scale(.94);opacity:0;}}\n  .pcard:hover{transform:translateY(-6px) rotate(calc((var(--i) - 1) * 1.5deg));border-color:var(--c2);box-shadow:0 24px 50px -18px var(--c);}\n  .pc-top{display:flex;justify-content:space-between;align-items:center;}\n  .pc-t{font:800 11px 'Poppins',sans-serif;letter-spacing:.14em;text-transform:uppercase;background:var(--c);color:#fff;padding:4px 10px;border-radius:999px;}\n  .pc-n{font:800 13px 'Poppins',sans-serif;color:rgba(255,255,255,.6);}\n  .pc-art{position:relative;height:190px;display:grid;place-items:center;margin:4px 0;}\n  .pc-ring{position:absolute;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--c2) 70%,transparent),transparent 68%);animation:ringP 2.4s ease-in-out infinite;}\n  @keyframes ringP{50%{transform:scale(1.08);opacity:.75;}}\n  .pc-art .cr{position:relative;width:170px;height:170px;transition:opacity .2s,transform .2s;}\n  .pc-gone{position:absolute;font:800 13px 'Poppins',sans-serif;background:rgba(0,0,0,.35);padding:6px 12px;border-radius:999px;opacity:0;transition:opacity .3s;}\n  .pcard.launch .cr{transform:scale(1.15,.8) translateY(8px);}\n  .pcard.picked .pc-art .cr{opacity:.12;filter:grayscale(1) brightness(.4);}\n  .pcard.picked .pc-gone{opacity:1;}\n  .pcard.picked{border-color:var(--c2);box-shadow:0 0 0 2px var(--c2),0 24px 50px -18px var(--c);}\n  .pcard h3{margin:2px 0 4px;font:900 26px 'Poppins',sans-serif;}\n  .pcard p{margin:0 0 10px;font-size:13px;color:rgba(255,255,255,.82);min-height:2.8em;}\n  .pc-perk{display:flex;flex-direction:column;gap:2px;padding:8px;border-radius:12px;background:rgba(0,0,0,.22);margin-bottom:10px;}\n  .pc-perk b{font:800 16px 'Poppins',sans-serif;color:var(--c2);} .pc-perk small{font-size:11px;letter-spacing:.08em;color:rgba(255,255,255,.7);}\n  .pc-go{width:100%;border:0;border-radius:14px;padding:12px;font:800 14px 'Poppins',sans-serif;background:var(--c);color:#fff;cursor:pointer;box-shadow:0 8px 0 -2px color-mix(in srgb,var(--c) 55%,#000);transition:transform .15s,box-shadow .15s;}\n  .pc-go:active{transform:translateY(4px);box-shadow:0 4px 0 -2px color-mix(in srgb,var(--c) 55%,#000);}\n  .pcard.picked .pc-go{background:rgba(255,255,255,.18);box-shadow:none;}\n  .pcs-done{margin-top:18px;display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;font-size:14px;}\n  .pcs-done span{background:rgba(0,0,0,.3);padding:8px 14px;border-radius:999px;}\n  .pcs-done b{color:#ffd34a;}\n  .pcs .lnk{color:#fff;}\n  /* idle das criaturas (cartas e companheiro) */\n  .cr .sh{fill:rgba(20,10,40,.28);transform-box:fill-box;transform-origin:center;animation:shB 2.6s ease-in-out infinite;}\n  .cr .core{transform-box:fill-box;transform-origin:50% 100%;animation:brth 2.6s ease-in-out infinite;}\n  @keyframes brth{50%{transform:scale(1.025,.975);}}\n  @keyframes shB{50%{transform:scale(.94);}}\n  .cr .eyes{transform-box:fill-box;transform-origin:center;animation:blink 4.8s infinite;}\n  @keyframes blink{0%,93%,100%{transform:scaleY(1);}96%{transform:scaleY(.08);}}\n  .cr .earL{transform-box:fill-box;transform-origin:100% 100%;animation:earL 3.4s ease-in-out infinite;}\n  .cr .earR{transform-box:fill-box;transform-origin:0 100%;animation:earR 3.4s ease-in-out infinite;}\n  @keyframes earL{0%,70%,100%{transform:rotate(0);}78%{transform:rotate(-12deg);}86%{transform:rotate(4deg);}}\n  @keyframes earR{0%,72%,100%{transform:rotate(0);}80%{transform:rotate(12deg);}88%{transform:rotate(-4deg);}}\n  .cr .tail{transform-box:fill-box;transform-origin:0 100%;animation:tail 1.8s ease-in-out infinite;}\n  @keyframes tail{50%{transform:rotate(-8deg);}}\n  .cr .flk{transform-box:fill-box;transform-origin:center;animation:flk .28s ease-in-out infinite alternate;}\n  @keyframes flk{to{transform:scale(1.18);opacity:.75;}}\n  .cr-f .tuft{transform-box:fill-box;transform-origin:50% 100%;animation:flk2 .5s ease-in-out infinite alternate;}\n  @keyframes flk2{to{transform:scaleY(1.14) rotate(4deg);}}\n  .cr-b .tuft{transform-box:fill-box;transform-origin:50% 100%;animation:sprout 2.2s ease-in-out infinite;}\n  @keyframes sprout{50%{transform:rotate(8deg);}}\n  .cr-w .tuft{transform-box:fill-box;transform-origin:center;animation:bub 2.6s ease-in infinite;}\n  @keyframes bub{0%{transform:translateY(6px) scale(.6);opacity:0;}20%{opacity:1;}100%{transform:translateY(-18px) scale(1.1);opacity:0;}}\n  .cr .chk{animation:flk .9s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center;}\n  /* companheiro */\n  .pal{position:fixed;left:0;top:0;z-index:60;cursor:pointer;will-change:transform;-webkit-tap-highlight-color:transparent;}\n  .pal-f,.pal-s{width:100%;height:100%;transform-origin:50% 92%;}\n  .pal-s .cr{width:100%;height:100%;display:block;}\n  .pal{contain:layout style;} .pal-f{will-change:transform;}\n  .pal.walk .cr .ft.a{animation:stepA .26s ease-in-out infinite alternate;} .pal.walk .cr .ft.b{animation:stepA .26s ease-in-out infinite alternate-reverse;}\n  .cr .ft{transform-box:fill-box;transform-origin:center;}\n  @keyframes stepA{from{transform:translateY(0);}to{transform:translateY(-5px);}}\n  .pal.walk .cr .core{animation-duration:.5s;}\n  .pal.zz .cr .eyes{animation:none;transform:scaleY(.08);}\n  .pal.zz::after{content:'z z';position:absolute;right:-6px;top:-8px;font:800 16px 'Poppins',sans-serif;color:var(--c);animation:zz 2s ease-in-out infinite;}\n  @keyframes zz{0%{transform:translateY(6px);opacity:0;}50%{opacity:1;}100%{transform:translateY(-12px);opacity:0;}}\n  .pal-say{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-20%);min-width:120px;max-width:min(220px,70vw);padding:8px 11px;border-radius:14px 14px 14px 4px;background:#fff;color:#17131f;box-shadow:0 10px 26px -10px rgba(20,10,40,.45);border:2px solid var(--c);font-size:12.5px;line-height:1.3;pointer-events:none;}\n  .pal-say.left{transform:translateX(-80%);border-radius:14px 14px 4px 14px;}\n  .pal-say.in{animation:sayIn .35s cubic-bezier(.2,.9,.3,1.4);}\n  @keyframes sayIn{from{opacity:0;transform:translateX(-20%) translateY(8px) scale(.8);}}\n  .pal-say.left.in{animation-name:sayInL;} @keyframes sayInL{from{opacity:0;transform:translateX(-80%) translateY(8px) scale(.8);}}\n  .pal-say b{display:block;font:900 15px 'Poppins',sans-serif;color:var(--c);}\n  .pal-say small{display:block;font-size:12px;color:#4a4458;font-style:italic;}\n  .pal-heart{position:absolute;left:50%;top:0;font-size:22px;animation:hrt 1.1s ease-out forwards;pointer-events:none;}\n  @keyframes hrt{from{transform:translate(-50%,0) scale(.5);opacity:1;}to{transform:translate(-50%,-50px) scale(1.4);opacity:0;}}\n  .pal-dust{position:fixed;z-index:59;width:12px;height:12px;border-radius:50%;pointer-events:none;}\n  @media (max-width:900px){\n    .pcs{padding:32px 14px 22px;border-radius:24px;}\n    .pcs-h h2{font-size:30px;} .pcs-h p{font-size:13.5px;}\n    .pcs-cards{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}\n    .pcard{padding:8px 6px 10px;border-radius:16px;}\n    .pc-t{font-size:8.5px;padding:3px 7px;} .pc-n{font-size:10px;}\n    .pc-art{height:104px;} .pc-art .cr{width:100px;height:100px;} .pc-ring{width:86px;height:86px;}\n    .pcard h3{font-size:16px;} .pcard p{display:none;}\n    .pc-perk{padding:5px 3px;margin-bottom:7px;} .pc-perk b{font-size:11.5px;} .pc-perk small{font-size:8.5px;}\n    .pc-go{padding:8px 4px;font-size:11px;border-radius:10px;}\n    .pc-gone{font-size:9.5px;padding:4px 8px;}\n  }\n  @media (prefers-reduced-motion:reduce){ .cr *,.pcard,.pc-ring,.pcs-sky .spk{animation:none!important;} }\n  /* ---------- poderes / temas do parceiro ---------- */\n  .fx-cv{position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:56;will-change:transform;transform:translateZ(0);}\n  .fx-flash{position:fixed;inset:0;pointer-events:none;z-index:57;}\n  .fx-heat{position:fixed;left:0;right:0;bottom:0;height:55vh;pointer-events:none;z-index:54;opacity:0;will-change:opacity;transition:opacity .35s linear;background:linear-gradient(0deg,rgba(255,80,20,.38),rgba(255,140,40,.12) 45%,transparent);}\n  .fx-wave,.fx-sea{position:fixed;pointer-events:none;overflow:hidden;transform-origin:50% 100%;}\n  .fx-wave{z-index:58;border-radius:0 0 18px 18px;}\n  .fx-sea{left:0;right:0;bottom:0;z-index:44;height:120px;transform:translate3d(0,120px,0);will-change:transform;}\n  .wl{position:absolute;left:0;bottom:0;width:200%;height:100%;}\n  .wl svg{width:100%;height:100%;display:block;}\n  .wl{will-change:transform;}\n  .wl.a{animation:wv 7s linear infinite;} .wl.a path{fill:rgba(43,127,255,.42);}\n  .wl.b{animation:wv 4.5s linear infinite reverse;height:85%;} .wl.b path{fill:rgba(127,216,255,.45);}\n  .fx-wave .wl.a path{fill:rgba(43,127,255,.8);} .fx-wave .wl.b path{fill:rgba(160,225,255,.85);}\n  @keyframes wv{to{transform:translateX(-50%);}}\n  /* cor da loja muda com o parceiro */\n  html.th-faisca{--acc:#f0561d;--acc-h:#ff7a3d;--glow:0 0 22px rgba(255,100,30,.4);}\n  html.th-brotto{--acc:#2f9e44;--acc-h:#43b85a;--glow:0 0 22px rgba(60,180,80,.35);}\n  html.th-bolha{--acc:#1f7aff;--acc-h:#4c95ff;--glow:0 0 22px rgba(40,120,255,.35);}\n  html.lt.th-faisca body{background:radial-gradient(ellipse 80% 40% at 50% -5%,rgba(255,120,40,.18),transparent 60%),linear-gradient(180deg,#fffaf6,#fdf0e8);}\n  html.lt.th-brotto body{background:radial-gradient(ellipse 80% 40% at 50% -5%,rgba(90,200,90,.18),transparent 60%),linear-gradient(180deg,#f9fdf6,#eef7ea);}\n  html.lt.th-bolha body{background:radial-gradient(ellipse 80% 40% at 50% -5%,rgba(60,150,255,.18),transparent 60%),linear-gradient(180deg,#f6fbff,#e9f3fd);}\n  html.th-faisca .fc:hover,html.th-faisca .vit .fc:hover{border-color:#ff7a3d;box-shadow:0 0 26px -6px rgba(255,100,30,.6);}\n  html.th-faisca .cs.vit,html.th-faisca .cs.block{box-shadow:6px 6px 0 rgba(255,100,30,.3);}\n  html.th-brotto .cs.vit,html.th-brotto .cs.block{box-shadow:6px 6px 0 rgba(60,170,70,.28);}\n  html.th-bolha .cs.vit,html.th-bolha .cs.block{box-shadow:6px 6px 0 rgba(40,120,255,.28);}\n  html.th-brotto .block,html.th-brotto .catc,html.th-brotto .oft,html.th-brotto .trust,html.th-brotto .perks>div,html.th-bolha .block,html.th-bolha .catc,html.th-bolha .oft{position:relative;}\n  html.th-brotto .vit,html.th-brotto .block,html.th-brotto .oft,html.th-brotto .trust{overflow:visible;}\n  .vine,.drip{animation-fill-mode:both;}\n  .vine{position:absolute;left:-6px;top:-8px;width:min(46%,170px);height:auto;pointer-events:none;z-index:4;overflow:visible;}\n  .vine.br{left:auto;top:auto;right:-6px;bottom:-8px;transform:rotate(180deg);}\n  .vine .vs{fill:none;stroke:#3f8f3a;stroke-width:3.2;stroke-linecap:round;stroke-dasharray:240;stroke-dashoffset:240;transition:stroke-dashoffset 1.6s cubic-bezier(.4,.1,.3,1);}\n  .vine .vs.b{stroke-width:2.6;transition-delay:.2s;}\n  .vine .lf{fill:#5cbf4a;stroke:#2f8a3b;stroke-width:.8;transform:scale(0);transform-box:fill-box;transform-origin:0 50%;transition:transform .55s cubic-bezier(.3,1.6,.5,1) var(--d);}\n  .vine g:nth-of-type(even) .lf{fill:#8fdc5e;}\n  .vine .fl{transform:scale(0);transform-box:fill-box;transform-origin:center;transition:transform .6s cubic-bezier(.3,1.7,.5,1) 1.5s;}\n  .vine.grow .vs{stroke-dashoffset:0;} .vine.grow .lf{transform:scale(1);} .vine.grow .fl{transform:scale(1);}\n  .drip{position:absolute;top:0;width:9px;height:12px;margin-left:-4px;border-radius:50% 50% 50% 50%/40% 40% 60% 60%;background:radial-gradient(circle at 35% 35%,#fff 0 18%,#7fd0ff 30%,#2b7fff 100%);opacity:0;pointer-events:none;z-index:4;animation:drip var(--s,5s) ease-in infinite var(--d,0s);}\n  @keyframes drip{0%{opacity:0;transform:translateY(-2px) scale(.2);}25%{opacity:1;transform:translateY(0) scale(.7);}55%{opacity:1;transform:translateY(2px) scale(1,1.25);}80%{opacity:.9;transform:translateY(70px) scale(.8,1.3);}100%{opacity:0;transform:translateY(110px) scale(.5);}}\n  html.th-bolha .vit::after{content:'';position:absolute;inset:-40%;pointer-events:none;opacity:.18;background:repeating-radial-gradient(circle at 30% 40%,transparent 0 18px,rgba(120,200,255,.6) 20px,transparent 24px);animation:caus 14s linear infinite;will-change:transform;}\n  @keyframes caus{to{transform:translate(8%,6%) rotate(8deg);}}\n  /* cartas em 3D */\n  .pcs-cards{perspective:1100px;}\n  .pcard{transform-style:preserve-3d;will-change:transform;}\n  .pcard.tilt{transition:transform .08s linear,border-color .3s,box-shadow .3s;}\n  .pc-art{transform:translateZ(46px);transform-style:preserve-3d;}\n\n  .pc-sheen{position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(circle at var(--mx,50%) var(--my,30%),rgba(255,255,255,.2),transparent 45%);opacity:0;transition:opacity .3s;}\n  .pcard.tilt .pc-sheen{opacity:1;}\n  @media (hover:none){ .pc-art{animation:fl3d 4s ease-in-out infinite;animation-delay:calc(var(--i) * -1.3s);} @keyframes fl3d{0%,100%{transform:translateZ(30px) rotateY(-10deg);}50%{transform:translateZ(30px) rotateY(10deg) translateY(-4px);}} }\n  @media (prefers-reduced-motion:reduce){ .fx-cv,.fx-heat,.fx-sea,.drip{display:none;} .vine .vs{stroke-dashoffset:0;} .vine .lf,.vine .fl{transform:scale(1);} }\n  /* fundo fixo numa camada pr\xf3pria (background-attachment:fixed repinta a p\xe1gina a cada rolagem) */\n  body{background-attachment:scroll!important;}\n  body::before{content:'';position:fixed;inset:0;z-index:-2;pointer-events:none;background:inherit;background-attachment:scroll!important;transform:translateZ(0);}\n\n  /* ---------- Fa\xedsca ilustrado (boneco em camadas 2.5D) ---------- */\n  .cr.fox{position:relative;display:block;}\n  .fox3d canvas{position:absolute;left:-14%;top:-18%;width:128%;height:128%;display:none;pointer-events:none;}\n  .fire-burn{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:58;pointer-events:none;display:none;}\n  .fire-jet{position:fixed;left:0;top:0;z-index:59;pointer-events:none;display:none;transform-origin:0 50%;will-change:transform;}\n  .fox3d.on canvas{display:block;} .m3-fb{position:absolute;inset:0;} .m3-fb .cr{width:100%;height:100%;display:block;} .fox3d.on .m3-fb{display:none;} .fox3d.on .fox-f,.fox3d.on .fox-s{display:none;}\n  .pal.walk .fox3d.on .fox-f{display:none;}\n  .fox-f,.fox-s{position:absolute;bottom:0;height:100%;transition:opacity .14s;}\n  .fox-f{left:20.6%;aspect-ratio:374/480;transform-origin:37.7% 100%;animation:fxBr 2.8s ease-in-out infinite;}\n  .fox-s{left:12.3%;aspect-ratio:332/485;height:101%;opacity:0;transform:scaleX(-1);}\n  .fox-f img,.fox-s img,.fx-hd{position:absolute;inset:0;width:100%;height:100%;display:block;}\n  .fx-shd{position:absolute;left:22%;right:22%;bottom:-3%;height:8%;border-radius:50%;background:radial-gradient(closest-side,rgba(20,10,40,.38),transparent);}\n  @keyframes fxBr{0%,100%{transform:scale(1,1);}50%{transform:scale(1.018,.982);}}\n  .fx-hd{transform-origin:37.7% 53%;animation:fxHd 3.6s ease-in-out infinite;}\n  @keyframes fxHd{0%,100%{transform:rotate(0) translateY(0);}30%{transform:rotate(-3.2deg) translateY(.6%);}62%{transform:rotate(2.6deg) translateY(-.3%);}}\n  .fx-el{transform-origin:22% 27%;animation:fxEl 4.2s ease-in-out infinite;}\n  .fx-er{transform-origin:53% 27%;animation:fxEr 4.2s ease-in-out infinite .35s;}\n  @keyframes fxEl{0%,78%,100%{transform:rotate(0);}84%{transform:rotate(-11deg);}90%{transform:rotate(4deg);}95%{transform:rotate(-2deg);}}\n  @keyframes fxEr{0%,78%,100%{transform:rotate(0);}84%{transform:rotate(11deg);}90%{transform:rotate(-4deg);}95%{transform:rotate(2deg);}}\n  .fx-tl{transform-origin:60% 92%;animation:fxTl 1.7s ease-in-out infinite;}\n  @keyframes fxTl{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(9deg);}}\n  .fx-stl{transform-origin:53% 80%;animation:fxTl .45s ease-in-out infinite;}\n  .lid{position:absolute;top:32.4%;width:13.4%;height:11.8%;border-radius:50% 50% 46% 46%;background:linear-gradient(180deg,#e6863a 0 52%,#f0d4ab);transform:scaleY(0);transform-origin:50% 0;animation:fxLid 5.2s infinite;}\n  .lid::after{content:'';position:absolute;left:12%;right:12%;bottom:6%;height:14%;border-bottom:2px solid #5a2a10;border-radius:0 0 50% 50%;}\n  .lid.l{left:17.1%;} .lid.r{left:43.8%;animation-delay:.04s;}\n  @keyframes fxLid{0%,91%,100%{transform:scaleY(0);}94%,96%{transform:scaleY(1);}}\n  .pal.walk .fox-f{opacity:0;} .pal.walk .fox-s{opacity:1;}\n  .pal.zz .lid{animation:none;transform:scaleY(1);} .pal.zz .fx-hd{animation-duration:6s;}\n  .pc-art .cr.fox{width:170px;height:170px;}\n  @media (max-width:900px){ .pc-art .cr.fox{width:104px;height:104px;} }\n  @media (prefers-reduced-motion:reduce){ .cr.fox *{animation:none!important;} }";
  ready(function(){
    if (!document.querySelector('link[href*="Poppins"]')){ var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&display=swap'; document.head.appendChild(l); }
    var s = document.createElement('style'); s.id = 'parceiros-css'; s.textContent = CSS + '\n.pcs [hidden],.pal [hidden]{display:none!important;} .pcs .lnk{border:0;background:none;color:#fff;font-size:13.5px;font-weight:500;cursor:pointer;text-decoration:underline;} #parceiros{display:block;}'; document.head.appendChild(s);
  });
  var FX = (function(){
    var cv, ctx, gcv, gtx, GD = .5, W = 0, H = 0, D = 1, parts = [], theme = null, raf = 0, last = 0, mob = false, heat = 0, io = null, amp = 0, docH = 0, heatEl = null, sea = null, scrRaf = 0, CAP = 320, running = false, sk = 0, lm = 0, lh = 0, ambT = 0;
    var WAVE = '<svg viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M0 30 Q25 8 50 30 T100 30 T150 30 T200 30 T250 30 T300 30 T350 30 T400 30 V100 H0Z"/></svg>';
    function rnd(a, b){ return a + Math.random() * (b - a); }
    /* sprites desenhados uma vez s\xf3; cada part\xedcula vira um drawImage barato */
    var SPR = {};
    function mk(w, h, f){ var c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return c; }
    function glow(stops){ return mk(64, 64, function(g){ var r = g.createRadialGradient(32, 32, 0, 32, 32, 32); stops.forEach(function(s){ r.addColorStop(s[0], s[1]); }); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }); }
    function sprites(){
      SPR.fire = glow([[0, 'rgba(255,248,215,1)'], [.28, 'rgba(255,185,70,.9)'], [.6, 'rgba(240,85,25,.45)'], [1, 'rgba(180,30,10,0)']]);
      SPR.ember = glow([[0, 'rgba(255,235,160,1)'], [.25, 'rgba(255,170,60,.85)'], [1, 'rgba(255,90,20,0)']]);
      SPR.spark = glow([[0, 'rgba(235,255,200,1)'], [.3, 'rgba(160,240,100,.8)'], [1, 'rgba(80,200,60,0)']]);
      SPR.drop = mk(24, 40, function(g){ var r = g.createLinearGradient(0, 0, 0, 40); r.addColorStop(0, 'rgba(120,200,255,0)'); r.addColorStop(.55, 'rgba(70,160,255,.75)'); r.addColorStop(1, 'rgba(30,110,240,.95)');
        g.fillStyle = r; g.beginPath(); g.moveTo(12, 0); g.quadraticCurveTo(22, 26, 12, 39); g.quadraticCurveTo(2, 26, 12, 0); g.fill(); g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(9, 29, 2.6, 0, 7); g.fill(); });
      SPR.bub = mk(48, 48, function(g){ g.fillStyle = 'rgba(170,225,255,.16)'; g.strokeStyle = 'rgba(70,160,255,.7)'; g.lineWidth = 2.4; g.beginPath(); g.arc(24, 24, 21, 0, 7); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(16, 16, 4.5, 0, 7); g.fill(); });
      SPR.leaf = [['#c7f590', '#2f8a3b'], ['#9be46a', '#237a32']].map(function(c){ return mk(40, 40, function(g){ var r = g.createLinearGradient(8, 0, 32, 40); r.addColorStop(0, c[0]); r.addColorStop(1, c[1]); g.fillStyle = r;
        g.beginPath(); g.moveTo(20, 2); g.quadraticCurveTo(38, 20, 20, 38); g.quadraticCurveTo(2, 20, 20, 2); g.fill(); g.strokeStyle = 'rgba(25,80,35,.55)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(20, 6); g.lineTo(20, 35); g.stroke(); }); });
    }
    function ensure(){
      if (cv) return; sprites();
      gcv = document.createElement('canvas'); gcv.className = 'fx-cv'; gcv.setAttribute('aria-hidden', 'true'); document.body.appendChild(gcv); gtx = gcv.getContext('2d');
      cv = document.createElement('canvas'); cv.className = 'fx-cv'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv); ctx = cv.getContext('2d', {alpha:true});
      heatEl = document.createElement('div'); heatEl.className = 'fx-heat'; heatEl.setAttribute('aria-hidden', 'true'); document.body.appendChild(heatEl);
      size(); addEventListener('resize', size); addEventListener('scroll', function(){ if (!scrRaf) scrRaf = requestAnimationFrame(onScroll); }, {passive:true});
      if (typeof LAY !== 'undefined') LAY.subs.push(function(){ docH = LAY.docH; onScroll(); }); docH = document.documentElement.scrollHeight;
      document.addEventListener('visibilitychange', function(){ if (!document.hidden){ last = 0; kick(); } });
    }
    function size(){ var m = innerWidth < 900, w = innerWidth, h = innerHeight; if (sk && m === mob && w === lm && h === lh){ return; }
      sk = 1; mob = m; lm = w; lh = h; W = w; H = h; D = mob ? 1 : Math.min(1.5, devicePixelRatio || 1);
      cv.width = Math.round(W * D); cv.height = Math.round(H * D); GD = mob ? .35 : .5; gcv.width = Math.round(W * GD); gcv.height = Math.round(H * GD); CAP = mob ? 80 : 260; }
    /* calor e n\xedvel do mar s\xf3 mexem em transform/opacity de 2 elementos (nada de vari\xe1vel no :root) */
    function onScroll(){ scrRaf = 0; var m = docH - innerHeight; heat = m > 0 ? Math.min(1, Math.max(0, scrollY / m)) : 0;
      if (heatEl) heatEl.style.opacity = 0;
      if (sea) sea.style.transform = 'translate3d(0,' + ((1 - heat) * 80 + (1 - amp) * 40).toFixed(1) + 'px,0)'; }
    function kick(){ if (!raf && !running && !document.hidden) raf = requestAnimationFrame(loop); }
    /* ambiente por timer: mantem o clima sem deixar o canvas ligado o tempo todo */
    function ambTick(){
      ambT = 0;
      if (!theme || reduce || document.hidden || theme !== 'brotto') return;
      if (parts.length < CAP - 4 && Math.random() < (mob ? .5 : .8))
        P({k:'leaf', x:rnd(0, W), y:-20, vx:rnd(-.3, .3), vy:rnd(.55, 1), r:rnd(7, 11), life:mob ? 640 : 1100, rot:rnd(0, 6), vr:rnd(-.03, .03), ph:rnd(0, 6), sway:1, v:Math.random() < .5 ? 0 : 1});
      ambT = setTimeout(ambTick, mob ? 950 : 700);
    }
    function ambStart(){ if (!ambT && !reduce) ambT = setTimeout(ambTick, 700); }
    function P(o){ if (parts.length >= CAP) return; o.vx = o.vx || 0; o.vy = o.vy || 0; o.ax = o.ax || 0; o.ay = o.ay || 0; o.drag = o.drag || 1; o.max = o.life; o.age = 0; o.rot = o.rot || 0; o.vr = o.vr || 0; o.ph = o.ph || 0; o.sp = o.sp || 0; parts.push(o); kick(); }
    function ambient(dt){
      if (reduce || !theme) return;
      var k = (mob ? .5 : 1) * amp;
      if (theme === 'faisca'){
        if (false) P({k:'fire', add:1, x:rnd(-20, W + 20), y:H + 20, vx:rnd(-.3, .3), vy:rnd(-1.6, -.8) * (1 + heat * 1.2), ay:-.02, r:rnd(20, 34) * (1 + heat * .7), life:rnd(34, 54) * (1 + heat * .6)});
        if (false) P({k:'ember', add:1, x:rnd(0, W), y:H + 4, vx:rnd(-.5, .5), vy:rnd(-2.8, -1.3), r:rnd(2.5, 4.5), life:rnd(100, 170)});
      }
    }
    function draw(p, g, d){
      var t = p.age / p.max, fin = Math.min(1, p.age / 10), a, s, im;
      if (p.k === 'fire'){ s = p.r * (1.1 + t * 1.9); a = (1 - t) * .62 * fin; im = SPR.fire; }
      else if (p.k === 'ember'){ s = p.r * 3; a = Math.min(1, (p.max - p.age) / 30) * fin * (.65 + .35 * Math.sin(p.age * .6 + p.ph)); im = SPR.ember; }
      else if (p.k === 'spark'){ s = p.r * 4 * (1 - t * .5); a = (1 - t) * fin; im = SPR.spark; }
      else if (p.k === 'bub'){ s = p.r * 2; a = .9 * fin; im = SPR.bub; }
      else if (p.k === 'leaf'){ s = p.r * 2.2; a = (p.sway ? .92 : Math.min(1, (p.max - p.age) / 25)) * fin; im = SPR.leaf[p.v || 0]; }
      else if (p.k === 'drop'){ s = p.r * 2.4; a = .95; im = SPR.drop; }
      if (p.kill) a *= Math.max(0, (p.max - p.age) / 14);
      if (a <= .01) return;
      g.globalAlpha = a;
      if (p.k === 'leaf' || p.k === 'drop'){
        var ang = p.k === 'drop' ? Math.atan2(p.vy, p.vx) - Math.PI / 2 : p.rot, c = Math.cos(ang) * d, n = Math.sin(ang) * d, h = p.k === 'drop' ? s * 1.6 : s;
        g.setTransform(c, n, -n, c, p.x * d, p.y * d); g.drawImage(im, -s / 2, -h / 2, s, h);
      } else { g.drawImage(im, (p.x - s / 2) * d, (p.y - s / 2) * d, s * d, s * d); }
    }
    function loop(now){
      raf = 0; running = true; var dt = last ? Math.min(2.5, (now - last) / 16.67) : 1; last = now;
      if (cv && cv.style.display === 'none'){ cv.style.display = 'block'; gcv.style.display = 'block'; }
      if (theme && amp < 1) amp = Math.min(1, amp + dt * .012);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); gtx.setTransform(1, 0, 0, 1, 0, 0); gtx.clearRect(0, 0, gcv.width, gcv.height); ambient(dt);
      var i, p, n = parts.length;
      for (i = n - 1; i >= 0; i--){ p = parts[i]; p.age += dt;
        if (p.age >= p.max){ parts[i] = parts[parts.length - 1]; parts.pop(); continue; }
        var dr = p.drag === 1 ? 1 : Math.pow(p.drag, dt); p.vx = (p.vx + p.ax * dt) * dr; p.vy = (p.vy + p.ay * dt) * dr; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.k === 'ember') p.x += Math.sin(p.age * .12 + p.ph) * .4 * dt;
        if (p.sway || p.k === 'bub') p.x += Math.sin(p.age * (p.k === 'bub' ? .05 : .03) + p.ph) * (p.k === 'bub' ? .45 : .8) * dt;
        if ((p.k === 'bub' && p.y < -30) || (p.k === 'leaf' && p.y > H + 40)) p.age = p.max;
        if (p.k === 'drop' && !p.sp && p.y > H - 6){ p.age = p.max; for (var j = 0; j < 3; j++) P({k:'drop', x:p.x, y:H - 8, vx:rnd(-2.4, 2.4), vy:rnd(-4, -1.6), ay:.3, r:p.r * .5, life:28, sp:1}); }
      }
      for (i = 0; i < parts.length; i++) if (!parts[i].add) draw(parts[i], ctx, D);
      gtx.globalCompositeOperation = 'lighter';
      for (i = 0; i < parts.length; i++) if (parts[i].add) draw(parts[i], gtx, GD);
      ctx.globalAlpha = 1; gtx.globalAlpha = 1;
      if (theme && amp < 1) onScroll();
      running = false;
      if (parts.length){ if (!raf) raf = requestAnimationFrame(loop); }
      else if (cv){ last = 0; if (theme && amp < 1){ amp = 1; onScroll(); } cv.style.display = 'none'; gcv.style.display = 'none'; }
    }
    function flash(c){ var f = document.createElement('div'); f.className = 'fx-flash'; f.style.background = 'radial-gradient(circle at 50% 60%,' + c + ',transparent 70%)'; document.body.appendChild(f);
      f.animate([{opacity:.55}, {opacity:0}], {duration:700, easing:'ease-out'}).onfinish = function(){ f.remove(); }; }
    function waveAt(x, bottom, w, h, ms){
      var el = document.createElement('div'); el.className = 'fx-wave'; el.style.cssText = 'left:' + x + 'px;top:' + (bottom - h) + 'px;width:' + w + 'px;height:' + h + 'px';
      el.innerHTML = '<div class="wl a">' + WAVE + '</div><div class="wl b">' + WAVE + '</div>'; document.body.appendChild(el);
      el.animate([{transform:'scaleY(0)'}, {transform:'scaleY(1.08)', offset:.3}, {transform:'scaleY(.95)', offset:.5}, {transform:'scaleY(1)', offset:.7, opacity:1}, {transform:'scaleY(0)', opacity:.6}], {duration:ms || 1500, easing:'cubic-bezier(.3,.9,.4,1)'}).onfinish = function(){ el.remove(); };
    }
    /* poder saindo da carta, antes do salto */
    function cardFx(id, r){
      ensure(); if (reduce) return;
      var cx = r.left + r.width / 2, by = r.top + r.height;
      if (id === 'faisca'){
        flash('rgba(255,120,30,.55)'); var t0 = performance.now();
        (function f(now){ if (now - t0 > 650) return; for (var i = 0; i < (mob ? 3 : 5); i++) P({k:'fire', add:1, x:cx + rnd(-r.width * .4, r.width * .4), y:by - rnd(0, 20), vx:rnd(-.6, .6), vy:rnd(-7, -3.5), ay:-.05, drag:.985, r:rnd(10, 20), life:rnd(26, 40)});
          if (Math.random() < .7) P({k:'ember', add:1, x:cx + rnd(-30, 30), y:by - 10, vx:rnd(-2, 2), vy:rnd(-7, -3), r:rnd(1.4, 2.6), life:rnd(60, 100)}); requestAnimationFrame(f); })(t0);
      } else if (id === 'bolha'){
        flash('rgba(60,160,255,.45)'); waveAt(r.left - r.width * .15, by + 6, r.width * 1.3, r.height * .75, 1400);
        setTimeout(function(){ for (var i = 0; i < (mob ? 45 : 80); i++) P({k:'drop', x:r.left + rnd(0, r.width), y:r.top + r.height * rnd(.25, .5), vx:rnd(-5, 5), vy:rnd(-11, -4), ay:.34, r:rnd(2.5, 5.5), life:260}); }, 380);
      } else {
        flash('rgba(110,220,90,.45)');
        for (var i = 0; i < (mob ? 30 : 50); i++){ var a = rnd(0, Math.PI * 2), s = rnd(3, 10); P({k:'leaf', x:cx, y:r.top + r.height / 2, vx:Math.cos(a) * s, vy:Math.sin(a) * s - 3, ay:.16, drag:.97, r:rnd(6, 11), life:rnd(80, 130), rot:rnd(0, 6), vr:rnd(-.25, .25)}); }
        for (var j = 0; j < 30; j++){ var b = rnd(0, Math.PI * 2), q = rnd(2, 7); P({k:'spark', add:1, x:cx, y:r.top + r.height / 2, vx:Math.cos(b) * q, vy:Math.sin(b) * q, drag:.94, r:rnd(2, 4), life:rnd(30, 50)}); }
      }
    }
    /* poder do companheiro (ao aterrissar e quando a pessoa toca nele) */
    function palFx(pal, big){
      ensure(); if (reduce || !pal) return;
      var S = pal.size, x = pal.x, y = pal.gy, id = pal.id;
      if (id === 'faisca'){
        pal.face = x > W / 2 ? -1 : 1; pal.place(x, y, 1, 1, 0);
        var d3 = pal.el.querySelector('.fox3d.on'), mx = x + S / 2 + pal.face * S * (d3 ? .27 : .07), my = y + S * (d3 ? .36 : .5), t0 = performance.now(), ms = big ? 1100 : 650;
        pal.s.animate([{transform:'scale(1)'}, {transform:'scale(1.12,.9)', offset:.25}, {transform:'scale(.94,1.08) translateX(' + (-pal.face * 6) + 'px)', offset:.4}, {transform:'scale(1)'}], {duration:ms + 200});
        if (JET.ok()){ if (big) pal.attack(); else if (Math.random() < .45) pal.fire(520, {short:true}); return; }
        setTimeout(function(){ flash('rgba(255,120,30,.3)');
          (function f(now){ if (now - t0 - 250 > ms) return; for (var i = 0; i < (mob ? 3 : 4); i++) P({k:'fire', add:1, x:mx, y:my, vx:pal.face * rnd(6, 10), vy:rnd(-1.8, .6), ay:-.07, drag:.965, r:rnd(7, 13), life:rnd(30, 44)});
            if (Math.random() < .6) P({k:'ember', add:1, x:mx, y:my, vx:pal.face * rnd(5, 9), vy:rnd(-2.5, 0), r:rnd(1.4, 2.4), life:rnd(40, 80)}); requestAnimationFrame(f); })(performance.now());
        }, 250);
      } else if (id === 'bolha'){
        waveAt(x - S * .7, y + S * .98, S * 2.4, S * .8, 1300);
        setTimeout(function(){ for (var i = 0; i < (big ? 50 : 26); i++) P({k:'drop', x:x + S / 2 + rnd(-S * .8, S * .8), y:y + S * .7, vx:rnd(-4, 4), vy:rnd(-10, -5), ay:.34, r:rnd(2.5, 5), life:200}); }, 250);
      } else {
        for (var i = 0; i < (big ? 36 : 18); i++){ var a = rnd(Math.PI * 1.05, Math.PI * 1.95), s = rnd(3, 8); P({k:'leaf', x:x + S / 2, y:y + S * .3, vx:Math.cos(a) * s, vy:Math.sin(a) * s, ay:.15, drag:.97, r:rnd(5, 9), life:rnd(70, 110), rot:rnd(0, 6), vr:rnd(-.2, .2)}); }
        for (var j = 0; j < 20; j++) P({k:'spark', add:1, x:x + S / 2 + rnd(-S * .6, S * .6), y:y + S * rnd(.2, .9), vy:rnd(-2, -.5), r:rnd(2, 3.5), life:rnd(30, 60)});
      }
    }
    /* decora\xe7\xe3o das se\xe7\xf5es conforme o parceiro */
    var VINE = '<svg class="vine" viewBox="0 0 160 100" aria-hidden="true"><path class="vs" d="M-4 8 C30 2 40 22 66 16 S104 0 128 12 C140 18 142 30 132 34"/><path class="vs b" d="M-4 8 C8 30 0 52 10 72 S6 94 16 102"/>' +
      [[26,8,-35,.5],[52,18,20,.75],[84,8,-30,1],[112,7,25,1.2],[6,34,70,.7],[4,62,110,1]].map(function(l){ return '<g transform="translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[2] + ')"><path class="lf" style="--d:' + l[3] + 's" d="M0 0 C6 -9 17 -7 20 0 C14 7 5 7 0 0Z"/></g>'; }).join('') +
      '<g class="fl" transform="translate(132 34)"><circle r="5" fill="#ffd34a"/><circle cx="-6" r="4" fill="#ff9ec4"/><circle cx="6" r="4" fill="#ff9ec4"/><circle cy="-6" r="4" fill="#ff9ec4"/><circle cy="6" r="4" fill="#ff9ec4"/><circle r="3" fill="#ffd34a"/></g></svg>';
    var SEL = CARDS;
    function decorate(root){
      root = root || document;
      if (typeof SEAM !== 'undefined') SEAM.build(root, theme);
      if (io){ io.disconnect(); io = null; }
      if (!theme || theme === 'faisca') return;
    }
    function setTheme(id){
      ensure(); if (id !== theme) amp = 0; theme = id || null; var h = document.documentElement;
      h.classList.remove('th-faisca', 'th-brotto', 'th-bolha'); if (theme) h.classList.add('th-' + theme);
      onScroll(); decorate(ROOT()); BURN.watch(ROOT()); if (theme !== 'faisca') BURN.clear();
      sea = document.querySelector('.fx-sea');
      if (theme === 'bolha' && !sea){ sea = document.createElement('div'); sea.className = 'fx-sea'; sea.setAttribute('aria-hidden', 'true'); sea.innerHTML = '<div class="wl a">' + WAVE + '</div><div class="wl b">' + WAVE + '</div>'; document.body.appendChild(sea); }
      else if (theme !== 'bolha' && sea){ sea.remove(); sea = null; }
      docH = document.documentElement.scrollHeight; onScroll(); kick(); ambStart();
    }
    function clear(){ BURN.clear();
      if (ambT){ clearTimeout(ambT); ambT = 0; }
      if (!cv) return; theme = null; amp = 0;
      for (var i = 0; i < parts.length; i++){ var p = parts[i]; if (!p.kill){ p.kill = 1; p.max = Math.min(p.max, p.age + 14); } }
      if (parts.length > 60) parts.length = 60;
      document.documentElement.classList.remove('th-faisca', 'th-brotto', 'th-bolha');
      if (io){ io.disconnect(); io = null; }
      document.querySelectorAll('.vine,.drip').forEach(function(n){ n.remove(); });
      if (typeof SEAM !== 'undefined') SEAM.clear();
      if (heatEl) heatEl.style.opacity = 0;
      if (sea){ var s = sea; sea = null; s.style.transition = 'transform .5s ease-in,opacity .5s'; s.style.transform = 'translate3d(0,120px,0)'; s.style.opacity = 0; setTimeout(function(){ s.remove(); }, 520); }
      kick();
    }
    return {spark:function(o){ ensure(); if (!reduce) P(o); }, cardFx:cardFx, palFx:palFx, setTheme:setTheme, clear:clear, decorate:function(r){ if (theme) decorate(r); BURN.watch(r); }};
  })();
  /* ---------- Escolha seu parceiro: criaturas originais da loja + companheiro que anda pelo site ---------- */
  var PALS = {
    faisca:{n:'Fa\xedsca', type:'Fogo', c:'#ff6a2b', c2:'#ffcf4a', perk:'10% em consoles', code:'FAISCA10', go:'consoles', voice:['Fsss!','Fii-fi!','Fiu fiu!','Fssst?'], bio:'Esquentadinho e r\xe1pido. Acende quando v\xea um console novo.'},
    brotto:{n:'Brotto', type:'Planta', c:'#3fa34d', c2:'#a6ea6e', perk:'15% em acess\xf3rios', code:'BROTTO15', go:'acess', voice:['Brot brot!','Brooo?','Brot!','Br\xf3-br\xf3!'], bio:'Calmo e curioso. Adora fone bom e chaveiro bonito.'},
    bolha:{n:'Bolha', type:'\xc1gua', c:'#2b7fff', c2:'#7fd8ff', perk:'20% em TCG', code:'BOLHA20', go:'tcg', voice:['Blub!','Blub blub!','Bluuu?','Blop!'], bio:'Brincalhona. Vive mergulhada em booster e carta rara.'}
  };
  /* ---------- Fa\xedsca 3D: renderizador WebGL pr\xf3prio (sem biblioteca) com "esqueleto por regi\xe3o" no shader ---------- */
  var FOX3D = (function(){
    var MODELS = {
      faisca:{d:null, src:'faisca.json', head:[0,.41,0], tail:[0,.26,-.07], ear:[.17,.76,0], arm:[.155,.38,.02], leg:[.08,.17,0], rest:0, jaw:1, earK:1, flap:0, mouth:[0,.475,.235], fwd:[0,.46,.6], rim:[1,.55,.2]},
      brotto:{d:null, src:'brotto.json', head:[0,.55,.07], tail:[.05,.2,-.05], ear:[.13,.76,.05], arm:[.16,.5,.07], leg:[.1,.17,.07], rest:1.15, jaw:0, earK:1.3, flap:0, mouth:[0,.6,.29], fwd:[0,.6,.7], rim:[.55,1,.45]},
      bolha:{d:null, src:'bolha.json', head:[0,.6,.07], tail:[.03,.33,-.04], ear:[.19,.72,.07], arm:[.15,.575,.08], leg:[.1,.22,.07], rest:1.2, jaw:0, earK:1.4, flap:1, mouth:[0,.68,.26], fwd:[0,.68,.7], rim:[.5,.85,1]}
    };
    function load(M, cb){
      if (M.d) return cb(null); (M.q = M.q || []).push(cb); if (M.loading) return; M.loading = true;
      fetch(BASE + M.src).then(function(r){ if (!r.ok) throw new Error('modelo ' + r.status); return r.json(); })
        .then(function(d){ M.d = d; M.q.forEach(function(f){ f(null); }); M.q = []; }, function(e){ M.loading = false; M.q.forEach(function(f){ f(e); }); M.q = []; });
    }
    function decode(M){
      if (M.geo) return M.geo; var DATA = M.d, geo;
      var s = atob(DATA.geo), n = s.length, u8 = new Uint8Array(n); for (var i = 0; i < n; i++) u8[i] = s.charCodeAt(i);
      var m = DATA.meta, nv = m.nv, nt = m.nt, o = 0, buf = u8.buffer;
      function take(bytes){ var b = buf.slice(o, o + bytes); o += bytes; return b; }
      geo = {nv:nv, nt:nt, lo:m.lo, hi:m.hi, pos:new Uint16Array(take(nv * 6)), uv:new Uint16Array(take(nv * 4)), nrm:new Int8Array(take(nv * 3)), w:new Uint8Array(take(nv * 4)), w2:new Uint8Array(take(nv * 2)), idx:new Uint16Array(take(nt * 6))};
      M.geo = geo; return geo;
    }
    function texReady(M, cb){ if (M.imgReady) return cb(M.img); (M.wait = M.wait || []).push(cb); if (M.img) return; M.img = new Image(); M.img.onload = function(){ M.imgReady = true; M.wait.forEach(function(f){ f(M.img); }); M.wait = []; }; M.img.src = M.d.tex; }
    var VS = [
      'precision highp float;',
      'attribute vec3 aP; attribute vec2 aUV; attribute vec3 aN; attribute vec4 aW; attribute vec2 aW2;',
      'uniform vec3 uLo; uniform vec3 uHi; uniform mat4 uVP; uniform float uYaw;',
      'uniform float uT, uWalk, uWag, uHY, uHP, uHR, uEar, uArmL, uArmR, uBreath, uSquash, uRest, uHasJaw, uEarK, uFlap; uniform mediump float uJaw;',
      'uniform vec3 uPH, uPT, uPE, uPA, uPL;',
      'varying float vL, vB;',
      'varying vec2 vUV; varying vec3 vN; varying float vAO;',
      'mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}',
      'mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}',
      'mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}',
      'void main(){',
      ' vec3 p=uLo+aP*(uHi-uLo); vec3 n=normalize(aN); float sx=p.x<0.?-1.:1.; float ph=sx>0.?0.:3.14159;',
      ' p+=vec3(sin(uT*1.1)*.012,sin(uT*1.6)*.03,sin(uT*.9)*.01)*aW2.y;',
      ' float lw=aW2.x; vec3 hp=vec3(sx*uPL.x,uPL.yz); mat3 R=rx(uWalk*.55*sin(uT*11.+ph)*lw); p=R*(p-hp)+hp; n=R*n;',
      ' float aw=aW.w; vec3 sp=vec3(sx*uPA.x,uPA.yz); R=rx(-uWalk*.45*sin(uT*11.+ph)*aw)*rz(sx*((sx>0.?uArmR:uArmL)-uRest)*aw); p=R*(p-sp)+sp; n=R*n;',
      ' float tw=aW.y; vec3 tp=uPT; R=ry(uWag*tw)*rx((.12*sin(uT*2.7)+uWalk*.2)*tw); p=R*(p-tp)+tp; n=R*n;',
      ' float ew=aW.z; vec3 ep=vec3(sx*uPE.x,uPE.yz); R=rz(-sx*uEar*uEarK*ew)*ry(sx*sin(uT*4.+ph*.3)*.28*uFlap*ew); p=R*(p-ep)+ep; n=R*n;',
      ' float ax=abs(p.x); float yl=.49-.008*sin(3.14159*min(ax,.07)/.07); vL=step(p.y,yl); vB=(1.-smoothstep(.055,.08,ax))*smoothstep(.12,.17,p.z)*smoothstep(.40,.43,p.y)*uHasJaw;',
      ' vec3 jp=vec3(0.,.49,.09); R=rx(uJaw*vL*vB); p=R*(p-jp)+jp; n=R*n;',
      ' float hw=aW.x; vec3 np=uPH; R=ry(uHY*hw)*rx(uHP*hw)*rz(uHR*hw); p=R*(p-np)+np; n=R*n;',
      ' float body=(1.-hw)*(1.-lw)*smoothstep(.14,.3,p.y); p.xz*=1.+uBreath*body;',
      ' p.y*=uSquash; p.xz*=1.+(1.-uSquash)*.6;',
      ' mat3 Y=ry(uYaw); p=Y*p; n=Y*n;',
      ' vUV=aUV; vN=n; vAO=smoothstep(-.02,.16,p.y)*.25+.75;',
      ' gl_Position=uVP*vec4(p,1.);',
      '}'].join('\n');
    var FS = [
      'precision mediump float;',
      'uniform sampler2D uTex; uniform vec3 uRim; uniform float uRimK, uJaw, uGlow;',
      'varying float vL, vB;',
      'varying vec2 vUV; varying vec3 vN; varying float vAO;',
      'void main(){',
      ' vec3 N=normalize(vN); vec3 c=texture2D(uTex,vUV).rgb;',
      ' vec3 L=normalize(vec3(.45,.75,.65)); float wrap=clamp((dot(N,L)+.45)/1.45,0.,1.);',
      ' float fill=clamp(dot(N,normalize(vec3(-.6,.2,.5))),0.,1.)*.18;',
      ' vec3 col=c*(.38+.78*wrap+fill)*mix(vec3(.9,.86,.96),vec3(1.06,1.02,.97),.5+.5*N.y)*vAO;',
      ' float rim=pow(1.-clamp(N.z,0.,1.),2.6); col+=uRim*rim*uRimK;',
      ' float spec=pow(clamp(dot(N,normalize(L+vec3(0.,0.,1.))),0.,1.),28.)*.12; col+=spec;',
      ' float mid=1.-abs(vL*2.-1.); float mo=step(.004,vL)*step(vL,.996)*smoothstep(.25,.6,vB)*smoothstep(.02,.08,uJaw);',
      ' vec3 mc=mix(vec3(.22,.03,.05),vec3(.7,.2,.24),smoothstep(.6,.95,vL)); mc=mix(mc,vec3(1.,.5,.12),uGlow*.6*smoothstep(.0,.7,mid));',
      ' col=mix(col,mc,mo); col+=vec3(1.,.45,.1)*uGlow*.18*smoothstep(.2,.8,N.z)*vB;',
      ' gl_FragColor=vec4(col,1.);',
      '}'].join('\n');
    function persp(fovy, asp, near, far){ var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far); return [f / asp,0,0,0, 0,f,0,0, 0,0,(far + near) * nf,-1, 0,0,2 * far * near * nf,0]; }
    function mul(a, b){ var o = new Array(16); for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++){ var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s; } return o; }
    function trans(x, y, z){ return [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]; }
    function rotX(a){ var c = Math.cos(a), s = Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; }
    var VP = mul(persp(16.5 * Math.PI / 180, 1, .5, 10), mul(trans(0, -.02, -4.15), mul(rotX(.06), trans(0, -.52, 0))));
    function sh(gl, t, src){ var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    function Fox(cv, id){
      var glm = innerWidth < 900; var gl = cv.getContext('webgl', {antialias:!glm, alpha:true, premultipliedAlpha:true, powerPreference:'default'}) || cv.getContext('experimental-webgl');
      if (!gl) throw new Error('no webgl');
      var M = MODELS[id] || MODELS.faisca, g = decode(M), pr = gl.createProgram(); this.M = M; this.id = id;
      gl.attachShader(pr, sh(gl, gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl, gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
      gl.useProgram(pr);
      function attr(name, data, size, type, norm){ var b = gl.createBuffer(), l = gl.getAttribLocation(pr, name); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); if (l < 0) return; gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, type, norm, 0, 0); }
      attr('aP', g.pos, 3, gl.UNSIGNED_SHORT, true); attr('aUV', g.uv, 2, gl.UNSIGNED_SHORT, true); attr('aN', g.nrm, 3, gl.BYTE, true);
      attr('aW', g.w, 4, gl.UNSIGNED_BYTE, true); attr('aW2', g.w2, 2, gl.UNSIGNED_BYTE, true);
      var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.idx, gl.STATIC_DRAW);
      var U = {}; ['uLo','uHi','uVP','uYaw','uT','uWalk','uWag','uHY','uHP','uHR','uEar','uArmL','uArmR','uBreath','uSquash','uTex','uRim','uRimK','uJaw','uGlow','uRest','uHasJaw','uEarK','uFlap','uPH','uPT','uPE','uPA','uPL'].forEach(function(k){ U[k] = gl.getUniformLocation(pr, k); });
      gl.uniform3fv(U.uLo, g.lo); gl.uniform3fv(U.uHi, g.hi); gl.uniformMatrix4fv(U.uVP, false, VP);
      gl.uniform1f(U.uRest, M.rest); gl.uniform1f(U.uHasJaw, M.jaw); gl.uniform1f(U.uEarK, M.earK); gl.uniform1f(U.uFlap, M.flap); gl.uniform3fv(U.uPH, M.head); gl.uniform3fv(U.uPT, M.tail); gl.uniform3fv(U.uPE, M.ear); gl.uniform3fv(U.uPA, M.arm); gl.uniform3fv(U.uPL, M.leg);
      var tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([230, 130, 60, 255]));
      var self = this; this.ready = false;
      texReady(M, function(img){ gl.bindTexture(gl.TEXTURE_2D, tx); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); self.ready = true; self.dirty = true; });
      gl.uniform1i(U.uTex, 0); gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.clearColor(0, 0, 0, 0);
      this.gl = gl; this.U = U; this.cv = cv; this.nt = g.nt;
      /* estado animado (valores atuais suavizados) */
      this.s = {yaw:.32, hy:0, hp:0, hr:0, walk:0, wag:0, ear:0, armL:0, armR:0, sq:1, jaw:0, glow:0};
      this.t = {yaw:.32, hy:0, hp:0, hr:0, walk:0, armL:0, armR:0, jaw:0, glow:0};
      this.nextLook = 0; this.earT = 0; this.wave = 0; this.rim = [1, .62, .3]; this.rimK = .3;
    }
    Fox.prototype.size = function(){
      var d = Math.min(innerWidth < 900 ? 1.5 : 2, devicePixelRatio || 1);
      if (this._d !== d){ this._d = d; this._dirty = true; }
      if (!this._dirty && this.cv.width) return;
      var cw = this._cw || this.cv.clientWidth, ch = this._ch || this.cv.clientHeight;
      var w = Math.round(cw * d), h = Math.round(ch * d); this._dirty = false;
      if (w && (this.cv.width !== w || this.cv.height !== h)){ this.cv.width = w; this.cv.height = h; }
    };
    Fox.prototype.frame = function(now, dt){
      var s = this.s, t = this.t, tt = now / 1000, k = 1 - Math.pow(.0015, dt);
      if (now > this.nextLook && !this.lockLook){ this.nextLook = now + 1600 + Math.random() * 2600; t.hy = (Math.random() - .5) * .9; t.hp = (Math.random() - .3) * .25; t.hr = (Math.random() - .5) * .22; }
      if (now > this.earT){ this.earT = now + 2500 + Math.random() * 3500; this.earK = 1; }
      this.earK = Math.max(0, (this.earK || 0) - dt * 2.4);
      var ear = Math.sin((1 - this.earK) * Math.PI * 3) * this.earK * .28;
      if (this.wave > 0){ this.wave = Math.max(0, this.wave - dt); t.armR = 2.3 + Math.sin(tt * 14) * .35; } else t.armR = 0;
      for (var key in t) s[key] += (t[key] - s[key]) * (key === 'walk' || key === 'jaw' || key === 'glow' ? Math.min(1, k * 2.4) : k);
      s.wag = Math.sin(tt * (s.walk > .5 ? 14 : 5.5)) * (s.walk > .5 ? .45 : .32);
      var gl = this.gl, U = this.U; this.size(); gl.viewport(0, 0, this.cv.width, this.cv.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(U.uT, tt); gl.uniform1f(U.uYaw, s.yaw); gl.uniform1f(U.uWalk, s.walk); gl.uniform1f(U.uWag, s.wag);
      gl.uniform1f(U.uHY, s.hy); gl.uniform1f(U.uHP, s.hp + Math.sin(tt * 1.7) * .03); gl.uniform1f(U.uHR, s.hr); gl.uniform1f(U.uEar, ear);
      gl.uniform1f(U.uArmL, s.armL + Math.sin(tt * 1.9) * .04); gl.uniform1f(U.uArmR, s.armR + Math.sin(tt * 1.9 + 1) * .04);
      gl.uniform1f(U.uBreath, Math.sin(tt * 2.4) * .018); gl.uniform1f(U.uSquash, s.sq);
      gl.uniform1f(U.uJaw, s.jaw); gl.uniform1f(U.uGlow, s.glow); gl.uniform3fv(U.uRim, this.rim); gl.uniform1f(U.uRimK, this.rimK);
      gl.drawElements(gl.TRIANGLES, this.nt * 3, gl.UNSIGNED_SHORT, 0);
    };
    /* posi\xe7\xe3o da boca e dire\xe7\xe3o do focinho, em fra\xe7\xe3o do canvas (mesma conta do shader) */
    Fox.prototype.mouth = function(){
      var s = this.s, H = this.M.head;
      function tf(q){ var x = q[0], y = q[1] - H[1], z = q[2] - H[2], c, n, a, b;
        c = Math.cos(s.hr); n = Math.sin(s.hr); a = c * x - n * y; b = n * x + c * y; x = a; y = b;
        c = Math.cos(s.hp); n = Math.sin(s.hp); a = c * y - n * z; b = n * y + c * z; y = a; z = b;
        c = Math.cos(s.hy); n = Math.sin(s.hy); a = c * x + n * z; b = -n * x + c * z; x = a; z = b;
        y += H[1]; z += H[2]; y *= s.sq; var k = 1 + (1 - s.sq) * .6; x *= k; z *= k;
        c = Math.cos(s.yaw); n = Math.sin(s.yaw); a = c * x + n * z; b = -n * x + c * z;
        var v = [a, y, b, 1], o = [0, 0, 0, 0]; for (var j = 0; j < 4; j++) for (var i = 0; i < 4; i++) o[j] += VP[i * 4 + j] * v[i];
        return [(o[0] / o[3] + 1) / 2, (1 - o[1] / o[3]) / 2]; }
      var m = tf(this.M.mouth), f = tf(this.M.fwd);
      return {x:m[0], y:m[1], dx:f[0] - m[0], dy:f[1] - m[1]};
    };
    /* um la\xe7o s\xf3 para todas as inst\xe2ncias; para quando nada est\xe1 vis\xedvel */
    var list = [], raf = 0, last = 0;
    function loop(now){
      raf = 0; var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now; var any = false;
      for (var i = list.length - 1; i >= 0; i--){ var f = list[i]; if (!f.cv.isConnected){ if (RO) RO.unobserve(f.cv); list.splice(i, 1); continue; } if (f.vis && f.ready && !f.pause){ if (f.tick) f.tick(now, dt); f.frame(now, dt); any = true; } }
      if (list.length && !document.hidden) raf = requestAnimationFrame(loop); else last = 0;
    }
    function kick(){ if (!raf) raf = requestAnimationFrame(loop); }
    document.addEventListener('visibilitychange', function(){ if (!document.hidden){ last = 0; kick(); } });
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){ es.forEach(function(e){ var f = e.target.__fox; if (f) f.vis = e.isIntersecting; }); kick(); }) : null;
    var RO = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(function(es){ for (var i = 0; i < es.length; i++){ var f = es[i].target.__fox; if (!f) continue; f._cw = es[i].contentRect.width; f._ch = es[i].contentRect.height; f._dirty = true; } kick(); }) : null;
    function mount(root){
      var n = 0;
      (root || document).querySelectorAll('.fox3d:not([data-on])').forEach(function(el){
        el.setAttribute('data-on', '1'); var cv = el.querySelector('canvas'); if (!cv) return; var mid = el.getAttribute('data-m') || 'faisca';
        load(MODELS[mid] || MODELS.faisca, function(err){ if (err){ el.classList.add('no3d'); return; } if (!cv.isConnected) return;
        try { var f = new Fox(cv, mid); cv.__fox = f; f.vis = !io; list.push(f); if (io) io.observe(cv); if (RO) RO.observe(cv); el.classList.add('on'); n++;
          var pal = el.closest('.pal'), card = el.closest('.pcard');
          if (pal) f.tick = function(now){ var w = pal.classList.contains('walk'), z = pal.classList.contains('zz'), br = pal.classList.contains('fire'), la = f.lookAt && now < f.lookAt.until && !w && !z && !br, gr = now < (f.greetUntil || 0);
            f.t.walk = w ? 1 : 0; f.t.yaw = w ? Math.PI / 2 : br ? 1.12 : gr ? 0 : .3; f.lockLook = w || z || br || la || gr; f.t.jaw = br ? .52 : 0; f.t.glow = br ? 1 : 0; f.pause = z && !br;
            if (w){ f.t.hy = 0; f.t.hp = .05; f.t.hr = 0; } if (z){ f.t.hy = 0; f.t.hp = .42; f.t.hr = .18; } if (br){ f.t.hy = 0; f.t.hp = w ? -.04 : -.1; f.t.hr = 0; }
            if (gr && !w && !br){ f.t.hy = 0; f.t.hp = -.06; f.t.hr = Math.sin(now / 260) * .12; }
            if (la){ var r = cv.getBoundingClientRect(), L = f.lookAt, nx = (L.x - (r.left + r.width / 2)) / r.width, ny = (L.y - (r.top + r.height * .4)) / r.height;
              f.t.hy = Math.max(-.95, Math.min(.95, nx * 1.3)) * (L.face < 0 ? -1 : 1) - .2; f.t.hp = Math.max(-.38, Math.min(.4, ny * .8)); f.t.hr = -nx * .12; }
            var th = document.documentElement.classList.contains('th-' + f.id); f.rim = th ? f.M.rim : [1, .8, .6]; f.rimK = th ? .5 : .3; };
          if (card){ f.t.yaw = .28; card.addEventListener('pointermove', function(e){ var r = cv.getBoundingClientRect(); f.lockLook = true; f.t.hy = Math.max(-.8, Math.min(.8, (e.clientX - (r.left + r.width / 2)) / r.width * 1.4)); f.t.hp = Math.max(-.3, Math.min(.35, (e.clientY - (r.top + r.height * .35)) / r.height * .9)); });
            card.addEventListener('pointerleave', function(){ f.lockLook = false; f.nextLook = 0; }); }
        } catch(err){ el.classList.add('no3d'); if (window.console) console.warn('parceiros 3d', err && err.message); }
        kick(); });
      });
      return n;
    }
    function wave(el){ var cv = el && el.querySelector('.fox3d canvas'); if (cv && cv.__fox) cv.__fox.wave = 1.6; }
    function mouth(el, face){ var cv = el && el.querySelector('.fox3d.on canvas'); if (!cv || !cv.__fox || !cv.__fox.ready) return null;
      var r = cv.getBoundingClientRect(), m = cv.__fox.mouth(), fc = face < 0 ? -1 : 1, lx = fc > 0 ? m.x : 1 - m.x;
      return {x:r.left + lx * r.width, y:r.top + m.y * r.height, dx:m.dx * fc * r.width, dy:m.dy * r.height}; }
    function fox(el){ var cv = el && el.querySelector('.fox3d.on canvas'); return cv && cv.__fox; }
    function look(el, x, y, ms, face){ var f = fox(el); if (f) f.lookAt = {x:x, y:y, face:face, until:performance.now() + (ms || 800)}; return !!f; }
    function greet(el, ms){ var f = fox(el); if (f){ f.greetUntil = performance.now() + (ms || 1600); f.wave = 1.4; } return !!f; }
    return {mount:mount, wave:wave, mouth:mouth, look:look, greet:greet, has:function(id){ return !!MODELS[id]; }};
  })();

  /* ---------- Fogo: ru\xeddo compartilhado (fbm com distor\xe7\xe3o de dom\xednio, sobe como chama de verdade) ---------- */
  var FIRE_GLSL = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', '#else', 'precision mediump float;', '#endif',
    'float h2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h2(i), h2(i + vec2(1., 0.)), f.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), f.x), f.y); }',
    'float fbm(vec2 p){ float s = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 4; i++){ s += a * vn(p); p = m * p + vec2(1.7, 9.2); a *= .5; } return s; }',
    'vec3 ramp(float f){ f = clamp(f, 0., 1.2); return vec3(min(1., .25 + f * 1.7), min(1., pow(f, 1.5) * 1.12), min(1., pow(f, 3.6) * 1.05)); }',
    'float fa(float f){ return smoothstep(0., .5, f); }'
  ].join('\n');
  function glsh(g, t, src){ var x = g.createShader(t); g.shaderSource(x, src); g.compileShader(x); if (!g.getShaderParameter(x, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(x)); return x; }
  function glprog(g, vs, fs){ var p = g.createProgram(); g.attachShader(p, glsh(g, g.VERTEX_SHADER, vs)); g.attachShader(p, glsh(g, g.FRAGMENT_SHADER, fs)); g.linkProgram(p); if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error('link'); return p; }

  /* ---------- Jato de fogo da boca: rajadas curtas, chama que se curva pra cima no fim ---------- */
  var JET = (function(){
    var cv = null, gl = null, U = null, ok = null, raf = 0, last = 0, src = null, until = 0, amp = 0, len = 0, cut = 0, t0 = performance.now(), ang = 0, aim = null, lenT = 1;
    var FS = FIRE_GLSL + '\n' + [
      'uniform vec2 uR; uniform float uT, uAmp, uLen, uCut, uUp, uK;',
      'vec3 wramp(float f){ vec3 c = mix(vec3(.1, .38, .88), vec3(.42, .8, 1.), smoothstep(.25, .75, f)); return mix(c, vec3(.94, .99, 1.), smoothstep(.85, 1.15, f)); }',
      'void main(){',
      ' vec2 q = gl_FragCoord.xy / uR; float u = q.x, v = q.y * 2. - 1., t = uT, asp = uR.y / uR.x;',
      ' v -= uUp * mix(.55, -.8, uK) * u * u;',
      ' float w = mix(.1 + .8 * pow(u, .55), .07 + .5 * pow(u, .7), uK), d = abs(v) / w;',
      ' vec2 P = vec2(u * 4.2, v * asp * 2.1);',
      ' vec2 fl = vec2(-t * mix(3.4, 6.5, uK), -uUp * t * .9 * (1. - uK));',
      ' vec2 wv = vec2(fbm(P * 1.1 + fl * .55), fbm(P * 1.1 + vec2(4.1, 7.3) + fl * .55));',
      ' float n = fbm(P * 2. + wv * 1.7 + fl);',
      ' float L = max(uLen, .06);',
      ' float tb = 1. - abs(fbm(P * 3.4 + wv * 1.2 + fl * 1.35) * 2. - 1.);',
      ' float f = (1. - d) * 1.45 - n * (.55 + .8 * u) + (1. - u) * .28 + (tb - .55) * .7 * smoothstep(.25, 1., d + u * .4);',
      ' f -= smoothstep(.5 * L, L, u + (n - .5) * .45) * 1.3;',
      ' f *= smoothstep(uCut, uCut + .14, u + (n - .5) * .2) * smoothstep(0., .03, u) * uAmp;',
      ' f = clamp(f, 0., 1.4); float a = fa(f);',
      ' float sm = smoothstep(.45, .95, u / L) * smoothstep(.35, .7, fbm(P * 1.4 + fl * .4 + vec2(9.))) * (1. - smoothstep(.3, 1.6, d)) * .28 * uAmp * (1. - a) * (1. - smoothstep(.95, 1.15, u / L));',
      ' vec3 fc = mix(ramp(f), wramp(f), uK); a *= mix(1., .9, uK); vec3 smc = mix(vec3(.18, .14, .14), vec3(.85, .93, 1.), uK);',
      ' gl_FragColor = vec4(fc * a + smc * sm, a + sm);',
      '}'].join('\n');
    function init(){
      if (ok !== null) return ok; ok = false;
      try {
        cv = document.createElement('canvas'); cv.className = 'fire-jet'; cv.setAttribute('aria-hidden', 'true');
        gl = cv.getContext('webgl', {alpha:true, premultipliedAlpha:true, antialias:false}); if (!gl) return false;
        var pr = glprog(gl, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }', FS); gl.useProgram(pr);
        var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        var l = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
        U = {}; ['uR','uT','uAmp','uLen','uCut','uUp','uK'].forEach(function(k){ U[k] = gl.getUniformLocation(pr, k); });
        gl.clearColor(0, 0, 0, 0); document.body.appendChild(cv); ok = true;
      } catch(e){ ok = false; }
      return ok;
    }
    function frame(now){
      raf = 0; var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
      var on = src && !src.dead && now < until;
      if (on){ amp = Math.min(1, amp + dt / .12); len = Math.min(lenT, len + dt / .2); cut = Math.max(0, cut - dt / .08); }
      else { cut = Math.min(1, cut + dt / .3); amp = Math.max(0, amp - dt / .35); }
      if ((!on && (amp <= 0 || cut >= 1)) || !src || src.dead){ cv.style.display = 'none'; amp = 0; len = 0; cut = 0; last = 0; aim = null; return; }
      var S = src.size, face = src.face, m = FOX3D.mouth(src.el, face);
      if (!m){ var r = src.el.getBoundingClientRect(); m = {x:r.left + S / 2 + face * S * .2, y:r.top + S * .46, dx:face, dy:0}; }
      var a = aim && aim.x != null ? Math.atan2(aim.y - m.y, aim.x - m.x) : Math.atan2(m.dy, m.dx);
      if (face > 0) a = Math.max(-.7, Math.min(.5, a)); else { a = a > 0 ? Math.max(Math.PI - .5, a) : Math.min(-Math.PI + .7, a); }
      var df = a - ang; while (df > Math.PI) df -= Math.PI * 2; while (df < -Math.PI) df += Math.PI * 2; ang += df * Math.min(1, dt * 16);
      if (ang > Math.PI) ang -= Math.PI * 2; if (ang < -Math.PI) ang += Math.PI * 2;
      var Lw = Math.round(S * 2.9), Hh = Math.round(S * 1.7), d = Math.min(innerWidth < 900 ? 1.25 : 1.5, devicePixelRatio || 1);
      if (cv.width !== Math.round(Lw * d)){ cv.width = Math.round(Lw * d); cv.height = Math.round(Hh * d); cv.style.width = Lw + 'px'; cv.style.height = Hh + 'px'; }
      cv.style.display = 'block';
      cv.style.transform = 'translate3d(' + (m.x - S * .05 * Math.cos(ang)) + 'px,' + (m.y - Hh / 2 - S * .05 * Math.sin(ang)) + 'px,0) rotate(' + ang + 'rad)';
      gl.viewport(0, 0, cv.width, cv.height); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uR, cv.width, cv.height); gl.uniform1f(U.uT, (now - t0) / 1000); gl.uniform1f(U.uAmp, amp); gl.uniform1f(U.uLen, len); gl.uniform1f(U.uCut, cut); gl.uniform1f(U.uUp, Math.cos(ang) >= 0 ? 1 : -1); gl.uniform1f(U.uK, src.id === 'bolha' ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (aim && aim.el && !aim.done && on && len > .8 * lenT){ aim.done = true; if (src.id === 'bolha'){ for (var q = 0; q < (innerWidth < 900 ? 14 : 22); q++) FX.spark({k:'drop', x:aim.x, y:aim.y, vx:(Math.random() - .5) * 8 - Math.cos(ang) * 2, vy:-Math.random() * 7 - 2, ay:.34, r:2 + Math.random() * 3, life:120}); } else BURN.ignite(aim.el, aim.x, aim.y); }
      raf = requestAnimationFrame(frame);
    }
    /* o = {x, y, el} mira num card e acende ele; o = {short:true} \xe9 s\xf3 uma baforada */
    function hold(pal, ms, o){ if (!init()) return false; src = pal; until = performance.now() + ms; aim = o || null; lenT = o && o.short ? .55 : 1; if (!raf){ last = 0; raf = requestAnimationFrame(frame); } return true; }
    return {hold:hold, stop:function(){ until = 0; }, ok:function(){ return init(); }};
  })();

  /* ---------- Fogo se alastrando pelas bordas dos cards (s\xf3 no tema do Fa\xedsca) ---------- */
  var BURN = (function(){
    var SELC = CARDS, cv = null, gl = null, U = null, ok = null, raf = 0, list = [], vis = new Set(), seen = new WeakMap(), lastAuto = 0, t0 = performance.now();
    var VS = 'attribute vec2 a; uniform vec4 uB; void main(){ gl_Position = vec4(mix(uB.xy, uB.zw, a), 0., 1.); }';
    var FS = FIRE_GLSL + '\n' + [
      'uniform vec4 uRect; uniform float uRad, uT, uAge, uIgn, uDpr;',
      'void main(){',
      ' vec2 p = gl_FragCoord.xy, hs = uRect.zw * .5, q = p - (uRect.xy + hs);',
      ' vec2 e = abs(q) - hs + uRad; float d = (length(max(e, 0.)) + min(max(e.x, e.y), 0.) - uRad) / uDpr;',
      ' if (d < -18. || d > 75.){ gl_FragColor = vec4(0.); return; }',
      ' float s = atan(q.y / hs.y, q.x / hs.x) / 6.28318 + .5; float ds = abs(s - uIgn); ds = min(ds, 1. - ds);',
      ' float la = uAge - ds * 1.7; if (la < 0.){ gl_FragColor = vec4(0.); return; }',
      ' float I = smoothstep(0., .2, la) * (1. - smoothstep(.8, 1.9, la));',
      ' float E = smoothstep(0., .3, la) * (1. - smoothstep(1.5, 3., la));',
      ' vec2 g = (e.x > 0. && e.y > 0.) ? normalize(e * sign(q)) : (e.x > e.y ? vec2(sign(q.x), 0.) : vec2(0., sign(q.y)));',
      ' float L = mix(12., 62., smoothstep(-.8, 1., g.y));',
      ' vec2 P = p / uDpr / 30., fl = vec2(0., -uT * 2.1);',
      ' vec2 wv = vec2(fbm(P * 1.1 + fl * .5), fbm(P * 1.1 + vec2(3.7, 8.1) + fl * .5));',
      ' float n = fbm(P * 1.9 + wv * 1.6 + fl);',
      ' float tb = 1. - abs(fbm(P * 3.2 + wv + fl * 1.3) * 2. - 1.);',
      ' float hy = (d + 4.) / L, f = ((1. - hy) * 1.45 - n * 1.02 + (tb - .55) * .5 * smoothstep(.0, .6, hy)) * I * smoothstep(-9., -3., d);',
      ' f = clamp(f, 0., 1.35); float a = fa(f); vec3 col = ramp(f) * a;',
      ' float eg = exp(-abs(d + 1.5) / 2.2) * E * (.35 + .9 * fbm(P * 4. + vec2(uT * .4, 0.)));',
      ' col += vec3(1., .42, .08) * eg * (1. - a); a = max(a, min(1., eg));',
      ' float sc = smoothstep(-9., -1., d) * (1. - smoothstep(-1., 1., d)) * smoothstep(0., .5, la) * (1. - smoothstep(1.8, 3.2, la)) * smoothstep(.45, .75, fbm(P * 3.)) * .38;',
      ' col += vec3(.22, .09, .03) * sc * (1. - a); a += sc * (1. - a);',
      ' gl_FragColor = vec4(col, a);',
      '}'].join('\n');
    function init(){
      if (ok !== null) return ok; ok = false;
      try {
        cv = document.createElement('canvas'); cv.className = 'fire-burn'; cv.setAttribute('aria-hidden', 'true');
        gl = cv.getContext('webgl', {alpha:true, premultipliedAlpha:true, antialias:false}); if (!gl) return false;
        var pr = glprog(gl, VS, FS); gl.useProgram(pr);
        var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 0,1, 1,1]), gl.STATIC_DRAW);
        var l = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
        U = {}; ['uB','uRect','uRad','uT','uAge','uIgn','uDpr'].forEach(function(k){ U[k] = gl.getUniformLocation(pr, k); });
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0); document.body.appendChild(cv); ok = true;
      } catch(e){ ok = false; }
      return ok;
    }
    function on(){ return !reduce && document.documentElement.classList.contains('th-faisca'); }
    /* recorte realmente visivel: viewport x ancestrais que cortam (carrosseis, listas) */
    function visR(el){
      var r = el.getBoundingClientRect(), L = 0, T = 0, R = innerWidth, B = innerHeight, p = el.parentElement;
      while (p && p !== document.documentElement){
        var cs = getComputedStyle(p), ox = cs.overflowX, oy = cs.overflowY;
        if ((ox !== 'visible' || oy !== 'visible') && p.getBoundingClientRect){
          var pr = p.getBoundingClientRect();
          if (ox !== 'visible'){ if (pr.left > L) L = pr.left; if (pr.right < R) R = pr.right; }
          if (oy !== 'visible'){ if (pr.top > T) T = pr.top; if (pr.bottom < B) B = pr.bottom; }
        }
        p = p.parentElement;
      }
      var l = r.left > L ? r.left : L, t = r.top > T ? r.top : T, rt = r.right < R ? r.right : R, bt = r.bottom < B ? r.bottom : B;
      return {l:l, t:t, r:rt, b:bt, w:rt - l, h:bt - t, R:r};
    }
    function inView(el, min){
      if (!el || !el.isConnected || !el.getBoundingClientRect) return null;
      var v = visR(el); min = min || 96;
      if (v.w < min || v.h < min) return null;
      return v;
    }
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
      var now = performance.now();
      es.forEach(function(e){
        if (e.isIntersecting && e.intersectionRatio > .45) vis.add(e.target); else vis.delete(e.target);
        if (!on() || !e.isIntersecting || now - lastAuto < 1700 || list.length >= 2 || now - (seen.get(e.target) || -1e9) < 25000 || Math.random() > .6) return;
        lastAuto = now; var el = e.target;
        setTimeout(function(){ if (!el.isConnected || list.length >= 2) return; var v = inView(el, 120); if (!v) return; var left = Math.random() < .5; ignite(el, left ? v.l + 6 : v.r - 6, v.b - 6); }, 90);
      });
    }, {threshold:[.45, .7]}) : null;
    function watch(root){ if (!io || !root) return; root.querySelectorAll(SELC).forEach(function(el){ if (!el.__bw){ el.__bw = 1; io.observe(el); } }); }
    function ignite(el, x, y){
      if (!on() || !init()) return false;
      var v = inView(el, 96); if (!v) return false;
      for (var i = 0; i < list.length; i++) if (list[i].el === el) return false;
      if (list.length >= 2) list.shift();
      var r = v.R, hw = r.width / 2, hh = r.height / 2;
      x = Math.max(v.l + 8, Math.min(v.r - 8, x)); y = Math.max(v.t + 8, Math.min(v.b - 8, y));
      var qx = x - (r.left + hw), qy = -(y - (r.top + hh));
      var now = performance.now(); seen.set(el, now);
      list.push({el:el, t0:now, ign:Math.atan2(qy / hh, qx / hw) / (Math.PI * 2) + .5, rad:parseFloat(getComputedStyle(el).borderTopLeftRadius) || 14, spread:false});
      if (!raf) raf = requestAnimationFrame(frame); return true;
    }
    function center(r){ return {x:r.left + r.width / 2, y:r.top + r.height / 2}; }
    function frame(now){
      raf = 0; if (!on()){ list = []; }
      if (!list.length){ if (cv) cv.style.display = 'none'; return; }
      var d = Math.min(innerWidth < 900 ? 1 : 1.25, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
      if (cv.width !== Math.round(W * d) || cv.height !== Math.round(H * d)){ cv.width = Math.round(W * d); cv.height = Math.round(H * d); }
      cv.style.display = 'block'; gl.viewport(0, 0, cv.width, cv.height); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uT, (now - t0) / 1000); gl.uniform1f(U.uDpr, d);
      for (var i = list.length - 1; i >= 0; i--){
        var b = list[i], age = (now - b.t0) / 1000;
        if (age > 3.6 || !b.el.isConnected){ list.splice(i, 1); continue; }
        var vv = inView(b.el, 70); if (!vv){ list.splice(i, 1); continue; }
        var r = vv.R;
        /* o fogo pula pro card vizinho mais perto */
        if (!b.spread && age > .9){ b.spread = true; if (list.length < 2 && Math.random() < .5){ var c0 = center(r), best = null, bd = Math.max(r.width, r.height) * 1.5;
          vis.forEach(function(el){ if (el === b.el || now - (seen.get(el) || -1e9) < 12000) return; var v2 = inView(el, 90); if (!v2) return; var rr = v2.R, c = center(rr), dd = Math.hypot(c.x - c0.x, c.y - c0.y); if (dd < bd){ bd = dd; best = [el, rr]; } });
          if (best){ var rx = best[1]; ignite(best[0], Math.max(rx.left, Math.min(rx.right, c0.x)), Math.max(rx.top, Math.min(rx.bottom, c0.y))); } } }
        var x0 = r.left - 70, x1 = r.right + 70, y0 = r.top - 80, y1 = r.bottom + 30;
        gl.uniform4f(U.uB, x0 / W * 2 - 1, 1 - y1 / H * 2, x1 / W * 2 - 1, 1 - y0 / H * 2);
        gl.uniform4f(U.uRect, r.left * d, (H - r.bottom) * d, r.width * d, r.height * d);
        gl.uniform1f(U.uRad, b.rad * d); gl.uniform1f(U.uAge, age); gl.uniform1f(U.uIgn, b.ign);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(frame);
    }
    /* card vis\xedvel mais perto do companheiro (pra mirar a rajada ou ir xeretar) */
    function near(pal, maxD, fresh){
      var m = {x:pal.x + pal.size / 2, y:pal.gy + pal.size * .45}, best = null, bd = maxD || 1e9, now = performance.now();
      vis.forEach(function(el){ if (fresh && now - (seen.get(el) || -1e9) < 8000) return; var v = inView(el, 90); if (!v) return; var r = v.R;
        var px = Math.max(v.l, Math.min(v.r, m.x)), py = Math.max(v.t, Math.min(v.b, m.y)), dd = Math.hypot(px - m.x, py - m.y) + (py > m.y ? 400 : 0);
        if (dd < bd){ bd = dd; best = {el:el, x:px, y:py, r:r}; } });
      return best;
    }
    function clear(){ list = []; if (cv) cv.style.display = 'none'; }
    return {watch:watch, ignite:ignite, near:near, clear:clear};
  })();

  /* ---------- Arte nas emendas: trepadeira que cresce (Brotto) e agua viva (Bolha) ---------- */
  var SEAM = (function(){
    var wrap = null, items = [], raf = 0, theme = null, lw = 0;
    var LF = 'M1 8C7 1 19 .5 25 7.5 19 15.5 7 15 1 8Z';
    var CSS = [
      '.sx-wrap{position:fixed;left:0;right:0;top:0;pointer-events:none;z-index:6;contain:layout style;}',
      '.sx{position:absolute;left:0;right:0;top:0;height:var(--h,120px);pointer-events:none;display:none;overflow:visible;}',
      '.sx-in{position:absolute;inset:0;opacity:0;transition:opacity .3s ease;}',
      '.sx.grow .sx-in{opacity:1;}',
      '.sx-in.flip{transform:scaleX(-1);}',
      '.sx-in.mirror{transform:scaleX(-1);}',
      '.sx-g,.sx-h{position:absolute;inset:0;}',
      '.sx-glow{position:absolute;left:-3%;right:-3%;top:-25%;bottom:-25%;background:radial-gradient(58% 62% at 50% 50%,rgba(88,170,96,.22),rgba(88,170,96,0) 72%);}',
      '.sx-br{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}',
      '.vn{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1000;stroke-dashoffset:1000;transition:stroke-dashoffset 1.5s cubic-bezier(.35,.9,.3,1);}',
      '.vn.main{stroke:#2f7d3a;stroke-width:3.6;}',
      '.vn.thin{stroke:#5fae5f;stroke-width:1.7;opacity:.8;transition-delay:.18s;}',
      '.sx-sprig{opacity:.94;}',
      '.sx-sprig .sx-lf{width:16px;height:11px;margin:-5px 0 0 -8px;}',
      '.sx-sprig .sx-fl{width:18px;height:18px;margin:-9px 0 0 -9px;}',
      '.sx.grow .vn{stroke-dashoffset:0;}',
      '.sx-lf,.sx-fl{position:absolute;display:block;opacity:0;}',
      '.sx-lf{width:30px;height:18px;margin:-9px 0 0 -15px;transform-origin:0 50%;transform:rotate(var(--r,0deg)) scale(.25);transition:opacity .4s ease var(--d,0s),transform .6s cubic-bezier(.2,.9,.3,1.5) var(--d,0s);}',
      '.sx.grow .sx-lf{opacity:1;transform:rotate(var(--r,0deg)) scale(1);}',
      '.sx-lf svg,.sx-fl svg{width:100%;height:100%;display:block;overflow:visible;}',
      '.sx-fl{width:26px;height:26px;margin:-13px 0 0 -13px;transform:scale(.2);transition:opacity .5s ease var(--d,0s),transform .65s cubic-bezier(.2,.9,.3,1.6) var(--d,0s);}',
      '.sx.grow .sx-fl{opacity:1;transform:scale(1);}',
      '.sx-wt{position:absolute;left:0;right:0;top:4%;width:100%;height:92%;display:block;overflow:visible;}',
      '.wvg{animation:sxdrift 12s linear infinite;}',
      '@keyframes sxdrift{from{transform:translateX(0);}to{transform:translateX(-600px);}}',
      '.hl{fill:none;stroke:rgba(228,248,255,.9);stroke-width:1.6;vector-effect:non-scaling-stroke;}',
      '@media (prefers-reduced-motion:reduce){.wvg{animation:none!important;}',
      '.vn{transition:none!important;stroke-dashoffset:0!important;}',
      '.sx.grow .sx-lf{transform:rotate(var(--r,0deg)) scale(1);} }'
    ].join('');
    function style(){ var e = document.createElement('style'); e.id = 'parceiros-seam'; e.textContent = CSS; document.head.appendChild(e); }
    function leafSVG(){ return '<svg viewBox="0 0 26 16" aria-hidden="true"><path d="' + LF + '" fill="#4fae45"/><path d="M3 8C9 3.4 18 3 23 7.4 17 12.4 9 12.2 3 8Z" fill="#93e26c" opacity=".9"/><path d="M3.4 8h18.6" stroke="#2c7a37" stroke-width="1" opacity=".5"/></svg>'; }
    function flowerSVG(){ return '<svg viewBox="0 0 22 22" aria-hidden="true"><g fill="#ffb6d4" stroke="#f488b6" stroke-width=".7"><ellipse cx="11" cy="5.2" rx="3.5" ry="4.6"/><ellipse cx="11" cy="16.8" rx="3.5" ry="4.6"/><ellipse cx="5.2" cy="11" rx="4.6" ry="3.5"/><ellipse cx="16.8" cy="11" rx="4.6" ry="3.5"/></g><circle cx="11" cy="11" r="2.7" fill="#ffd75e"/></svg>'; }
    var LV = [[5,70,-34,0],[13,44,-24,.07],[22,74,-38,.13],[32,62,-26,.19],[43,50,-20,.25],[52,32,-30,.31],[63,60,-22,.37],[74,52,-28,.43]];
    var FL = [[27,86,0,.5],[58,26,0,.58],[86,74,0,.66]];
    function vinhHTML(){
      var a = '<i class="sx-glow"></i><svg class="sx-br" viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true">'
        + '<path class="vn main" pathLength="1000" d="M-20 96C160 44 300 118 480 74 660 30 800 112 980 68 1080 44 1160 74 1220 60"/>'
        + '<path class="vn thin" pathLength="1000" d="M-20 112C140 148 320 122 470 130 640 138 800 116 960 124 1080 130 1160 116 1220 122"/></svg>';
      var b = '', i;
      for (i = 0; i < LV.length; i++) b += '<i class="sx-lf" style="left:' + LV[i][0] + '%;top:' + LV[i][1] + '%;--r:' + LV[i][2] + 'deg;--d:' + LV[i][3] + 's">' + leafSVG() + '</i>';
      var c = '';
      for (i = 0; i < FL.length; i++) c += '<i class="sx-fl" style="left:' + FL[i][0] + '%;top:' + FL[i][1] + '%;--d:' + FL[i][3] + 's">' + flowerSVG() + '</i>';
      return '<div class="sx-g">' + a + b + '</div><div class="sx-h">' + c + '</div>';
    }
    function wavePath(y0, amp, segs, w, bottom){
      var d = 'M0 ' + y0, x = 0, up = 1, seg = w / segs, x2, cy, i;
      for (i = 0; i < segs; i++){ x2 = x + seg; cy = y0 - up * amp; d += ' Q' + (x + seg / 2).toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y0; x = x2; up = -up; }
      return bottom ? d + ' L' + w + ' ' + bottom + ' L0 ' + bottom + 'Z' : d;
    }
    function waveLayer(y0, amp, segs, dx, fill, cls){
      var tw = wavePath(y0, amp, segs, 600, 128);
      return '<g transform="translate(' + dx + ' 0)"><path d="' + tw + '" fill="' + fill + '"/>'
        + (cls ? '<path class="' + cls + '" d="' + wavePath(y0, amp, segs, 600, 0) + '"/>' : '') + '</g>';
    }
    function aguaHTML(u){
      var g = 'sxw' + u;
      var tile = waveLayer(44, 17, 6, 0, 'url(#' + g + 'a)', 'hl')
        + waveLayer(58, 12, 5, -70, 'url(#' + g + 'b)')
        + waveLayer(74, 9, 4, -180, 'url(#' + g + 'c)')
        + '<circle cx="150" cy="32" r="2.2" fill="#fff" opacity=".4"/><circle cx="392" cy="26" r="1.7" fill="#fff" opacity=".3"/><circle cx="268" cy="38" r="1.3" fill="#fff" opacity=".26"/>';
      return '<svg class="sx-wt" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><defs>'
        + '<linearGradient id="' + g + 'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdeeff" stop-opacity=".5"/><stop offset=".5" stop-color="#62bcff" stop-opacity=".26"/><stop offset="1" stop-color="#2b6ff0" stop-opacity="0"/></linearGradient>'
        + '<linearGradient id="' + g + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#96dbff" stop-opacity=".4"/><stop offset=".6" stop-color="#2b7fff" stop-opacity=".2"/><stop offset="1" stop-color="#123a9c" stop-opacity="0"/></linearGradient>'
        + '<linearGradient id="' + g + 'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#59a4ff" stop-opacity=".34"/><stop offset=".6" stop-color="#2059d6" stop-opacity=".18"/><stop offset="1" stop-color="#0b2566" stop-opacity="0"/></linearGradient>'
        + '</defs><g class="wvg"><g>' + tile + '</g><g transform="translate(600 0)">' + tile + '</g><g transform="translate(1200 0)">' + tile + '</g></g></svg>';
    }
    function sprigHTML(){
      var s = '<i class="sx-glow"></i><svg class="sx-br" viewBox="0 0 120 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
        + '<path class="vn main" pathLength="1000" d="M70 138C62 108 80 84 70 58 62 34 78 20 66 4"/>'
        + '<path class="vn thin" pathLength="1000" d="M68 104C88 96 100 98 112 84"/></svg>';
      var P = [[40,88,-34,0],[58,116,30,.07],[30,60,-26,.15],[52,14,-16,.26]], i;
      for (i = 0; i < P.length; i++) s += '<i class="sx-lf" style="left:' + P[i][0] + '%;top:' + P[i][1] + '%;--r:' + P[i][2] + 'deg;--d:' + P[i][3] + 's">' + leafSVG() + '</i>';
      s += '<i class="sx-fl" style="left:66%;top:6%;--d:.38s">' + flowerSVG() + '</i>';
      return s;
    }
    function scroller(el){ for (var p = el.parentElement; p && p !== document.body; p = p.parentElement){ var ox = getComputedStyle(p).overflowX; if (ox === 'auto' || ox === 'scroll') return true; } return false; }
    /* ramos/flores tambem nos vaos entre os cards (so quando o vao esta de fato visivel) */
    function sprigs(root){
      var cs = [].slice.call(root.querySelectorAll(CARDS)), groups = [], i, j, n = 0, MAX = innerWidth < 700 ? 2 : 3;
      for (i = 0; i < cs.length && i < 80 && n < MAX; i++){
        var c = cs[i]; if (!c.offsetHeight || c.offsetHeight < 120 || scroller(c)) continue;
        var p = c.parentElement, g = null;
        for (j = 0; j < groups.length; j++) if (groups[j].p === p){ g = groups[j]; break; }
        if (!g){ g = {p:p, c:[]}; groups.push(g); }
        g.c.push(c);
      }
      for (i = 0; i < groups.length && n < MAX; i++){
        var row = groups[i].c, ys = {}, rr;
        for (j = 0; j < row.length; j++){ rr = row[j].getBoundingClientRect(); var ky = Math.round((rr.top + scrollY) / 10); (ys[ky] = ys[ky] || []).push(rr); }
        for (var k in ys){
          var line = ys[k].sort(function(a, b){ return a.left - b.left; });
          for (j = 0; j + 1 < line.length && n < MAX; j++){
            var ra = line[j], rb = line[j + 1], gap = rb.left - ra.right;
            if (gap < 26 || gap > 260) continue;
            if (ra.right < 8) continue;
            if (rb.left > innerWidth - 8) break;
            var w = Math.max(42, Math.min(72, gap + 16)), h = Math.min(74, ra.height * .58);
            var el = document.createElement('div'); el.className = 'sx sx-sprig';
            el.style.left = Math.round((ra.right + rb.left) / 2 - w / 2) + 'px';
            el.style.right = 'auto'; el.style.width = w + 'px'; el.style.setProperty('--h', h + 'px');
            el.innerHTML = '<div class="sx-in' + (n % 2 ? ' mirror' : '') + '">' + sprigHTML() + '</div>';
            wrap.appendChild(el);
            items.push({el:el, y: ra.top + scrollY + ra.height / 2, h:h, on:false, g:false});
            n++;
          }
        }
      }
    }
    function build(root, id){
      theme = id || null;
      if (!wrap){
        if (!theme) return;
        wrap = document.createElement('div'); wrap.className = 'sx-wrap'; wrap.setAttribute('aria-hidden', 'true');
        document.body.appendChild(wrap); style(); lw = innerWidth; kick();
      }
      if (raf){ cancelAnimationFrame(raf); raf = 0; }
      wrap.innerHTML = ''; items = []; var uid = 0;
      if (!theme || theme === 'faisca') return;
      var v = (root && root.querySelector ? root.querySelector('.view.on') : null) || document.querySelector('.view.on');
      if (!v) return;
      var kids = [].slice.call(v.children), ys = [], i, k, y;
      for (i = 0; i < kids.length; i++){ k = kids[i]; if (!k || !k.offsetHeight || k.offsetHeight < 110) continue; y = absTop(k); ys.push(y); ys.push(y + k.offsetHeight); }
      var out = [];
      for (i = 0; i < ys.length; i++){ y = Math.round(ys[i]); if (y < 130) continue; if (!out.length || Math.abs(y - out[out.length - 1]) > 14) out.push(y); }
      var mx = innerWidth < 700 ? 7 : 9;
      if (out.length > mx){ var st = out.length / mx, so = []; for (i = 0; i < mx; i++) so.push(out[Math.floor(i * st)]); out = so; }
      var hh = theme === 'brotto' ? 126 : 96;
      for (i = 0; i < out.length; i++){
        var el = document.createElement('div'); el.className = 'sx'; el.style.setProperty('--h', hh + 'px');
        var inner = document.createElement('div'); inner.className = 'sx-in' + (i % 2 ? ' flip' : '');
        inner.innerHTML = theme === 'brotto' ? vinhHTML() : aguaHTML(uid++);
        el.appendChild(inner); wrap.appendChild(el);
        items.push({el:el, y:out[i], h:hh, on:false, g:false});
      }
      if (theme === 'brotto') sprigs(v);
      kick();
    }
    function upd(){
      raf = 0; var sy = scrollY, vh = innerHeight;
      for (var i = 0; i < items.length; i++){
        var it = items[i], y = it.y - sy, near = y > -180 && y < vh + 180;
        if (near !== it.on){ it.on = near; it.el.style.display = near ? 'block' : 'none'; }
        if (!near) continue;
        it.el.style.transform = 'translate3d(0,' + (y - it.h / 2).toFixed(1) + 'px,0)';
        if (!it.g){ it.g = true; it.el.classList.add('grow'); }
      }
    }
    function kick(){ if (!raf && !document.hidden) raf = requestAnimationFrame(upd); }
    addEventListener('scroll', kick, {passive:true});
    addEventListener('resize', function(){ if (innerWidth === lw) return; lw = innerWidth; if (theme) build(ROOT(), theme); }, {passive:true});
    return {build:build, clear:function(){ theme = null; items = []; if (raf){ cancelAnimationFrame(raf); raf = 0; } if (wrap) wrap.innerHTML = ''; }};
  })();

  function palSVG2(id, uid){ var u = id + uid; return palSVG0(id, uid).replace('<defs>', '<defs><radialGradient id="sd' + u + '" cx=".32" cy=".24" r=".95"><stop offset=".5" stop-color="#1a0630" stop-opacity="0"/><stop offset="1" stop-color="#1a0630" stop-opacity=".5"/></radialGradient><radialGradient id="sp' + u + '"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="rm' + u + '" x1="1" y1="1" x2=".2" y2=".2"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/></linearGradient>'); }
  function palSVG(id, uid){ var s = palSVG2(id, uid); if (!FOX3D.has(id) || !window.WebGLRenderingContext) return s; return '<div class="cr fox fox3d" data-m="' + id + '" aria-hidden="true"><canvas class="fx3c"></canvas><div class="m3-fb">' + s + '</div></div>'; }
  function palSVG0(id, uid){
    var u = id + uid;
    if (id === 'faisca') return '<svg class="cr cr-f" viewBox="0 0 120 120" aria-hidden="true"><defs>' +
      '<radialGradient id="fB' + u + '" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ffd59a"/><stop offset=".45" stop-color="#ff8a3d"/><stop offset="1" stop-color="#c9361a"/></radialGradient>' +
      '<radialGradient id="fW' + u + '" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#ffd9a8"/></radialGradient>' +
      '<linearGradient id="fT' + u + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#e2501f"/><stop offset=".7" stop-color="#ff9a3d"/><stop offset="1" stop-color="#ffe27a"/></linearGradient>' +
      '<radialGradient id="fG' + u + '"><stop offset="0" stop-color="#fff7b0"/><stop offset=".5" stop-color="#ffb534" stop-opacity=".8"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>' +
      '<pattern id="fP' + u + '" width="9" height="8" patternUnits="userSpaceOnUse"><path d="M1 6 q1 -2.5 2.4 -3.6 M5.5 7.5 q.8 -2.2 2.2 -3 M3.5 2.5 q.6 -1.6 1.8 -2.2" stroke="#9a2a0a" stroke-width=".55" fill="none" stroke-linecap="round" opacity=".22"/></pattern></defs>' +
      '<ellipse class="sh" cx="60" cy="113" rx="25" ry="4.5"/>' +
      '<g class="tail"><path d="M76 98 C98 100 110 84 103 66 C99 57 106 50 111 52 C107 42 92 44 89 56 C85 72 92 84 74 90 Z" fill="url(#fT' + u + ')"/><circle class="flk" cx="107" cy="50" r="10" fill="url(#fG' + u + ')"/></g>' +
      '<g class="feet"><ellipse class="ft a" cx="49" cy="108" rx="8.5" ry="5" fill="#b8321a"/><ellipse class="ft b" cx="71" cy="108" rx="8.5" ry="5" fill="#b8321a"/></g>' +
      '<g class="core"><ellipse cx="60" cy="92" rx="22" ry="18" fill="url(#fB' + u + ')"/><ellipse cx="60" cy="92" rx="21.5" ry="17.5" fill="url(#sd' + u + ')"/><ellipse cx="60" cy="92" rx="21.5" ry="17.5" fill="none" stroke="url(#rm' + u + ')" stroke-width="2.6"/><ellipse cx="60" cy="96" rx="13" ry="11" fill="url(#fW' + u + ')"/>' +
        '<g class="earL"><path d="M37 46 L28 13 Q45 21 53 37 Z" fill="url(#fB' + u + ')"/><path d="M38 40 L32 20 Q43 26 47 36Z" fill="#ffcf4a"/></g>' +
        '<g class="earR"><path d="M83 46 L92 13 Q75 21 67 37 Z" fill="url(#fB' + u + ')"/><path d="M82 40 L88 20 Q77 26 73 36Z" fill="#ffcf4a"/></g>' +
        '<circle cx="60" cy="58" r="28" fill="url(#fB' + u + ')"/><circle cx="60" cy="58" r="28" fill="url(#fP' + u + ')"/><circle cx="60" cy="58" r="27.5" fill="url(#sd' + u + ')"/><circle cx="60" cy="58" r="27.5" fill="none" stroke="url(#rm' + u + ')" stroke-width="2.6"/><ellipse cx="47" cy="41" rx="7.5" ry="4.2" fill="url(#sp' + u + ')" transform="rotate(-32 47 41)"/>' +
        '<path class="tuft" d="M60 32 C53 24 57 15 62 9 C62 18 71 20 66 32 Z" fill="#ffd34a"/>' +
        '<path d="M38 44 A28 28 0 0 1 64 30" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="60" cy="69" rx="14" ry="10" fill="url(#fW' + u + ')"/>' +
        '<ellipse class="chk" cx="39" cy="66" rx="6" ry="3.6" fill="url(#fG' + u + ')"/><ellipse class="chk" cx="81" cy="66" rx="6" ry="3.6" fill="url(#fG' + u + ')"/>' +
        '<g class="eyes"><ellipse cx="49" cy="56" rx="5.6" ry="7.2" fill="#2a1206"/><ellipse cx="71" cy="56" rx="5.6" ry="7.2" fill="#2a1206"/><circle cx="47.3" cy="53.2" r="2.2" fill="#fff"/><circle cx="69.3" cy="53.2" r="2.2" fill="#fff"/><circle cx="51" cy="58.6" r="1" fill="#fff"/><circle cx="73" cy="58.6" r="1" fill="#fff"/></g>' +
        '<path d="M58 64 L62 64 L60 66.6Z" fill="#6b2a10"/><path class="mo" d="M55.5 69 Q60 73.5 64.5 69" stroke="#6b2a10" stroke-width="1.7" fill="none" stroke-linecap="round"/></g></svg>';
    if (id === 'brotto') return '<svg class="cr cr-b" viewBox="0 0 120 120" aria-hidden="true"><defs>' +
      '<radialGradient id="bB' + u + '" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#d6f9a8"/><stop offset=".5" stop-color="#6cc94f"/><stop offset="1" stop-color="#2a7d38"/></radialGradient>' +
      '<radialGradient id="bW' + u + '" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fbffe9"/><stop offset="1" stop-color="#d3f1a0"/></radialGradient>' +
      '<linearGradient id="bL' + u + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b6f07a"/><stop offset="1" stop-color="#2f8a3b"/></linearGradient>' +
      '<pattern id="bP' + u + '" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#1d5e27" opacity=".28"/><circle cx="5.5" cy="5" r=".5" fill="#fff" opacity=".25"/></pattern></defs>' +
      '<ellipse class="sh" cx="60" cy="113" rx="26" ry="4.5"/>' +
      '<g class="feet"><ellipse class="ft a" cx="47" cy="108" rx="9" ry="5" fill="#24692f"/><ellipse class="ft b" cx="73" cy="108" rx="9" ry="5" fill="#24692f"/></g>' +
      '<g class="core">' +
        '<g class="earL"><path d="M35 58 C14 52 7 35 13 26 C26 29 37 42 39 55Z" fill="url(#bL' + u + ')"/><path d="M36 55 C26 47 19 38 15 29" stroke="#1d5e27" stroke-width="1" fill="none" opacity=".6"/></g>' +
        '<g class="earR"><path d="M85 58 C106 52 113 35 107 26 C94 29 83 42 81 55Z" fill="url(#bL' + u + ')"/><path d="M84 55 C94 47 101 38 105 29" stroke="#1d5e27" stroke-width="1" fill="none" opacity=".6"/></g>' +
        '<path d="M60 30 C88 30 95 58 93 80 C91 102 77 110 60 110 C43 110 29 102 27 80 C25 58 32 30 60 30Z" fill="url(#bB' + u + ')"/><path d="M60 30 C88 30 95 58 93 80 C91 102 77 110 60 110 C43 110 29 102 27 80 C25 58 32 30 60 30Z" fill="url(#bP' + u + ')"/><path d="M60 30 C88 30 95 58 93 80 C91 102 77 110 60 110 C43 110 29 102 27 80 C25 58 32 30 60 30Z" fill="url(#sd' + u + ')"/><path d="M60 30 C88 30 95 58 93 80 C91 102 77 110 60 110 C43 110 29 102 27 80 C25 58 32 30 60 30Z" fill="none" stroke="url(#rm' + u + ')" stroke-width="2.6"/><ellipse cx="44" cy="44" rx="8" ry="4.5" fill="url(#sp' + u + ')" transform="rotate(-38 44 44)"/>' +
        '<path d="M36 50 C40 38 48 33 58 32" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="60" cy="91" rx="18" ry="15" fill="url(#bW' + u + ')"/>' +
        '<g class="tuft"><path d="M60 32 C60 24 58 18 60 11" stroke="#2f8a3b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 15 C52 5 41 8 43 15 C49 19 55 17 60 15Z" fill="url(#bL' + u + ')"/><path d="M60 13 C67 3 79 6 77 13 C71 17 65 15 60 13Z" fill="url(#bL' + u + ')"/></g>' +
        '<g class="eyes"><ellipse cx="49" cy="63" rx="5.4" ry="7" fill="#123a1a"/><ellipse cx="71" cy="63" rx="5.4" ry="7" fill="#123a1a"/><circle cx="47.3" cy="60.3" r="2.1" fill="#fff"/><circle cx="69.3" cy="60.3" r="2.1" fill="#fff"/><circle cx="51" cy="65.6" r="1" fill="#fff"/><circle cx="73" cy="65.6" r="1" fill="#fff"/></g>' +
        '<g fill="#2a7d38" opacity=".55"><circle cx="38" cy="72" r="1.1"/><circle cx="41" cy="75" r="1.1"/><circle cx="36" cy="76" r="1.1"/><circle cx="82" cy="72" r="1.1"/><circle cx="79" cy="75" r="1.1"/><circle cx="84" cy="76" r="1.1"/></g>' +
        '<path class="mo" d="M55 74 Q60 79 65 74" stroke="#123a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/></g></svg>';
    return '<svg class="cr cr-w" viewBox="0 0 120 120" aria-hidden="true"><defs>' +
      '<radialGradient id="wB' + u + '" cx=".38" cy=".35" r=".85"><stop offset="0" stop-color="#dcf6ff"/><stop offset=".45" stop-color="#5cc0ff"/><stop offset="1" stop-color="#1a5bd0"/></radialGradient>' +
      '<radialGradient id="wW' + u + '" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#bfe9ff"/></radialGradient>' +
      '<pattern id="wP' + u + '" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 5 Q2.2 3 4.5 5 T9 5" stroke="#fff" stroke-width=".6" fill="none" opacity=".22"/></pattern></defs>' +
      '<ellipse class="sh" cx="60" cy="113" rx="25" ry="4.5"/>' +
      '<g class="feet"><path class="ft a" d="M36 104 C26 108 24 113 32 113 C38 113 42 109 44 106Z" fill="#1a5bd0"/><path class="ft b" d="M84 104 C94 108 96 113 88 113 C82 113 78 109 76 106Z" fill="#1a5bd0"/></g>' +
      '<g class="core">' +
        '<path d="M60 18 C66 34 93 50 93 79 C93 99 79 111 60 111 C41 111 27 99 27 79 C27 50 54 34 60 18Z" fill="url(#wB' + u + ')"/><path d="M60 18 C66 34 93 50 93 79 C93 99 79 111 60 111 C41 111 27 99 27 79 C27 50 54 34 60 18Z" fill="url(#wP' + u + ')"/><path d="M60 18 C66 34 93 50 93 79 C93 99 79 111 60 111 C41 111 27 99 27 79 C27 50 54 34 60 18Z" fill="url(#sd' + u + ')"/><path d="M60 18 C66 34 93 50 93 79 C93 99 79 111 60 111 C41 111 27 99 27 79 C27 50 54 34 60 18Z" fill="none" stroke="url(#rm' + u + ')" stroke-width="2.6"/>' +
        '<path d="M45 50 C40 58 37 67 39 75 C44 66 48 59 53 54Z" fill="#fff" opacity=".6"/><circle cx="56" cy="34" r="2.2" fill="#fff" opacity=".7"/>' +
        '<ellipse cx="60" cy="92" rx="17" ry="14" fill="url(#wW' + u + ')"/>' +
        '<g class="earL"><path d="M30 84 C17 86 13 97 19 101 C27 99 32 93 35 88Z" fill="#2b7fff"/></g><g class="earR"><path d="M90 84 C103 86 107 97 101 101 C93 99 88 93 85 88Z" fill="#2b7fff"/></g>' +
        '<g class="eyes"><ellipse cx="49" cy="72" rx="5.4" ry="6.8" fill="#0b2559"/><ellipse cx="71" cy="72" rx="5.4" ry="6.8" fill="#0b2559"/><circle cx="47.4" cy="69.4" r="2.1" fill="#fff"/><circle cx="69.4" cy="69.4" r="2.1" fill="#fff"/><circle cx="51" cy="74.4" r="1" fill="#fff"/><circle cx="73" cy="74.4" r="1" fill="#fff"/></g>' +
        '<ellipse cx="40" cy="80" rx="5" ry="3" fill="#ff9ec4" opacity=".7"/><ellipse cx="80" cy="80" rx="5" ry="3" fill="#ff9ec4" opacity=".7"/>' +
        '<path class="mo" d="M54 80 Q57 83 60 80 Q63 83 66 80" stroke="#0b2559" stroke-width="1.7" fill="none" stroke-linecap="round"/>' +
        '<g class="tuft"><circle cx="86" cy="26" r="7" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="1.4"/><circle cx="83.5" cy="23.5" r="1.8" fill="#fff"/></g></g></svg>';
  }
  function getPal(){ try { var v = JSON.parse(localStorage.getItem('gsPal') || 'null'); return v && PALS[v.id] ? v : null; } catch(e){ return null; } }
  function setPal(v){ try { document.dispatchEvent(new CustomEvent('parceiro:change', {detail:v && PALS[v.id] ? info(v.id) : null})); } catch(e){} try { if (v) localStorage.setItem('gsPal', JSON.stringify(v)); else localStorage.removeItem('gsPal'); } catch(e){} }
  function partnerHTML(){
    var cur = getPal();
    return '<section class="pcs' + (cur ? ' has' : '') + '" id="pcs"><div class="pcs-sky" aria-hidden="true"><i class="l1"></i><i class="l2"></i><i class="l3"></i><span class="spk"></span></div>' +
      '<div class="pcs-in"><div class="pcs-h"><span class="pcs-k">Novo \xb7 seu parceiro de compras</span><h2>Escolha seu parceiro</h2><p>Cada um traz um cupom diferente e te acompanha pelo site.</p></div>' +
      '<div class="pcs-cards">' + Object.keys(PALS).map(function(id, i){ var p = PALS[id];
        return '<article class="pcard' + (cur && cur.id === id ? ' picked' : '') + '" style="--c:' + p.c + ';--c2:' + p.c2 + ';--i:' + i + '" data-pal="' + id + '"><div class="pc-top"><span class="pc-t">' + p.type + '</span><span class="pc-n">#00' + (i + 1) + '</span></div>' +
          '<span class="pc-sheen"></span><div class="pc-art"><span class="pc-ring"></span>' + palSVG(id, 'c' + i) + '<span class="pc-gone">Est\xe1 com voc\xea \u2713</span></div>' +
          '<h3>' + p.n + '</h3><p>' + p.bio + '</p><div class="pc-perk"><b>' + p.perk + '</b><small>cupom ' + p.code + '</small></div>' +
          '<button type="button" class="pc-go" data-palpick="' + id + '">Escolher ' + p.n + '</button></article>'; }).join('') + '</div>' +
      '<div class="pcs-done"' + (cur ? '' : ' hidden') + '><span id="pcsDone">' + (cur ? 'Cupom <b>' + PALS[cur.id].code + '</b> ativo \xb7 ' + PALS[cur.id].perk : '') + '</span><button type="button" class="lnk" data-palreset>Trocar de parceiro</button></div></div></section>';
  }
  /* companheiro */
  var PAL = null, PICK = 0; window.__pal = function(){ return PAL; };
  function Pal(id){
    var self = this, p = PALS[id];
    this.id = id; this.p = p;
    var el = document.createElement('div'); el.className = 'pal'; el.style.setProperty('--c', p.c);
    el.innerHTML = '<div class="pal-say" hidden></div><div class="pal-f"><div class="pal-s">' + palSVG(id, 'pal') + '</div></div>';
    document.body.appendChild(el); try { FOX3D.mount(el); } catch(e){} this.el = el; this.f = el.querySelector('.pal-f'); this.s = el.querySelector('.pal-s'); this.say_ = el.querySelector('.pal-say');
    this.size = innerWidth < 900 ? 84 : 104; el.style.width = el.style.height = this.size + 'px';
    this.x = 0; this.y = 0; this.vx = 0; this.face = -1; this.mode = 'idle'; this.lastAct = performance.now(); this.lastUser = performance.now(); this.walkUntil = 0; this.sleep = false;
    this.ground(); this.x = innerWidth - this.size - (innerWidth < 900 ? 14 : 36);
    el.addEventListener('click', function(){ self.poke(); });
    var lastY = scrollY;
    this.onScroll = function(){ var dy = scrollY - lastY; lastY = scrollY; if (self.mode === 'jump' || Math.abs(dy) < 1) return; self.wake(); self.scrolled(dy); };
    this.nextAct = performance.now() + 4000; this.sp = 2; this.tx = 0; this.wph = 0; this.lastFire = performance.now() - 4000; this.scAcc = 0; this.lastWave = 0;
    this.onPtr = function(e){ if (e.pointerType !== 'mouse' || self.mode !== 'idle' || self.sleep) return; var cx = self.x + self.size / 2, cy = self.gy + self.size * .4;
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < 340) FOX3D.look(self.el, e.clientX, e.clientY, 700, self.face); };
    this.onDown = function(e){ if (self.el.contains(e.target)) return; self.wake(); if (self.mode === 'idle') FOX3D.look(self.el, e.clientX, e.clientY, 1500, self.face); };
    el.addEventListener('pointerenter', function(e){ if (e.pointerType !== 'mouse') return; var n = performance.now(); if (n - self.lastWave > 6000 && self.mode === 'idle'){ self.lastWave = n; self.wake(); FOX3D.greet(self.el, 1500); } });
    addEventListener('pointermove', this.onPtr, {passive:true}); addEventListener('pointerdown', this.onDown, {passive:true});
    this.onResize = function(){ self.size = innerWidth < 900 ? 84 : 104; el.style.width = el.style.height = self.size + 'px'; self.ground(); self.x = Math.min(self.x, innerWidth - self.size - 8); };
    addEventListener('scroll', this.onScroll, {passive:true}); addEventListener('resize', this.onResize);
    this.loop = this.loop.bind(this); this.raf = requestAnimationFrame(this.loop);
  }
  Pal.prototype.ground = function(){ this.gy = innerHeight - this.size - (innerWidth < 900 ? 96 : 18); };
  Pal.prototype.place = function(x, y, sx, sy, rot){ this.el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; this.s.style.transform = 'rotate(' + (rot || 0) + 'deg) scale(' + (sx || 1) + ',' + (sy || 1) + ')'; this.f.style.transform = 'scaleX(' + this.face + ')'; };
  Pal.prototype.loop = function(now){
    if (this.dead){ this.raf = 0; return; }
    var dt = this.lt ? Math.min(50, now - this.lt) / 16.67 : 1; this.lt = now;
    if (this.sleep && this.mode === 'idle'){ this.raf = 0; this.el.classList.remove('walk'); return; }
    this.raf = requestAnimationFrame(this.loop);
    if (this.mode === 'jump' || this.mode === 'hop') return;
    var walking = false;
    if (this.mode === 'walk'){
      var dx = this.tx - this.x, st = this.sp * dt;
      if (Math.abs(dx) <= st){ this.x = this.tx; this.mode = 'idle'; this.lastAct = now; this.nextAct = Math.max(this.nextAct, now + 2500 + Math.random() * 3000); var cb = this.onArrive; this.onArrive = null; if (cb) cb(); }
      else { this.face = dx < 0 ? -1 : 1; this.x += this.face * st; walking = true; this.wph += dt * (.2 + this.sp * .045); }
    }
    this.el.classList.toggle('walk', walking);
    var bob = walking ? Math.abs(Math.sin(this.wph)) * 6 : 0, br = walking ? 0 : Math.sin(now / 420) * .025;
    this.place(this.x, this.gy - bob, 1 - br * .6, 1 + br, walking ? Math.sin(this.wph) * 4 : 0);
    if (this.mode === 'idle' && !this.sleep && now > this.nextAct) this.autonomy(now);
    if (this.mode === 'idle' && !this.sleep && now - this.lastUser > 40000){ this.sleep = true; this.el.classList.add('zz'); this.say_.hidden = true; }
  };
  /* anda at\xe9 x com passo vis\xedvel (nunca "desliza" parado) */
  Pal.prototype.walkTo = function(x, sp, cb){
    var max = innerWidth - this.size - 8; x = Math.max(8, Math.min(max, x));
    if (this.mode !== 'idle' && this.mode !== 'walk') return false;
    if (Math.abs(x - this.x) < 6){ if (cb) cb(); return false; }
    this.mode = 'walk'; this.tx = x; this.sp = sp || 2; this.onArrive = cb || null; return true;
  };
  /* rolagem: ele caminha junto, de forma cont\xednua; rolando bastante pra baixo, de vez em quando solta uma rajada num card */
  Pal.prototype.scrolled = function(dy){
    var now = performance.now();
    if (dy > 0) this.scAcc += dy;
    if (this.mode !== 'idle' && this.mode !== 'walk') return;
    var max = innerWidth - this.size - 8, walking = this.mode === 'walk', dir = walking ? (this.tx >= this.x ? 1 : -1) : this.face;
    var dist = Math.min(140, Math.abs(dy) * .6 + 22), base = walking ? this.tx : this.x, nx = base + dir * dist;
    if (nx > max){ nx = this.x >= max - 12 ? this.x - dist - 30 : max; } else if (nx < 8){ nx = this.x <= 20 ? this.x + dist + 30 : 8; }
    var sp = Math.max(1.7, Math.min(4.2, 1.5 + Math.abs(dy) * .045));
    this.walkTo(nx, walking ? Math.max(this.sp * .92, sp) : sp, null);
    if ((this.id === 'faisca' || this.id === 'bolha') && dy > 0 && this.scAcc > 1300 && now - this.lastFire > 8000 && JET.ok()){ this.scAcc = 0; var self = this; setTimeout(function(){ if (!self.dead) self.attack(); }, 120); }
  };
  /* rajada: para, vira pro card mais perto e cospe fogo nele (o card pega fogo) */
  Pal.prototype.attack = function(){
    if (this.dead || this.sleep) return; var self = this, now = performance.now();
    if (this.mode === 'walk'){ this.mode = 'idle'; this.onArrive = null; }
    if (this.mode !== 'idle') return;
    this.lastFire = now; var tg = BURN.near(this, 520, true);
    if (tg) this.face = tg.x < this.x + this.size / 2 ? -1 : 1;
    this.mode = 'act'; this.el.classList.remove('walk'); this.place(this.x, this.gy, 1.08, .92, 0);
    setTimeout(function(){ if (self.dead) return; self.place(self.x, self.gy, 1, 1, 0); self.fire(tg ? 950 : 650, tg ? {x:tg.x, y:tg.y, el:tg.el} : {short:true}); }, 200);
    setTimeout(function(){ if (self.dead) return; if (self.mode === 'act') self.mode = 'idle'; self.nextAct = performance.now() + 2500; }, tg ? 1350 : 1000);
  };
  /* vida pr\xf3pria: passeia, xereta cards, cumprimenta, pula, vira, de vez em quando uma baforada */
  Pal.prototype.autonomy = function(now){
    this.nextAct = now + 3500 + Math.random() * 5000; this.lastAct = now;
    var self = this, r = Math.random(), W = innerWidth, S = this.size;
    if (r < .32){ this.walkTo(S + Math.random() * (W - S * 3), 1.5 + Math.random() * .9); }
    else if (r < .5){ var c = BURN.near(this, 900, false); if (c){ var cx = c.r.left + c.r.width / 2; this.walkTo(cx - S / 2 + (Math.random() - .5) * c.r.width * .4, 2, function(){ FOX3D.look(self.el, cx, c.r.top + c.r.height * .4, 1800, self.face); if (Math.random() < .35) self.say(['Esse aqui \xe9 dos bons!', 'Hmm, cheiro de promo\xe7\xe3o.', 'Olha esse!'][Math.floor(Math.random() * 3)], 2600); }); } else this.hop(24); }
    else if (r < .64){ if (!FOX3D.greet(this.el, 1700)) this.hop(20); if (Math.random() < .4) this.say(['T\xf4 de olho!', 'Psiu! Tem cupom ativo.', 'Bora?'][Math.floor(Math.random() * 3)], 2400); }
    else if (r < .76){ this.hop(26); }
    else if (r < .84 && (this.id === 'faisca' || this.id === 'bolha') && JET.ok()){ this.fire(480, {short:true}); }
    else if (r < .84 && this.id === 'brotto'){ FX.palFx(this, false); }
    else { this.face *= -1; this.place(this.x, this.gy, 1, 1, 0); }
  };
  Pal.prototype.fire = function(ms, o){ if (this.dead) return; var e = this.el; e.classList.add('fire'); clearTimeout(this.fireT); this.fireT = setTimeout(function(){ e.classList.remove('fire'); }, ms); JET.hold(this, ms, o); };
  Pal.prototype.wake = function(){ if (this.sleep){ this.sleep = false; this.el.classList.remove('zz'); } this.lastAct = this.lastUser = performance.now(); if (!this.raf && !this.dead){ this.lt = 0; this.raf = requestAnimationFrame(this.loop); } };
  Pal.prototype.say = function(txt, ms){
    var p = this.p, v = p.voice[Math.floor(Math.random() * p.voice.length)], b = this.say_;
    b.innerHTML = '<b>' + v + '</b>' + (txt ? '<small>' + txt + '</small>' : ''); b.hidden = false; b.classList.remove('in'); void b.offsetWidth; b.classList.add('in');
    b.classList.toggle('left', this.x > innerWidth / 2);
    clearTimeout(this.sayT); this.sayT = setTimeout(function(){ b.hidden = true; }, ms || 3600);
  };
  Pal.prototype.hop = function(h, cb){
    if (this.mode !== 'idle') return; var self = this, t0 = performance.now(), D = 520; this.mode = 'hop';
    (function f(now){ var t = Math.min(1, (now - t0) / D), y, sx = 1, sy = 1;
      if (t < .18){ var a = t / .18; sx = 1 + .18 * a; sy = 1 - .2 * a; y = self.gy; }
      else if (t < .85){ var b = (t - .18) / .67; y = self.gy - h * 4 * b * (1 - b); sx = .92; sy = 1.1 - .1 * Math.abs(.5 - b) * 2; }
      else { var c = (t - .85) / .15; y = self.gy; sx = 1.2 - .2 * c; sy = .82 + .18 * c; }
      self.place(self.x, y, sx, sy, 0);
      if (t < 1) requestAnimationFrame(f); else { self.mode = 'idle'; if (cb) cb(); } })(t0);
  };
  Pal.prototype.poke = function(){ this.wake(); if (this.mode === 'walk'){ this.mode = 'idle'; this.onArrive = null; } var self = this; this.hop(44, function(){ self.heart(); FX.palFx(self, false); }); this.say(['Oi! T\xf4 contigo.', 'Bora achar um achado?', 'Toca em mim de novo!', 'Seu cupom t\xe1 guardado.'][Math.floor(Math.random() * 4)]); };
  Pal.prototype.heart = function(){ var h = document.createElement('span'); h.className = 'pal-heart'; h.textContent = '\u2665'; h.style.color = this.p.c; this.el.appendChild(h); setTimeout(function(){ h.remove(); }, 1100); };
  Pal.prototype.dust = function(x, y){
    for (var i = 0; i < 9; i++){ var d = document.createElement('i'); d.className = 'pal-dust'; var a = Math.PI * (i / 8), r = 30 + Math.random() * 26;
      d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.background = i % 3 ? 'rgba(160,140,190,.55)' : this.p.c2; document.body.appendChild(d);
      d.animate([{transform:'translate(-50%,-50%) scale(1)', opacity:.9}, {transform:'translate(calc(-50% + ' + (Math.cos(a) * r * (i % 2 ? 1 : -1)) + 'px), calc(-50% - ' + (Math.sin(a) * r * .5) + 'px)) scale(.2)', opacity:0}], {duration:620 + Math.random() * 200, easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish = (function(n){ return function(){ n.remove(); }; })(d); }
  };
  /* o salto: agacha, estica, gira no ar, amassa ao tocar o ch\xe3o e levanta poeira */
  Pal.prototype.jumpFrom = function(rect, done){
    var self = this, S = this.size, s0 = rect.width / S, x0 = rect.left + rect.width / 2 - S / 2, y0 = rect.top + rect.height / 2 - S / 2;
    var x1 = this.x, y1 = this.gy, cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - Math.min(280, innerHeight * .32), dir = x1 > x0 ? 1 : -1, t0 = performance.now(), D = reduce ? 1 : 1350;
    this.mode = 'jump'; this.face = dir; this.el.style.opacity = 1;
    function ease(t){ return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    (function f(now){
      var t = Math.min(1, (now - t0) / D), x, y, sx, sy, rot = 0, sc;
      if (t < .14){ var a = t / .14; x = x0; y = y0 + 10 * a * s0; sc = s0; sx = 1 + .28 * a; sy = 1 - .3 * a; }
      else if (t < .8){ var p = (t - .14) / .66, e = ease(p), q = 1 - e;
        x = q * q * x0 + 2 * q * e * cx + e * e * x1; y = q * q * y0 + 2 * q * e * cy + e * e * y1;
        sc = s0 + (1 - s0) * e; var st = p < .5 ? 1 - p * 2 : (p - .5) * 2; sx = .82 + .18 * (1 - st); sy = 1.24 - .24 * (1 - st);
        rot = dir * 360 * ease(Math.min(1, Math.max(0, (p - .15) / .6))); }
      else if (t < .9){ var c = (t - .8) / .1; x = x1; y = y1; sc = 1; sx = 1.34 - .04 * c; sy = .66 + .04 * c; if (!self.landed){ self.landed = true; self.dust(x1 + S / 2, y1 + S * .94); } }
      else { var d = (t - .9) / .1; x = x1; y = y1; sc = 1; sx = 1.3 - .3 * d + Math.sin(d * Math.PI) * -.08; sy = .7 + .3 * d + Math.sin(d * Math.PI) * .1; }
      self.el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; self.f.style.transform = 'scaleX(' + self.face + ')';
      self.s.style.transform = 'rotate(' + rot + 'deg) scale(' + (sx * sc) + ',' + (sy * sc) + ')';
      if (self.dead) return;
      if (t < 1) requestAnimationFrame(f); else { self.mode = 'idle'; self.landed = false; self.lastAct = performance.now(); if (done) done(); }
    })(t0);
  };
  Pal.prototype.enter = function(){ var self = this; this.el.style.opacity = 0; var y = this.gy; this.mode = 'jump';
    this.el.animate([{opacity:0, transform:'translate3d(' + this.x + 'px,' + (y + 60) + 'px,0)'}, {opacity:1, transform:'translate3d(' + this.x + 'px,' + (y - 30) + 'px,0)', offset:.6}, {opacity:1, transform:'translate3d(' + this.x + 'px,' + y + 'px,0)'}], {duration:700, easing:'cubic-bezier(.3,1.4,.5,1)'}).onfinish = function(){ self.el.style.opacity = 1; self.mode = 'idle'; self.say('Voltou! Senti sua falta.'); }; };
  Pal.prototype.destroy = function(){ this.dead = true; cancelAnimationFrame(this.raf); removeEventListener('scroll', this.onScroll); removeEventListener('pointermove', this.onPtr); removeEventListener('pointerdown', this.onDown); removeEventListener('resize', this.onResize); var e = this.el; e.animate([{opacity:1}, {opacity:0, transform:e.style.transform + ' scale(.4)'}], {duration:300}).onfinish = function(){ e.remove(); }; };
  var PAL_LINES = {home:'Bora dar uma volta pela loja?', consoles:'Consoles! Meu lugar favorito.', controles:'Esse controle tem cara de vit\xf3ria.', jogos:'Qual vai ser a pr\xf3xima aventura?', acess:'Um fone novo cai bem, hein.', tcg:'Booster! Booster! Booster!', gta:'Vice City\u2026 d\xe1 at\xe9 calor.', era:'Olha quanto jogo antigo!', conserto:'Quebrou? A gente conserta.'};
  function palCtx(key){ if (PAL && PAL.mode === 'idle'){ PAL.wake(); var l = PAL_LINES[key] || ''; if (PALS[PAL.id].go === key) l = 'Aqui seu cupom ' + PALS[PAL.id].code + ' vale!'; setTimeout(function(){ if (PAL) PAL.say(l); }, 600); } }
  function initPartner(root){
    var sec = root.querySelector('#pcs'); if (!sec) return;
    try { FOX3D.mount(sec); } catch(e){}
    var sky = sec.querySelector('.pcs-sky'), head = sec.querySelector('.pcs-h'), L = sky.querySelectorAll('i'), raf = 0;
    var st = 0, sh = 0; function meas(){ st = absTop(sec); sh = sec.offsetHeight; } meas(); LAY.subs.push(function(){ if (sec.isConnected) meas(); });
    function par(){ raf = 0; var r = {top:st - scrollY, height:sh}, p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
      L[0].style.transform = 'translate3d(0,' + (p * 30) + 'px,0)'; L[1].style.transform = 'translate3d(0,' + (p * 60) + 'px,0)'; L[2].style.transform = 'translate3d(0,' + (p * 100) + 'px,0)';
      var k = Math.max(0, Math.min(1, 1 - (r.top - innerHeight * .25) / (innerHeight * .5))); head.style.transform = 'translate3d(0,' + ((1 - k) * 50) + 'px,0)'; head.style.opacity = .25 + .75 * k; }
    function req(){ if (!raf) raf = requestAnimationFrame(par); }
    if (!reduce){ addEventListener('scroll', req, {passive:true}); par(); }
    if (matchMedia('(hover:hover)').matches && !reduce) sec.querySelectorAll('.pcard').forEach(function(c){
      c.addEventListener('pointermove', function(e){ var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.classList.add('tilt'); c.style.transform = 'rotateY(' + ((x - .5) * 22) + 'deg) rotateX(' + ((.5 - y) * 18) + 'deg) translateZ(10px)'; c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%'); });
      c.addEventListener('pointerleave', function(){ c.classList.remove('tilt'); c.style.transform = ''; }); });
    sec.addEventListener('click', function(e){
      var b = e.target.closest('[data-palpick]');
      if (b){ var id = b.getAttribute('data-palpick'), card = b.closest('.pcard'), art = card.querySelector('.cr'), rect = art.getBoundingClientRect();
        if (PAL && PAL.id === id){ PAL.poke(); return; }
        FX.clear(); var tok = ++PICK;
        if (PAL){ PAL.destroy(); PAL = null; sec.querySelectorAll('.pcard').forEach(function(c){ c.classList.remove('picked'); }); }
        setPal({id:id, t:Date.now()});
        card.classList.add('launch'); setTimeout(function(){ card.classList.remove('launch'); card.classList.add('picked'); }, 160);
        PAL = new Pal(id); PAL.el.style.opacity = 0;
        FX.cardFx(id, rect);
        var me = PAL; setTimeout(function(){ if (tok !== PICK || PAL !== me) return; me.jumpFrom(art.getBoundingClientRect(), function(){ if (tok !== PICK) return; FX.setTheme(id); FX.palFx(me, true); setTimeout(function(){ if (PAL === me) me.say('Prazer! Sou ' + PALS[id].n + '. Seu cupom ' + PALS[id].code + ' t\xe1 ativo.', 5200); }, 900); }); }, reduce ? 0 : 620);
        sec.classList.add('has'); var d = sec.querySelector('.pcs-done'); d.hidden = false; sec.querySelector('#pcsDone').innerHTML = 'Cupom <b>' + PALS[id].code + '</b> ativo \xb7 ' + PALS[id].perk;
        return; }
      if (e.target.closest('[data-palreset]')){ FX.clear(); if (PAL){ PAL.destroy(); PAL = null; } setPal(null); sec.classList.remove('has'); sec.querySelectorAll('.pcard').forEach(function(c){ c.classList.remove('picked'); }); sec.querySelector('.pcs-done').hidden = true; }
    });
  }
  ready(function(){ var v = getPal(); if (v){ setTimeout(function(){ FX.setTheme(v.id); if (!PAL){ PAL = new Pal(v.id); PAL.enter(); } }, 900); } });
  document.addEventListener('click', function(e){ if (PAL && e.target.closest(ADD)){ PAL.wake(); PAL.hop(36); PAL.say('Boa escolha!'); FOX3D.wave(PAL.el); } });
  function info(id){ var p = PALS[id]; return p ? {id:id, nome:p.n, cupom:p.code, beneficio:p.perk, categoria:p.go} : null; }
  function mountSection(el){ if (!el || el.__pcs) return; el.__pcs = 1; el.innerHTML = partnerHTML(); initPartner(el); FX.decorate(ROOT()); }
  window.Parceiros = {
    mount:mountSection,
    get:function(){ var v = getPal(); return v ? info(v.id) : null; },
    reagir:function(){ if (PAL){ PAL.wake(); PAL.hop(36); PAL.say('Boa escolha!'); FOX3D.wave(PAL.el); } },
    atualizarCards:function(){ FX.decorate(ROOT()); }
  };
  ready(function(){ var el = document.getElementById('parceiros') || document.querySelector('[data-parceiros]'); if (el) mountSection(el); else FX.decorate(ROOT()); });
})();
