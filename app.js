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
  const hora = (h) => h.replace(":00", "h");
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
    $("#horarios").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const hh = C.horarios[d];
      const cls = d === hr.dia ? ' class="hoje"' : "";
      return `<dt${cls}>${DIAS[d]}</dt><dd${cls}>${hh ? `${hh[0]} – ${hh[1]}` : "Fechado"}</dd>`;
    }).join("");
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

  /* Um painel do leque: cabeçalho que abre e fecha + conteúdo */
  const abertos = new Set();
  function painel(id, nome, resumo, cores, corpo) {
    const aberto = abertos.has(id) || !!termo || filtro !== "todos";
    const bolinhas = cores.length ? `<span class="leque-cores" aria-hidden="true">${cores.map((c) => `<i style="--c:${c}"></i>`).join("")}</span>` : "";
    return `<section class="secao${aberto ? " aberto" : ""}" id="cat-${id}">
      <h2 class="leque-titulo">
        <button type="button" class="leque-cab" id="cab-${id}" data-painel="${id}" aria-expanded="${aberto}" aria-controls="corpo-${id}">
          ${bolinhas}
          <span class="leque-texto"><span class="leque-nome">${esc(nome)}</span><span class="leque-resumo">${esc(resumo)}</span></span>
          <svg class="leque-seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </h2>
      <div class="leque-corpo" id="corpo-${id}" role="region" aria-labelledby="cab-${id}"${aberto ? "" : " inert"}><div class="leque-dentro">${corpo}</div></div>
    </section>`;
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
    return `${selos}<ul class="picoles">${chips}</ul>`;
  }

  function itensHTML(itens) {
    return `<ul class="itens">${itens.map((it) => `<li class="item">
      <span class="item-nome">${esc(it.nome)}</span>
      ${it.desc ? `<span class="item-desc">${esc(it.desc)}</span>` : ""}
    </li>`).join("")}</ul>`;
  }

  function render() {
    let total = 0;
    const html = window.CATEGORIAS.map((cat) => {
      const doNome = bate(cat.nome + " " + (cat.rotulo || ""));
      let corpo, resumo, cores;
      if (cat.sabores) {
        const lista = cat.sabores.filter((s) => (filtro === "todos" || (s.tags || []).includes(filtro)) && (doNome || bate(s.nome)));
        if (!lista.length) return "";
        const disp = lista.filter((s) => !s.esgotado).length;
        resumo = `${cat.rotulo ? cat.rotulo + " · " : ""}${qtd(disp, "sabor", "sabores")}`;
        cores = lista.slice(0, 6).map((s) => s.cor);
        corpo = saboresHTML(cat, lista);
      } else {
        if (filtro !== "todos") return "";
        const itens = cat.itens.filter((it) => doNome || bate(it.nome + " " + (it.desc || "")));
        if (!itens.length) return "";
        resumo = `${cat.rotulo ? cat.rotulo + " · " : ""}${qtd(itens.length, "opção", "opções")}`;
        cores = CORES[cat.id] || [];
        corpo = itensHTML(itens);
      }
      total++;
      const topo = `${cat.nota ? `<p class="nota">${esc(cat.nota)}</p>` : ""}
        ${cat.foto ? `<img class="secao-foto" onerror="this.remove()" src="${esc(cat.foto.src)}" alt="${esc(cat.foto.alt)}" width="1200" height="760" loading="lazy">` : ""}`;
      return painel(cat.id, cat.nome, resumo, cores, topo + corpo);
    }).join("");
    $("#secoes").innerHTML = html;
    $("#vazio").hidden = total > 0;
  }

  function renderCats() {
    const f = [["todos", "Todos"], ...Object.entries(TAGS)];
    $("#filtros").innerHTML = f.map(([k, v]) => `<button type="button" data-filtro="${k}" aria-pressed="${k === filtro}">${v}</button>`).join("");
  }

  document.addEventListener("click", (e) => {
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

  /* ---------- Início ---------- */
  $("#link-mapa").href = $("#link-mapa2").href = C.mapsUrl;
  $("#link-insta").href = C.instagram;
  $("#endereco").textContent = C.endereco;
  if (C.telefone) { const t = $("#telefone"); t.textContent = C.telefone; t.href = "tel:+55" + C.telefone.replace(/\D/g, ""); }
  $("#ano").textContent = new Date().getFullYear();
  renderCats(); render(); status();
  setInterval(status, 60000);
})();
