/* Fundo animado: picolés, casquinhas e granulados desenhados em traço fino,
   flutuando devagar. Mexem com a rolagem (profundidade) e se afastam do dedo/mouse. */
(() => {
  const cv = document.getElementById("fundo");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  const calmo = matchMedia("(prefers-reduced-motion: reduce)");
  const CORES = ["#F6C31C", "#F4B3C0", "#8FD3F4", "#B5C98A", "#C99A62"];

  // Desenhos em um quadrado de 40x40, centrados em (20,20)
  const FORMAS = {
    picole: (c) => { c.beginPath(); c.moveTo(12, 30); c.lineTo(12, 12); c.arc(20, 12, 8, Math.PI, 0); c.lineTo(28, 30); c.closePath(); c.moveTo(20, 30); c.lineTo(20, 38); },
    casquinha: (c) => { c.beginPath(); c.arc(20, 14, 9, Math.PI * .9, Math.PI * 2.1); c.moveTo(11, 17); c.lineTo(20, 38); c.lineTo(29, 17); c.moveTo(14, 22); c.lineTo(25, 28); c.moveTo(26, 22); c.lineTo(16, 30); },
    bola: (c) => { c.beginPath(); c.arc(20, 18, 11, Math.PI * .95, Math.PI * 2.05); c.quadraticCurveTo(26, 34, 22, 26); c.quadraticCurveTo(18, 34, 15, 27); c.quadraticCurveTo(11, 32, 9, 21); },
    granulado: (c) => { c.beginPath(); c.moveTo(15, 18); c.lineTo(25, 22); },
    estrela: (c) => { c.beginPath(); c.moveTo(20, 12); c.lineTo(20, 28); c.moveTo(12, 20); c.lineTo(28, 20); }
  };
  const TIPOS = ["picole", "picole", "casquinha", "bola", "granulado", "granulado", "granulado", "estrela"];

  let W = 0, H = 0, dpr = 1, itens = [], rolagem = scrollY, dedo = null, ultimo = 0, rodando = false;

  function criar() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const n = Math.round(Math.min(34, Math.max(16, (W * H) / 30000)));
    itens = Array.from({ length: n }, (_, i) => {
      const tipo = TIPOS[i % TIPOS.length];
      const peq = tipo === "granulado" || tipo === "estrela";
      return {
        tipo, x: Math.random() * W, y: Math.random() * H,
        prof: .25 + Math.random() * .75,               // profundidade: mais perto = maior e mais rápido
        tam: (peq ? .55 : .9) + Math.random() * .5,
        ang: (Math.random() - .5) * 1.2, giro: (Math.random() - .5) * .004,
        vy: -(.06 + Math.random() * .12), fase: Math.random() * 6.28,
        cor: CORES[i % CORES.length], ex: 0, ey: 0
      };
    });
  }

  function desenhar(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const dt = Math.min(50, t - (ultimo || t)); ultimo = t;
    for (const p of itens) {
      if (!calmo.matches) {
        p.y += p.vy * dt * p.prof;
        p.ang += p.giro * dt;
        // foge do dedo
        if (dedo) {
          const dx = p.x + p.ex - dedo.x, dy = p.y + p.ey - dedo.y, d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) { const f = (1 - Math.sqrt(d2) / 140) * 2.2; const d = Math.sqrt(d2) || 1; p.ex += dx / d * f; p.ey += dy / d * f; p.giro += (Math.random() - .5) * .0008; }
        }
        p.ex *= .965; p.ey *= .965;
        p.giro *= .995; if (Math.abs(p.giro) < .0005) p.giro = (Math.random() - .5) * .002;
      }
      // profundidade com a rolagem
      let y = p.y - rolagem * .18 * p.prof;
      y = ((y % (H + 80)) + H + 80) % (H + 80) - 40;
      const x = p.x + p.ex + Math.sin(t / 2200 + p.fase) * 8 * p.prof;
      const s = p.tam * (.7 + p.prof * .6);
      ctx.save();
      ctx.translate(x, y + p.ey); ctx.rotate(p.ang); ctx.scale(s, s); ctx.translate(-20, -20);
      ctx.globalAlpha = .16 + p.prof * .24;
      ctx.lineWidth = p.tipo === "granulado" ? 4 : 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = p.cor;
      FORMAS[p.tipo](ctx); ctx.stroke();
      ctx.restore();
    }
    if (!calmo.matches && !document.hidden) requestAnimationFrame(desenhar); else rodando = false;
  }
  function iniciar() { if (!rodando) { rodando = true; ultimo = 0; requestAnimationFrame(desenhar); } }

  criar(); iniciar();
  addEventListener("resize", () => { const h = H; criar(); if (calmo.matches || Math.abs(innerHeight - h) > 0) iniciar(); });
  addEventListener("scroll", () => { rolagem = scrollY; if (calmo.matches) requestAnimationFrame(desenhar); }, { passive: true });
  const mexe = (e) => { const q = e.touches ? e.touches[0] : e; if (q) dedo = { x: q.clientX, y: q.clientY }; };
  addEventListener("pointermove", mexe, { passive: true });
  addEventListener("touchmove", mexe, { passive: true });
  addEventListener("pointerdown", mexe, { passive: true });
  ["pointerup", "pointerleave", "touchend", "blur"].forEach((ev) => addEventListener(ev, () => { dedo = null; }, { passive: true }));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) iniciar(); });
  calmo.addEventListener?.("change", iniciar);
})();
