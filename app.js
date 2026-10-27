(() => {
  const C = window.CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
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

  // Desenhos para categorias sem foto
  const bola = (c1, c2, c3) => `<path d="M14 25l10 16 10-16z" fill="#E2B474" stroke="#9C6B3F" stroke-width="1.2"/><path d="M17 29l12 4M19 34l8-6" stroke="#9C6B3F" stroke-width="1"/><circle cx="24" cy="18" r="10" fill="${c1}"/><path d="M14 20q2.5 4 5 1t5 1 5-1 5 1v-2H14z" fill="${c1}"/><circle cx="20" cy="15" r="2" fill="${c2}"/><circle cx="27" cy="13.5" r="1.6" fill="${c3}"/><circle cx="26" cy="19" r="1.3" fill="${c2}"/>`;
  const ICONES = {
    "massa-agua": bola("#F1C232", "#8E5A9B", "#D7263D"),
    "massa-leite": bola("#C98A4B", "#F4B3C0", "#6B3E26"),
    "massa-zero": bola("#F6F2E7", "#6B3E26", "#F4B3C0"),
    "massa-premium": bola("#3A2A22", "#F6C31C", "#B5C98A") + '<path d="M24 2l1.6 3.4 3.6.4-2.7 2.4.8 3.6-3.3-1.9-3.3 1.9.8-3.6-2.7-2.4 3.6-.4z" fill="#F6C31C" stroke="#8A6A00" stroke-width=".8"/>',
    especiais: '<path d="M17 6a7 7 0 0 1 14 0v20H17z" fill="#6B3E26"/><path d="M17 15c3 2 5-1 7 1s4-1 7 1v-5H17z" fill="#F3E2B3"/><path d="M17 13c2.5 1.5 5-1 7 .5s4.5-1.2 7 .3" fill="none" stroke="#4E2A1A" stroke-width="1.4"/><rect x="22" y="26" width="4" height="12" rx="2" fill="#D9B98A"/>',
    acai: '<ellipse cx="24" cy="21" rx="15" ry="4" fill="#4B1F3E"/><circle cx="18" cy="18" r="3" fill="#F6C31C"/><circle cx="24" cy="16.5" r="3" fill="#F25C6E"/><circle cx="30" cy="18" r="3" fill="#F3E2B3"/><path d="M8 21h32a16 14 0 0 1-32 0z" fill="#8E5A9B"/><path d="M8 21h32" stroke="#2D2928" stroke-width="1.6"/><rect x="18" y="34" width="12" height="4" rx="2" fill="#5B1E3A"/>',
    bebidas: '<path d="M14 16h20l-2.5 20a3 3 0 0 1-3 2.6h-9a3 3 0 0 1-3-2.6z" fill="#F7F3EC" stroke="#2D2928" stroke-width="1.6"/><path d="M15.2 24h17.6l-1.2 9H16.4z" fill="#8A5A35"/><path d="M34 20h2.5a4 4 0 0 1 0 8H33" fill="none" stroke="#2D2928" stroke-width="1.6"/><path d="M20 12c0-2 2-2 2-4M26 12c0-2 2-2 2-4" stroke="#C9965A" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
  };

  /* Um painel do leque: cabeçalho que abre e fecha + conteúdo */
  const abertos = new Set();
  function painel(cat, resumo, qtdTexto, cores, corpo) {
    const id = cat.id;
    const aberto = abertos.has(id) || !!termo || filtro !== "todos";
    const capa = cat.capa
      ? `<span class="leque-capa" aria-hidden="true"><img src="${esc(cat.capa)}" alt="" loading="lazy"></span>`
      : ICONES[id] ? `<span class="leque-capa desenho" aria-hidden="true"><svg viewBox="0 0 48 48">${ICONES[id]}</svg></span>`
      : `<span class="leque-cores" aria-hidden="true">${cores.map((c) => `<i style="--c:${c}"></i>`).join("")}</span>`;
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
  const LEQUE = {"agua": [[95.72, 65.65], [97.06, 80.1], [96.79, 73.91], [97.06, 64.43], [96.52, 48.45]], "leite": [[98.13, 61.44], [98.4, 57.33], [98.4, 70.83], [98.4, 54.27], [98.4, 50.0]]};
  const GIRO = [-34, -17, 0, 17, 34];
  function lequeHTML(l) {
    const pecas = LEQUE[l.pasta].map(([h, ox], i) =>
      `<span class="leque-picole" style="height:${h}%;--ox:${ox}%;--g:${GIRO[i]}deg;--i:${i}">
        <img src="fotos/${l.pasta}-${i + 1}.webp" alt="" draggable="false">
      </span>`).join("");
    return `<div class="leque-palco" role="img" aria-label="${esc(l.alt)}"><div class="leque-base">${pecas}</div></div>`;
  }

  function pacotesHTML(p) {
    const n = p.fotos.length;
    return `<div class="pacotes${n > 2 ? " leque-pacotes" : ""}" role="img" aria-label="${esc(p.alt)}">${p.fotos.map((src, i) =>
      `<span class="pacote" style="--i:${i};--n:${n}"><img src="${esc(src)}" alt="" draggable="false"></span>`).join("")}</div>`;
  }

  const fotoHTML = (f) => `<img class="secao-foto" src="${esc(f.src)}" alt="${esc(f.alt)}" width="1000" height="1250" loading="lazy">`;
  function carrosselHTML(cat) {
    const n = cat.fotos.length;
    return `<div class="carrossel" data-carrossel>
      <div class="carrossel-trilho" tabindex="0" aria-label="Fotos: ${esc(cat.nome)}">${cat.fotos.map((f, i) => `<figure class="foto-moldura slide" aria-label="${i + 1} de ${n}">${fotoHTML(f)}${f.legenda ? `<figcaption>${esc(f.legenda)}</figcaption>` : ""}</figure>`).join("")}</div>
      <div class="carrossel-pontos">${cat.fotos.map((f, i) => `<button type="button" data-ir="${i}" aria-label="Ver foto ${i + 1}"${i ? "" : ' aria-current="true"'}></button>`).join("")}</div>
    </div>`;
  }

  const qtd = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

  function saboresHTML(cat, lista) {
    // Selos comuns a todos os sabores da categoria vão no topo, não em cada sabor
    const comuns = Object.keys(TAGS).filter((t) => cat.sabores.every((s) => (s.tags || []).includes(t)));
    const selos = comuns.length ? `<p class="selos">${comuns.map((t) => `<span>${TAGS[t]}</span>`).join("")}</p>` : "";
    const chips = lista.map((s, i) => {
      const proprias = (s.tags || []).filter((t) => !comuns.includes(t));
      const extra = s.esgotado ? " <small>(esgotado)</small>" : s.casa ? ' <small class="mais">da casa</small>' : "";
      const marca = proprias.length ? ` <small>· ${proprias.map((t) => TAGS[t]).join(" · ")}</small>` : "";
      return `<li class="picole${s.esgotado ? " off" : ""}" style="--c:${s.cor};--i:${i}"><i aria-hidden="true"></i><span>${esc(s.nome)}${extra}${marca}</span></li>`;
    }).join("");
    return `${selos}<ul class="picoles${cat.id.startsWith("massa") ? " bolas" : ""}">${chips}</ul>`;
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
        ${cat.leque ? lequeHTML(cat.leque) : ""}
        ${cat.pacotes ? pacotesHTML(cat.pacotes) : ""}
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
  if (C.telefone) { const t = $("#telefone"); $("#telefone-num").textContent = C.telefone; t.href = "tel:+55" + C.telefone.replace(/\D/g, ""); }
  // Rodapé: blocos surgem ao chegar na tela
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } }), { threshold: .2 });
    document.querySelectorAll(".surge").forEach((el) => io.observe(el));
  } else document.querySelectorAll(".surge").forEach((el) => el.classList.add("visivel"));
  $("#ano").textContent = new Date().getFullYear();
  renderCats(); render(); status();
  setInterval(status, 60000);
})();
