(() => {
  const C = window.CONFIG;
  const LISTAS = { SABORES: window.SABORES, PICOLES_FRUTA: window.PICOLES_FRUTA, PICOLES_CREMOSOS: window.PICOLES_CREMOSOS };
  const ADIC = { ADICIONAIS_SORVETE: window.ADICIONAIS_SORVETE, ADICIONAIS_ACAI: window.ADICIONAIS_ACAI };
  const $ = (s, el = document) => el.querySelector(s);
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const TAGS = { fruta: "Fruta", cremoso: "Cremoso", classico: "Clássico", "sem-lactose": "Sem lactose", zero: "Zero açúcar" };

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

  // Descrição automática para itens montados com bolas/sabores
  function descricao(it) {
    if (it.desc) return it.desc;
    const s = it.opcoes?.sabores;
    if (!s || s.de !== "SABORES") return "";
    const n = s.min === s.max ? s.max : `até ${s.max}`;
    const um = s.max === 1;
    return s.repetir ? `${n} ${um ? "bola" : "bolas"}, ${um ? "sabor" : "sabores"} à escolha` : `${n} ${um ? "sabor" : "sabores"} à escolha`;
  }

  function secaoSabores() {
    const lista = window.SABORES.filter((s) => (filtro === "todos" || s.tags.includes(filtro)) && bate(s.nome));
    if (!lista.length) return "";
    return `<section class="secao" id="cat-sabores" aria-labelledby="h-sabores">
      <h2 id="h-sabores">Sabores de massa</h2>
      <p class="nota">Servidos em bolas, potes, taças e milkshakes.</p>
      <ul class="sabores">${lista.map((s) => `<li class="sabor${s.esgotado ? " off" : ""}">
        <span class="ponto" style="--c:${s.cor}" aria-hidden="true"></span>
        <span><span class="nome">${esc(s.nome)}</span>${s.esgotado ? "<small>Esgotado hoje</small>" : s.estacao ? "<small>Da estação</small>" : ""}</span>
      </li>`).join("")}</ul>
    </section>`;
  }

  function itemVisivel(it) {
    if (filtro !== "todos") {
      const s = it.opcoes?.sabores;
      if (s?.de === "SABORES") { if (!window.SABORES.some((x) => x.tags.includes(filtro) && !x.esgotado)) return false; }
      else if (!(it.tags || []).includes(filtro)) return false;
    }
    let texto = it.nome + " " + descricao(it);
    if (it.opcoes?.sabores) texto += " " + LISTAS[it.opcoes.sabores.de].map((x) => x.nome).join(" ");
    return bate(texto);
  }

  function itemHTML(it) {
    const selos = [];
    if (it.destaque) selos.push("<span>Mais pedido</span>");
    (it.tags || []).forEach((t) => selos.push(`<span>${TAGS[t]}</span>`));
    if (it.esgotado) selos.push('<span class="esgotado">Esgotado hoje</span>');
    const s = it.opcoes?.sabores;
    const lista = s && s.de !== "SABORES"
      ? `<p class="lista-sabores">${LISTAS[s.de].map((x) => x.esgotado ? `<span class="off">${esc(x.nome)}</span>` : esc(x.nome)).join(", ")}</p>`
      : "";
    const d = descricao(it);
    return `<li class="item${it.esgotado ? " off" : ""}">
      <div class="linha"><span class="item-nome">${esc(it.nome)}</span><span class="pontos" aria-hidden="true"></span><span class="preco">${brl(it.preco)}</span></div>
      ${d ? `<p class="item-desc">${esc(d)}</p>` : ""}
      ${lista}
      ${selos.length ? `<p class="selos">${selos.join("")}</p>` : ""}
    </li>`;
  }

  function extrasHTML(cat) {
    const chave = cat.itens.map((i) => i.opcoes?.adicionais).find(Boolean);
    if (!chave) return "";
    const gratis = cat.itens.map((i) => i.opcoes?.gratis).find(Boolean);
    const titulo = gratis ? "Acompanhamentos" : "Adicionais";
    const nota = gratis ? `<p class="extras-nota">Escolha até ${gratis} sem custo. A partir do ${gratis + 1}º, ${brl(2)} cada.</p>` : "";
    return `<div class="extras"><h3>${titulo}</h3>${nota}
      <ul>${ADIC[chave].map((a) => a.preco
        ? `<li><span>${esc(a.nome)}</span><span class="pontos" aria-hidden="true"></span><span class="valor">+ ${brl(a.preco)}</span></li>`
        : `<li><span>${esc(a.nome)}</span></li>`).join("")}</ul>
    </div>`;
  }

  function render() {
    let html = secaoSabores();
    let total = html ? 1 : 0;
    html += window.CATEGORIAS.map((cat) => {
      const itens = cat.itens.filter(itemVisivel);
      if (!itens.length) return "";
      total++;
      return `<section class="secao" id="cat-${cat.id}" aria-labelledby="h-${cat.id}">
        <h2 id="h-${cat.id}">${esc(cat.nome)}</h2>
        ${cat.nota ? `<p class="nota">${esc(cat.nota)}</p>` : ""}
        ${cat.foto ? `<img class="secao-foto" onerror="this.remove()" src="${esc(cat.foto.src)}" alt="${esc(cat.foto.alt)}" width="1200" height="760" loading="lazy">` : ""}
        <ul class="itens">${itens.map(itemHTML).join("")}</ul>
        ${extrasHTML(cat)}
      </section>`;
    }).join("");
    $("#secoes").innerHTML = html;
    $("#vazio").hidden = total > 0;
    if (typeof observar === "function") observar();
  }

  function renderCats() {
    const cats = [{ id: "sabores", nome: "Sabores" }, ...window.CATEGORIAS];
    $("#cats").innerHTML = cats.map((c) => `<a href="#cat-${c.id}" data-cat="${c.id}">${esc(c.nome)}</a>`).join("");
    const f = [["todos", "Todos"], ...Object.entries(TAGS)];
    $("#filtros").innerHTML = f.map(([k, v]) => `<button type="button" data-filtro="${k}" aria-pressed="${k === filtro}">${v}</button>`).join("");
  }

  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-filtro]");
    if (!f) return;
    filtro = f.dataset.filtro;
    document.querySelectorAll("[data-filtro]").forEach((b) => b.setAttribute("aria-pressed", b === f));
    render();
  });
  $("#busca").addEventListener("input", (e) => { termo = norm(e.target.value.trim()); render(); });

  // Destaca a categoria visível. Só rola a barra de categorias na horizontal; nunca mexe na rolagem da página.
  const nav = $("#cats");
  let catAtiva = "";
  const obs = new IntersectionObserver((ents) => {
    const vis = ents.find((en) => en.isIntersecting);
    if (!vis) return;
    const id = vis.target.id.replace("cat-", "");
    if (id === catAtiva) return;
    catAtiva = id;
    nav.querySelectorAll("a").forEach((a) => {
      const on = a.dataset.cat === id;
      a.classList.toggle("ativo", on);
      if (on) nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  const observar = () => { obs.disconnect(); catAtiva = ""; document.querySelectorAll(".secao").forEach((s) => obs.observe(s)); };

  /* ---------- Início ---------- */
  $("#link-mapa").href = $("#link-mapa2").href = C.mapsUrl;
  $("#link-insta").href = C.instagram;
  $("#endereco").textContent = C.endereco;
  renderCats(); render(); status();
  // Se as fotos da galeria não carregarem, esconde a seção inteira
  window.addEventListener("load", () => {
    const g = $(".galeria");
    if (g && !g.querySelector(".fotos li:not([hidden])")) g.hidden = true;
  });
  setInterval(status, 60000);
})();
