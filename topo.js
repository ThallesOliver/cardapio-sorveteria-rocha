/* Cabeçalho: calda que escorre, selo que inclina e solta granulados.
   O fundo animado (picolés e granulados em traço) fica em fundo.js. */
(() => {
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const topo = document.querySelector(".topo");
  const caixa = document.getElementById("selo");
  if (!topo || !caixa) return;

  // Calda: gotas de tamanhos variados ao longo da borda
  const calda = topo.querySelector(".calda");
  function montarCalda() {
    const W = topo.clientWidth;
    let x = 8, html = "";
    while (x < W) {
      const w = 14 + Math.random() * 16, h = 8 + Math.random() * 24;
      const t = (2.6 + Math.random() * 2.4).toFixed(2), d = (-Math.random() * 4).toFixed(2);
      html += `<i style="left:${x.toFixed(0)}px;--w:${w.toFixed(0)}px;--h:${h.toFixed(0)}px;--t:${t}s;--d:${d}s"></i>`;
      if (h > 22 && Math.random() < .6) html += `<b style="left:${x.toFixed(0)}px;--y0:${(h - 4).toFixed(0)}px;--d:${(Math.random() * 4).toFixed(2)}s"></b>`;
      x += w + 18 + Math.random() * 38;
    }
    calda.innerHTML = html;
  }
  montarCalda();
  // mesma calda, clara, no topo do rodapé (um SVG só: faixa + gotas sobrepostas, sem linhas)
  const caldaRod = document.querySelector(".rodape-calda");
  function montarCaldaRod() {
    if (!caldaRod) return;
    const W = caldaRod.clientWidth || innerWidth;
    let x = 14, gotas = "";
    while (x < W + 20) {
      const w = 12 + Math.random() * 16, h = 14 + Math.random() * 26, r = w / 2, f = 9;
      const l = x - r, d = (-Math.random() * 4).toFixed(2), tt = (2.8 + Math.random() * 2.4).toFixed(2);
      // gota começa em y=0 (por cima da faixa) e tem cantinhos arredondados onde encosta na faixa
      gotas += `<path class="gota" style="--t:${tt}s;--d:${d}s" d="M${(l - f).toFixed(1)} 0 H${(l + w + f).toFixed(1)} V7 Q${(l + w).toFixed(1)} 7 ${(l + w).toFixed(1)} ${7 + f} V${h} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${l.toFixed(1)} ${h} V${7 + f} Q${l.toFixed(1)} 7 ${(l - f).toFixed(1)} 7 Z"/>`;
      x += w + 24 + Math.random() * 40;
    }
    caldaRod.innerHTML = `<svg viewBox="0 0 ${W} 60" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="${W}" height="8" fill="var(--papel)"/>${gotas}</svg>`;
  }
  montarCaldaRod();
  addEventListener("resize", montarCaldaRod);
  let larg = topo.clientWidth;
  addEventListener("resize", () => { if (Math.abs(topo.clientWidth - larg) > 40) { larg = topo.clientWidth; montarCalda(); } });

  if (calmo) return;

  // Selo inclina seguindo o dedo/mouse
  topo.addEventListener("pointermove", (e) => {
    const r = caixa.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
    const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.2)));
    caixa.style.setProperty("--ry", (px * 12).toFixed(1) + "deg");
    caixa.style.setProperty("--rx", (-py * 10).toFixed(1) + "deg");
  });
  topo.addEventListener("pointerleave", () => { caixa.style.setProperty("--ry", "0deg"); caixa.style.setProperty("--rx", "0deg"); });

  // Inclina também ao arrastar o dedo sobre o selo (celular)
  caixa.addEventListener("touchmove", (e) => {
    const t = e.touches[0], r = caixa.getBoundingClientRect();
    caixa.style.setProperty("--ry", (((t.clientX - r.left) / r.width - .5) * 26).toFixed(1) + "deg");
    caixa.style.setProperty("--rx", (-((t.clientY - r.top) / r.height - .5) * 22).toFixed(1) + "deg");
  }, { passive: true });
  caixa.addEventListener("touchend", () => { caixa.style.setProperty("--ry", "0deg"); caixa.style.setProperty("--rx", "0deg"); });

  // Ao rolar a página, o selo diminui e inclina de leve
  addEventListener("scroll", () => {
    const p = Math.min(1, scrollY / 320);
    caixa.style.scale = (1 - p * .12).toFixed(3);
    if (!caixa.matches(":hover")) caixa.style.setProperty("--rx", (p * 14).toFixed(1) + "deg");
  }, { passive: true });

  // Dica "Toque no selo" e balançadinha de tempos em tempos até a pessoa tocar
  let tocou = false;
  const dica = setTimeout(() => { if (!tocou) caixa.classList.add("dica"); }, 2200);
  const chamar = setInterval(() => {
    if (tocou || scrollY > 200 || document.hidden) return;
    caixa.classList.remove("chama"); void caixa.offsetWidth; caixa.classList.add("chama");
  }, 6500);
  caixa.addEventListener("animationend", (e) => { if (e.animationName === "chega") caixa.style.animation = "none"; });

  // Toque no selo: pulinho + chuva de granulados e mini picolés
  const CORES = ["#F4B3C0", "#8FD3F4", "#B5C98A", "#F25C6E", "#FFFFFF", "#6B3E26", "#C9A7E8"];
  const PICOLES = ["#F25C6E", "#8FD3F4", "#F4B3C0", "#B5C98A", "#F1C232", "#8E5A9B"];
  caixa.addEventListener("click", () => {
    if (!tocou) { tocou = true; clearTimeout(dica); clearInterval(chamar); caixa.classList.remove("dica"); }
    for (let i = 0; i < 6; i++) {
      const m = document.createElement("span");
      m.className = "mini-picole";
      m.innerHTML = `<svg viewBox="0 0 16 28"><path d="M2 20V8a6 6 0 0 1 12 0v12z" fill="${PICOLES[i]}"/><path d="M2 12q3 2 6 0t6 0" stroke="#fff" stroke-opacity=".5" fill="none"/><rect x="6.5" y="19" width="3" height="9" rx="1.5" fill="#D9B98A"/></svg>`;
      caixa.appendChild(m);
      const ang = -Math.PI / 2 + (i - 2.5) * .45, dist = 120 + Math.random() * 60;
      const x = Math.cos(ang) * dist, y = Math.sin(ang) * dist * .8, rot = (i - 2.5) * 30;
      m.animate([
        { transform: "translate(-50%,-50%) scale(.3) rotate(0deg)", opacity: 0 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.2) rotate(${rot}deg)`, opacity: 1, offset: .45 },
        { transform: `translate(calc(-50% + ${x * 1.15}px), calc(-50% + ${y + 140}px)) scale(1) rotate(${rot * 2}deg)`, opacity: 0 }
      ], { duration: 1400, easing: "cubic-bezier(.2,.7,.3,1)", delay: i * 40 }).onfinish = () => m.remove();
    }
    caixa.classList.remove("toque"); void caixa.offsetWidth; caixa.classList.add("toque");
    for (let i = 0; i < 26; i++) {
      const g = document.createElement("span");
      g.className = "granulado";
      g.style.background = CORES[i % CORES.length];
      caixa.appendChild(g);
      const ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 110;
      const x = Math.cos(ang) * dist, y = Math.sin(ang) * dist * .7 - 20;
      const rot = (Math.random() - .5) * 720;
      g.animate([
        { transform: "translate(-50%,-50%) rotate(0deg) scale(.4)", opacity: 1 },
        { transform: `translate(calc(-50% + ${x * .8}px), calc(-50% + ${y * .8}px)) rotate(${rot * .7}deg) scale(1)`, opacity: 1, offset: .55 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y + 60}px)) rotate(${rot}deg) scale(.9)`, opacity: 0 }
      ], { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => g.remove();
    }
  });
})();
