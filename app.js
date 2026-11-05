(() => {
  const C = window.CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  // Valores que vão dentro de style/atributos: só aceita o formato esperado
  const cor = (c) => /^#[0-9a-f]{3,8}$/i.test(String(c)) ? c : "#E8E2D6";
  const num = (n, padrao) => Number.isFinite(+n) ? +n : padrao;
  const slug = (s) => String(s).replace(/[^a-z0-9-]/gi, "");
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const TAGS = { "sem-lactose": "Sem lactose", vegano: "Vegano", zero: "Zero açúcar" };

  /* ---------- Horário ---------- */
  function agoraSP() {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: C.fuso, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
    return { dia, min: (+g("hour") % 24) * 60 + +g("minute") };
  }
  const paraMin = (h) => { const [a, b] = h.split(":"); return +a * 60 + +b; };
  const hora = (h) => h.replace(":00", "h").replace(/^0/, "");
  function horario() {
    const { dia, min } = agoraSP();
    const h = C.horarios[dia];
    if (h && min >= paraMin(h[0]) && min < paraMin(h[1])) return { aberto: true, dia, ate: hora(h[1]) };
    let prox = "";
    if (h && min < paraMin(h[0])) prox = `abre hoje às ${hora(h[0])}`;
    else for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (C.horarios[d]) { prox = `abre ${i === 1 ? "amanhã" : DIAS[d].toLowerCase()} às ${hora(C.horarios[d][0])}`; break; }
    }
    return { aberto: false, dia, prox };
  }
  function status() {
    const hr = horario();
    const el = $("#status");
    el.textContent = hr.aberto ? `Aberto agora · até ${hr.ate}` : `Fechado · ${hr.prox}`;
    el.className = "status " + (hr.aberto ? "aberto" : "fechado");
    // Linha do tempo de cada dia (6h às 24h), com marcador do horário atual
    const INI = 6 * 60, FIM = 24 * 60, pct = (m) => ((Math.min(FIM, Math.max(INI, m)) - INI) / (FIM - INI) * 100).toFixed(2);
    const { min } = agoraSP();
    $("#horarios").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d, i) => {
      const hh = C.horarios[d], hoje = d === hr.dia;
      const barra = hh ? `<span class="barra" style="--a:${pct(paraMin(hh[0]))}%;--b:${pct(paraMin(hh[1]))}%"></span>` : "";
      const agora = hoje ? `<span class="agora" style="--p:${pct(min)}%"></span>` : "";
      return `<li class="${hoje ? "hoje" : ""}" style="--i:${i}"><span class="dia">${DIAS[d]}${hoje ? " <em>hoje</em>" : ""}</span>
        <span class="linha-tempo" aria-hidden="true">${barra}${agora}</span>
        <span class="hora">${hh ? `${hora(hh[0])} – ${hora(hh[1])}` : "Fechado"}</span></li>`;
    }).join("");
    $("#horas-resumo").textContent = hr.aberto ? `Aberto agora · fecha às ${hr.ate}` : `Fechado agora · ${hr.prox}`;
    $("#horas-resumo").className = "horas-resumo " + (hr.aberto ? "aberto" : "fechado");
  }

  /* ---------- Cardápio ---------- */
  let filtro = "todos", termo = "";
  const bate = (texto) => !termo || norm(texto).includes(termo);
  // Cores do leque para categorias sem sabores (taças, açaí etc.)
  const CORES = {
    massa: ["#F3E2B3", "#6B3E26", "#F4B3C0", "#B5C98A"],
    tacas: ["#F6F2E7", "#6B3E26", "#D7263D", "#F3DE8A"],
    acai: ["#4B1F3E", "#5B1E3A", "#8E5A9B"],
    bebidas: ["#5A3420", "#C9965A", "#8FD3F4"],
    viagem: ["#F6C31C", "#F4B3C0", "#F1C232", "#6B3E26"]
  };

  // Ícones desenhados das categorias (animam ao passar o dedo/mouse ou abrir a categoria)
  const L = 'stroke="#2D2928" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"';
  const corpoPicole = (cor, extra = "") => `<rect x="22.6" y="28" width="2.8" height="12" rx="1.4" fill="#E8C99A" ${L}/><path d="M16.5 10.5a7.5 7.5 0 0 1 15 0V27a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z" fill="${cor}" ${L}/>${extra}<path d="M19.2 11v12" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>`;
  const gota = (x, y, cor) => `<path class="ic-gota" d="M${x} ${y}c0 0 2.2 2.6 2.2 4a2.2 2.2 0 0 1-4.4 0c0-1.4 2.2-4 2.2-4z" fill="${cor}" ${L}/>`;
  const casquinha = (bola, extra = "") => `<path d="M16 25.5l8 15 8-15z" fill="#F2C14E" ${L}/><path d="M18.5 28.5l9 4M20.5 33l6-3.5M19 30.5l3 6" stroke="#B9862A" stroke-width=".9"/><path d="M14.5 24.5a9.5 9.5 0 0 1 19 0c0 1.4-1 2-2.2 2H16.7c-1.2 0-2.2-.6-2.2-2z" fill="${bola}" ${L}/>${extra}<path d="M18.5 19.5a6 6 0 0 1 4-3.5" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const brilho = (x, y, s = 1) => `<path class="ic-brilho" style="--d:${(x % 3) * .3}s" d="M${x} ${y - 3 * s}l${.8 * s} ${2.2 * s} ${2.2 * s} ${.8 * s}-${2.2 * s} ${.8 * s}-${.8 * s} ${2.2 * s}-${.8 * s}-${2.2 * s}-${2.2 * s}-${.8 * s} ${2.2 * s}-${.8 * s}z" fill="#F6C31C"/>`;
  const zeroSelo = `<g class="ic-pula"><circle cx="33" cy="12.5" r="5" fill="#fff" ${L}/><text x="33" y="15.2" text-anchor="middle" font-size="7.4" font-weight="800" font-family="Figtree, sans-serif" fill="#2D2928">0</text></g>`;
  const ICONES = {
    agua: { fundo: "#FFE3E0", svg: corpoPicole("#F25C6E", `<path d="M16.5 17c3 1.6 5-1.4 7.5 0s4.5-1.6 7.5 0" fill="none" stroke="#C93A52" stroke-width="1.2"/><g fill="#FFE7A6"><circle cx="21" cy="13" r=".8"/><circle cx="26.5" cy="11" r=".8"/><circle cx="24" cy="21" r=".8"/><circle cx="28" cy="23.5" r=".8"/><circle cx="20.5" cy="24" r=".8"/></g><path class="ic-folha" d="M29 4.5c2.8-1.6 5.5-.6 6.6 1.2-2.6 1.6-5 1.2-6.6-1.2z" fill="#7CC36A" ${L}/>`) + gota(30.5, 30, "#F25C6E") },
    leite: { fundo: "#FCE6EE", svg: corpoPicole("#F4B3C0", `<path d="M16.5 12.5c2 2.4 3.8-.6 5.2 1.2s3.4-1.6 5 .2 3.2-.6 4.8-1.4V10.5a7.5 7.5 0 0 0-15 0z" fill="#FBEFD9" ${L}/>`) + gota(30.5, 30, "#F4B3C0") },
    zero: { fundo: "#E1F3EE", svg: corpoPicole("#F7F1E4", `<path d="M16.5 20h15v7a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z" fill="#6B3E26" ${L}/>`) + zeroSelo + brilho(13, 14, .9) },
    especiais: { fundo: "#F3E4D7", svg: corpoPicole("#F3E2B3", `<path d="M16.5 10.5a7.5 7.5 0 0 1 15 0V19c-1.4 1.6-2.6-.6-3.8 1.2-1 1.6-2.3 2.6-3.3.6-1-2-2.2.6-3.6-.4-1.2-.8-2.2-.4-4.3-1.4z" fill="#5A3420" ${L}/><g class="ic-granulado"><path d="M20 8l1.8.8M25.5 6.5l.4 1.8M27.5 13l1.6-.9M21.5 15.5l1.5.6" stroke="#F4B3C0" stroke-width="1.4" stroke-linecap="round"/><path d="M23.5 11l1.7.3M28.5 9l.6 1.6" stroke="#8FD3F4" stroke-width="1.4" stroke-linecap="round"/><path d="M19.5 12l.5-1.6" stroke="#F6C31C" stroke-width="1.4" stroke-linecap="round"/></g>`) + gota(18.5, 20.5, "#5A3420") },
    "massa-agua": { fundo: "#EEE2F2", svg: casquinha("#8E5A9B", `<g fill="#4B1F3E"><circle cx="20" cy="21" r=".9"/><circle cx="26" cy="18.5" r=".9"/><circle cx="28.5" cy="23" r=".9"/></g>`) + `<path class="ic-folha" d="M24.5 15c.4-3 2.6-4.6 4.8-4.4-.4 2.8-2.4 4.4-4.8 4.4z" fill="#7CC36A" ${L}/>` },
    "massa-leite": { fundo: "#E3F3E8", svg: casquinha("#A8DCC0", `<g fill="#4E2A1A"><rect x="19.5" y="19" width="2" height="1.4" rx=".4"/><rect x="25.5" y="17.5" width="2" height="1.4" rx=".4" transform="rotate(25 26.5 18.2)"/><rect x="27.5" y="22.5" width="2" height="1.4" rx=".4"/><rect x="22" y="23" width="2" height="1.4" rx=".4" transform="rotate(-20 23 23.7)"/></g>`) },
    "massa-zero": { fundo: "#FCE6EB", svg: casquinha("#F4B3C0") + zeroSelo + brilho(13, 14, .9) },
    "massa-premium": { fundo: "#F4E6D2", svg: casquinha("#E2B47A", `<path class="ic-calda" d="M15.5 21.5c2 1.4 3.4-1.6 5.4.2s3-1.8 5.2-.2 3.2-1 5.4.4" fill="none" stroke="#9C5B22" stroke-width="1.6" stroke-linecap="round"/>`) + `<path class="ic-coroa" d="M18 9.5l2.2 2.4 3.8-4.4 3.8 4.4 2.2-2.4-.8 5h-10.4z" fill="#F6C31C" ${L}/>` + brilho(37, 18, .8) },
    tacas: { fundo: "#FBEBDD", svg: `<path d="M13 22h22c-.6 5.6-4.6 9.2-11 9.2S13.6 27.6 13 22z" fill="#F6F2E7" ${L}/><path d="M14.2 25.5h19.6" stroke="#E8A3B0" stroke-width="2.4"/><path d="M24 31.2v5.3M18.5 39.5h11c0-1.7-2.4-3-5.5-3s-5.5 1.3-5.5 3z" fill="#F6F2E7" ${L}/><path d="M15 22c0-4.6 3.4-6.6 5.6-6.6.6-2.6 2.4-4 4.6-4s4.6 1.8 4.6 4.6c2.4.2 4.4 2.6 4.2 6z" fill="#FFF8EE" ${L}/><path d="M16.5 19.5c2.2 1 3.4-1.4 5.6 0s3.6-1.4 6 0 3.2-.6 4.6.6" fill="none" stroke="#6B3E26" stroke-width="1.5" stroke-linecap="round"/><path class="ic-wafer" d="M28 15.5l4.6-11.5" stroke="#D9A35A" stroke-width="2.6" stroke-linecap="round"/><g class="ic-pula"><circle cx="21.5" cy="10.8" r="2.6" fill="#D7263D" ${L}/><path d="M22.5 8.4c.4-1.6 1.4-2.6 2.8-3" fill="none" stroke="#2D2928" stroke-width="1.1" stroke-linecap="round"/></g>` },
    acai: { fundo: "#EEE0EC", svg: `<path d="M9.5 22h29c-.4 8-6.6 13.5-14.5 13.5S9.9 30 9.5 22z" fill="#F7F3EC" ${L}/><path d="M21 35.4l-1.5 3h9l-1.5-3" fill="#F7F3EC" ${L}/><path d="M11 22c0-3.4 5.8-6 13-6s13 2.6 13 6z" fill="#5B1E3A" ${L}/><g class="ic-pula"><circle cx="19" cy="18.4" r="2.4" fill="#F7E7A0" ${L}/><circle cx="19" cy="18.4" r=".7" fill="#C9965A"/></g><g fill="#D9A35A" stroke="#9C6B3F" stroke-width=".6"><circle cx="25" cy="17.6" r="1"/><circle cx="27.4" cy="19" r="1"/><circle cx="23.4" cy="19.8" r="1"/><circle cx="29.8" cy="17.8" r="1"/></g><path class="ic-folha" d="M31 15.5c.6-2.4 2.6-3.4 4.4-3-.6 2.2-2.4 3.4-4.4 3z" fill="#7CC36A" ${L}/><path d="M14 26c1.4 3 4.4 5.2 8 5.6" stroke="#fff" stroke-opacity=".8" stroke-width="1.4" fill="none" stroke-linecap="round"/>` },
    bebidas: { fundo: "#F2E6DA", svg: `<path d="M11 33.5h24.5c0 2.2-5.4 4-12.2 4S11 35.7 11 33.5z" fill="#F7F3EC" ${L}/><path d="M14 18h18.5l-1.8 12.4a3.4 3.4 0 0 1-3.4 2.9h-8.1a3.4 3.4 0 0 1-3.4-2.9z" fill="#FFFFFF" ${L}/><path d="M14.6 21.5h17.3" stroke="#2D2928" stroke-width="1.1"/><ellipse cx="23.25" cy="19.8" rx="8.6" ry="1.4" fill="#8A5A35"/><path d="M32 21.5h2.4a3.6 3.6 0 0 1 0 7.2h-3.3" fill="none" ${L}/><g class="ic-vapor"><path d="M19.5 14.5c-1.6-1.8 1.6-3 0-5" /><path d="M23.5 14c-1.6-1.8 1.6-3 0-5"/><path d="M27.5 14.5c-1.6-1.8 1.6-3 0-5"/></g>` },
    viagem: { fundo: "#FFF1C2", svg: `<g class="ic-balanca"><path d="M13 12l3-2.2 3 2.2 3-2.2 3 2.2 3-2.2 3 2.2 3-2.2 3 2.2v24.5l-3 2.2-3-2.2-3 2.2-3-2.2-3 2.2-3-2.2-3 2.2-3-2.2z" fill="#F6C31C" ${L}/><path d="M13 19h22v10H13z" fill="#2D2928"/><text x="24" y="26.2" text-anchor="middle" font-size="5.4" font-weight="700" letter-spacing=".2" font-family="'Playfair Display', Georgia, serif" fill="#F7F3EC">ROCHA</text><path d="M16 14.5h16" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" stroke-linecap="round"/></g>` }
  };

  /* Um painel do leque: cabeçalho que abre e fecha + conteúdo */
  const abertos = new Set();
  function painel(cat, resumo, qtdTexto, cores, corpo) {
    const id = slug(cat.id);
    const aberto = abertos.has(id) || !!termo || filtro !== "todos";
    const ic = ICONES[id];
    const capa = ic
      ? `<span class="leque-capa desenho" style="--fundo:${cor(ic.fundo)}" aria-hidden="true"><svg viewBox="3 1.5 42 42">${ic.svg}</svg></span>`
      : cat.capa ? `<span class="leque-capa" aria-hidden="true"><img src="${esc(cat.capa)}" alt="" loading="lazy"></span>`
      : `<span class="leque-cores" aria-hidden="true">${cores.map((c) => `<i style="--c:${cor(c)}"></i>`).join("")}</span>`;
    return `<section class="secao${aberto ? " aberto" : ""}" id="cat-${id}">
      <h2 class="leque-titulo">
        <button type="button" class="leque-cab" id="cab-${id}" data-painel="${id}" aria-expanded="${aberto}" aria-controls="corpo-${id}">
          ${capa}
          <span class="leque-texto"><span class="leque-nome">${esc(cat.nome)}</span><span class="leque-resumo">${esc(resumo)}<span class="leque-qtd"> · ${esc(qtdTexto)}</span></span></span>
          <svg class="leque-seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </h2>
      <div class="leque-corpo" id="corpo-${id}" role="region" aria-labelledby="cab-${id}"${aberto ? "" : " inert"}><div class="leque-dentro">${corpo}</div></div>
    </section>`;
  }

  /* Picolés recortados que abrem em leque: [altura em %, posição do palito em %] */
  const LEQUE = {"agua": [[95.72, 69.59], [97.06, 87.02], [96.79, 77.53], [97.06, 64.31], [96.52, 47.13]], "leite": [[98.13, 64.74], [98.4, 59.67], [98.4, 74.0], [98.4, 54.85], [98.4, 50.27]], "zero": [[97, 46.06], [97, 48.9]], "especiais": [[97, 51.11], [97, 51.17], [97, 50.3], [97, 45.75], [97, 49.48], [97, 51.64]], "refri": [[70, 50], [70, 50], [70, 50], [70, 50], [70, 50]], "suco": [[94, 50], [100, 50], [90, 50]]};
  const HD = ["agua", "leite", "zero", "especiais"]; // recortes em alta resolução: fotos/hd-<pasta>-N.webp
  // ângulos do leque conforme a quantidade de picolés (5 → -34, -17, 0, 17, 34)
  // abertura maior para recortes largos (latas e caixinhas)
  const ABERTURA = { refri: 52, suco: 30 };
  const giros = (n, max) => n < 2 ? [0] : Array.from({ length: n }, (_, i) => Math.round((-1 + 2 * i / (n - 1)) * (max || Math.min(34, 8 * n))));
  function lequeHTML(l) {
    const GIRO = giros(LEQUE[l.pasta].length, ABERTURA[l.pasta]);
    const pecas = LEQUE[l.pasta].map(([h, ox], i) =>
      `<span class="leque-picole" style="height:${h}%;--ox:${ox}%;--g:${GIRO[i]}deg;--i:${i}">
        <img src="fotos/${HD.includes(l.pasta) ? "hd-" : ""}${slug(l.pasta)}-${i + 1}.webp" alt="" draggable="false">
      </span>`).join("");
    return `<div class="leque-palco" role="img" aria-label="${esc(l.alt)}"><div class="leque-base" data-pasta="${esc(l.pasta)}">${pecas}</div></div>`;
  }

  /* Casquinha recortada que sobe ao abrir, flutua e balança ao toque */
  const casquinhaHTML = (c) => `<div class="casquinha-palco"><button type="button" class="casquinha" aria-label="${esc(c.alt)}"><img src="${esc(c.src)}" alt="" draggable="false"></button><span class="casquinha-sombra" aria-hidden="true"></span></div>`;

  /* Vitrine: bebidas recortadas lado a lado (café solta vapor, água com gás faz bolhinhas) */
  const vitrineHTML = (v) => `<div class="vitrine">${v.map((it, i) => `<button type="button" class="vitrine-item" style="--h:${num(it.altura, 100)}%;--i:${i}" aria-label="${esc(it.alt)}"><img src="${esc(it.src)}" alt="" draggable="false">${it.vapor ? '<span class="vapor" aria-hidden="true"><svg viewBox="0 0 60 80"><path d="M14 78c-8-12 8-18 0-30s8-20 2-32"/><path d="M30 78c-8-12 8-18 0-30s8-20 2-32"/><path d="M46 78c-8-12 8-18 0-30s8-20 2-32"/></svg></span>' : ""}${it.bolhas ? `<span class="bolhas" aria-hidden="true">${"<i></i>".repeat(8)}</span>` : ""}</button>`).join("")}</div>`;

  function pacotesHTML(p) {
    const n = p.fotos.length;
    return `<div class="pacotes${n > 2 ? " leque-pacotes" : ""}" role="img" aria-label="${esc(p.alt)}">${p.fotos.map((src, i) =>
      `<span class="pacote" style="--i:${i};--n:${n}"><img src="${esc(src)}" alt="" draggable="false"></span>`).join("")}</div>`;
  }

  const fotoHTML = (f) => `<img class="secao-foto" src="${esc(f.src)}" alt="${esc(f.alt)}" width="1000" height="1250" loading="lazy">`;
  function carrosselHTML(cat) {
    const n = cat.fotos.length;
    return `<div class="carrossel" data-carrossel>
      <div class="carrossel-trilho" tabindex="0" aria-label="Fotos: ${esc(cat.nome)}">${cat.fotos.map((f, i) => `<figure class="foto-moldura slide${f.selo ? " com-selo" : ""}" aria-label="${i + 1} de ${n}">${fotoHTML(f)}${f.legenda ? `<figcaption>${esc(f.legenda)}</figcaption>` : ""}</figure>`).join("")}</div>
      <div class="carrossel-pontos">${cat.fotos.map((f, i) => `<button type="button" data-ir="${i}" aria-label="Ver foto ${i + 1}"${i ? "" : ' aria-current="true"'}></button>`).join("")}</div>
    </div>`;
  }

  const LIMITE = 10; // sabores visíveis antes do "Ver mais"
  const qtd = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

  function saboresHTML(cat, lista) {
    // Selos comuns a todos os sabores da categoria vão no topo, não em cada sabor
    const comuns = Object.keys(TAGS).filter((t) => cat.sabores.every((s) => (s.tags || []).includes(t)));
    const selos = comuns.length ? `<p class="selos">${comuns.map((t) => `<span>${TAGS[t]}</span>`).join("")}</p>` : "";
    const chips = lista.map((s, i) => {
      const proprias = (s.tags || []).filter((t) => !comuns.includes(t));
      const extra = s.esgotado ? " <small>(esgotado)</small>" : s.novo ? ' <small class="novo">novo</small>' : s.casa ? ' <small class="mais">da casa</small>' : "";
      const marca = proprias.length ? ` <small>· ${proprias.map((t) => TAGS[t]).join(" · ")}</small>` : "";
      const escondido = i >= LIMITE && !termo && filtro === "todos" ? " extra" : "";
      return `<li class="picole${s.esgotado ? " off" : ""}${escondido}" style="--c:${cor(s.cor)};--i:${i}"><i aria-hidden="true"></i><span>${esc(s.nome)}${extra}${marca}</span></li>`;
    }).join("");
    // Mais de 10 sabores: mostra 10 e um botão "Ver mais sabores" (na busca/filtro mostra todos)
    const resto = lista.length - LIMITE;
    const mais = resto > 0 && !termo && filtro === "todos"
      ? `<button type="button" class="ver-mais" data-ver-mais aria-expanded="false"><span>Ver mais ${resto} sabores</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>` : "";
    return `${selos}<ul class="picoles${cat.id.startsWith("massa") ? " bolas" : ""}">${chips}</ul>${mais}`;
  }

  function itensHTML(itens) {
    return `<ul class="itens">${itens.map((it) => `<li class="item">
      <span class="item-nome">${esc(it.nome)}</span>
      ${it.desc ? `<span class="item-desc">${esc(it.desc)}</span>` : ""}
    </li>`).join("")}</ul>`;
  }

  function render() {
    let total = 0;
    let grupoAtual = "";
    const html = window.CATEGORIAS.map((cat) => {
      const doNome = bate(cat.nome + " " + (cat.rotulo || ""));
      let corpo, resumo, cores;
      if (cat.sabores) {
        const lista = cat.sabores.filter((s) => (filtro === "todos" || (s.tags || []).includes(filtro)) && (doNome || bate(s.nome)));
        if (!lista.length) return "";
        const disp = lista.filter((s) => !s.esgotado).length;
        resumo = cat.rotulo || ""; var conta = qtd(disp, "sabor", "sabores");
        cores = lista.slice(0, 6).map((s) => s.cor);
        corpo = saboresHTML(cat, lista);
      } else {
        if (filtro !== "todos") return "";
        const itens = cat.itens.filter((it) => doNome || bate(it.nome + " " + (it.desc || "")));
        if (!itens.length) return "";
        resumo = cat.rotulo || ""; var conta = qtd(itens.length, "opção", "opções");
        cores = CORES[cat.id] || [];
        corpo = itensHTML(itens);
      }
      total++;
      const topo = `${cat.nota ? `<p class="nota">${esc(cat.nota)}</p>` : ""}
        ${cat.vitrine ? vitrineHTML(cat.vitrine) : ""}
        ${cat.leque ? [].concat(cat.leque).map(lequeHTML).join("") : ""}
        ${cat.pacotes ? pacotesHTML(cat.pacotes) : ""}
        ${cat.casquinha ? casquinhaHTML(cat.casquinha) : ""}
        ${cat.foto ? `<div class="foto-moldura">${fotoHTML(cat.foto)}</div>` : ""}
        ${cat.fotos ? carrosselHTML(cat) : ""}`;
      const cab = cat.grupo && cat.grupo !== grupoAtual ? `<h3 class="grupo">${esc(cat.grupo)}</h3>` : "";
      grupoAtual = cat.grupo || grupoAtual;
      return cab + painel(cat, resumo, conta, cores, topo + corpo);
    }).join("");
    $("#secoes").innerHTML = html;
    $("#vazio").hidden = total > 0;
  }

  function renderCats() {
    const f = [["todos", "Todos"], ...Object.entries(TAGS)];
    $("#filtros").innerHTML = f.map(([k, v]) => `<button type="button" data-filtro="${k}" aria-pressed="${k === filtro}">${v}</button>`).join("");
  }

  document.addEventListener("click", (e) => {
    const ir = e.target.closest("[data-ir]");
    if (ir) { mexeuEm = Date.now(); irPara(ir.closest("[data-carrossel]"), +ir.dataset.ir); return; }
    const vm = e.target.closest("[data-ver-mais]");
    if (vm) {
      const ul = vm.previousElementSibling, abrir = !ul.classList.contains("todos");
      ul.classList.toggle("todos", abrir); vm.setAttribute("aria-expanded", abrir);
      const n = ul.querySelectorAll(".extra").length;
      vm.querySelector("span").textContent = abrir ? "Ver menos" : `Ver mais ${n} sabores`;
      if (!abrir) ul.closest(".secao").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const casq = e.target.closest(".casquinha, .vitrine-item");
    if (casq) {
      casq.classList.remove("balanca"); void casq.offsetWidth; casq.classList.add("balanca");
      casq.addEventListener("animationend", () => casq.classList.remove("balanca"), { once: true });
      return;
    }
    const pac = e.target.closest(".pacote");
    if (pac) {
      pac.classList.remove("balanca"); void pac.offsetWidth; pac.classList.add("balanca");
      pac.addEventListener("animationend", () => pac.classList.remove("balanca"), { once: true });
      return;
    }
    const base = e.target.closest(".leque-base");
    if (base) {
      // descobre qual picolé foi tocado pelo ângulo em relação ao palito
      const r = base.getBoundingClientRect();
      const ang = Math.atan2(e.clientX - (r.left + r.width / 2), r.bottom - e.clientY) * 180 / Math.PI;
      const GIRO = giros(base.children.length, ABERTURA[base.dataset.pasta]);
      const i = GIRO.reduce((m, g, j) => Math.abs(g - ang) < Math.abs(GIRO[m] - ang) ? j : m, 0);
      const pic = base.children[i];
      pic.classList.remove("balanca"); void pic.offsetWidth; pic.classList.add("balanca");
      pic.addEventListener("animationend", () => pic.classList.remove("balanca"), { once: true });
      return;
    }
    const cab = e.target.closest("[data-painel]");
    if (cab) {
      const id = cab.dataset.painel, sec = cab.closest(".secao"), corpo = sec.querySelector(".leque-corpo");
      const abrir = !sec.classList.contains("aberto");
      sec.classList.toggle("aberto", abrir);
      cab.setAttribute("aria-expanded", abrir);
      corpo.inert = !abrir;
      abrir ? abertos.add(id) : abertos.delete(id);
      if (abrir) setTimeout(() => {
        const r = sec.getBoundingClientRect();
        if (r.top < 0 || r.top > innerHeight * 0.6) sec.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }
    const f = e.target.closest("[data-filtro]");
    if (!f) return;
    filtro = f.dataset.filtro;
    document.querySelectorAll("[data-filtro]").forEach((b) => b.setAttribute("aria-pressed", b === f));
    render();
  });
  $("#busca").addEventListener("input", (e) => { termo = norm(e.target.value.trim()); render(); });

  const calmoMov = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Carrossel de fotos: arrasta com o dedo, pontinhos, e passa sozinho a cada 4 s */
  let mexeuEm = 0;
  const trilhoDe = (c) => c.querySelector(".carrossel-trilho");
  const atual = (t) => Math.round(t.scrollLeft / t.clientWidth);
  function irPara(c, i) { const t = trilhoDe(c); t.scrollTo({ left: i * t.clientWidth, behavior: "smooth" }); }
  document.addEventListener("scroll", (e) => {
    const t = e.target;
    if (!(t instanceof Element) || !t.classList.contains("carrossel-trilho")) return;
    const i = atual(t);
    t.parentNode.querySelectorAll("[data-ir]").forEach((b, j) => b.toggleAttribute("aria-current", j === i));
  }, { capture: true, passive: true });
  ["pointerdown", "touchstart", "wheel"].forEach((ev) => document.addEventListener(ev, (e) => {
    if (e.target.closest?.(".carrossel")) mexeuEm = Date.now();
  }, { passive: true }));
  setInterval(() => {
    if (calmoMov() || Date.now() - mexeuEm < 8000 || document.hidden) return;
    document.querySelectorAll(".secao.aberto [data-carrossel]").forEach((c) => {
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const t = trilhoDe(c), n = t.children.length;
      irPara(c, (atual(t) + 1) % n);
    });
  }, 4000);

  /* ---------- Início ---------- */
  $("#link-mapa").href = $("#link-mapa2").href = C.mapsUrl;
  $("#link-insta").href = C.instagram;
  $("#endereco").textContent = C.endereco.split(" — ")[0] + " · Centro Histórico";
  // Compartilhar o cardápio (menu do celular; no computador, copia o link)
  const comp = $("#compartilhar");
  if (comp) comp.addEventListener("click", async () => {
    const dados = { title: C.nome + " — Cardápio", text: "Olha o cardápio dos " + C.nome + ":", url: location.origin + "/" };
    if (navigator.share) { try { await navigator.share(dados); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(dados.url); comp.textContent = "Link copiado!"; }
    catch (e) { comp.textContent = dados.url.replace(/^https?:\/\//, ""); }
    setTimeout(() => { comp.textContent = "Compartilhar"; }, 2200);
  });
  const zap = C.whatsapp || C.telefone;
  if (zap) { const t = $("#telefone"); $("#telefone-num").textContent = zap; t.href = "https://wa.me/55" + zap.replace(/\D/g, ""); }
  // Rodapé: blocos surgem ao chegar na tela
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } }), { threshold: .2 });
    document.querySelectorAll(".surge").forEach((el) => io.observe(el));
  } else document.querySelectorAll(".surge").forEach((el) => el.classList.add("visivel"));
  $("#ano").textContent = new Date().getFullYear();
  renderCats(); render(); status();
  setInterval(status, 60000);
})();
