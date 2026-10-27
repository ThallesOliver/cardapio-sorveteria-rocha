/* Cabeçalho: calda que escorre, bolhinhas subindo, selo que inclina e solta granulados */
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
  let larg = topo.clientWidth;
  addEventListener("resize", () => { if (Math.abs(topo.clientWidth - larg) > 40) { larg = topo.clientWidth; montarCalda(); } });

  if (calmo) return;

  // Bolhinhas subindo no fundo amarelo
  const bolhas = topo.querySelector(".topo-bolhas");
  bolhas.innerHTML = Array.from({ length: 14 }, () => {
    const s = 4 + Math.random() * 10;
    return `<span style="left:${(Math.random() * 100).toFixed(1)}%;width:${s.toFixed(0)}px;height:${s.toFixed(0)}px;--alt:${(260 + Math.random() * 260).toFixed(0)}px;--dx:${((Math.random() - .5) * 40).toFixed(0)}px;animation-duration:${(7 + Math.random() * 8).toFixed(1)}s;animation-delay:${(-Math.random() * 12).toFixed(1)}s"></span>`;
  }).join("");

  // Selo inclina seguindo o dedo/mouse
  topo.addEventListener("pointermove", (e) => {
    const r = caixa.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
    const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.2)));
    caixa.style.setProperty("--ry", (px * 12).toFixed(1) + "deg");
    caixa.style.setProperty("--rx", (-py * 10).toFixed(1) + "deg");
  });
  topo.addEventListener("pointerleave", () => { caixa.style.setProperty("--ry", "0deg"); caixa.style.setProperty("--rx", "0deg"); });

  // Toque no selo: pulinho + chuva de granulados
  const CORES = ["#F4B3C0", "#8FD3F4", "#B5C98A", "#F25C6E", "#FFFFFF", "#6B3E26", "#C9A7E8"];
  caixa.addEventListener("click", () => {
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
