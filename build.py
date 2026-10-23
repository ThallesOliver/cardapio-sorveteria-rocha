"""Monta o site em ./public e gera a imagem de prévia (og.png) e o ícone (icone.png).
Roda na Vercel a cada publicação. Não precisa mexer aqui para trocar preços ou sabores."""
import os, shutil, urllib.request
from PIL import Image, ImageDraw, ImageFont

OUT = "public"
ARQUIVOS = ["index.html", "styles.css", "app.js", "dados.js"]
PASTAS = ["fotos"]
BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
FONTES = {
    "Playfair.ttf": BASE + "playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
    "Figtree.ttf": BASE + "figtree/Figtree%5Bwght%5D.ttf",
}
CARVAO = (45, 41, 40); CREME = (247, 243, 236); AMARELO = (246, 195, 28)

os.makedirs(OUT, exist_ok=True)
for a in ARQUIVOS:
    shutil.copy(a, os.path.join(OUT, a))
for p in PASTAS:
    if os.path.isdir(p):
        shutil.copytree(p, os.path.join(OUT, p), dirs_exist_ok=True)

os.makedirs("/tmp/fontes", exist_ok=True)
for nome, url in FONTES.items():
    destino = "/tmp/fontes/" + nome
    if not os.path.exists(destino):
        urllib.request.urlretrieve(url, destino)
MARCA, SANS = "/tmp/fontes/Playfair.ttf", "/tmp/fontes/Figtree.ttf"


def fonte(path, tam, peso):
    f = ImageFont.truetype(path, tam)
    f.set_variation_by_axes([peso])
    return f


def contorno():
    """Pontos do selo (mesmo desenho do SVG do site, viewBox 440x280)."""
    def q(p0, c, p1, n=10):
        return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
                 (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1]) for t in [i / n for i in range(1, n + 1)]]
    pts = [(30, 70), (60, 70), (75, 55), (150, 55)]
    pts += q((150, 55), (158, 30), (185, 26)) + [(255, 26)] + q((255, 26), (282, 30), (290, 55))
    pts += [(365, 55), (380, 70), (410, 70), (425, 85), (425, 195), (410, 210), (380, 210), (365, 225), (290, 225)]
    pts += q((290, 225), (282, 250), (255, 254)) + [(185, 254)] + q((185, 254), (158, 250), (150, 225))
    pts += [(75, 225), (60, 210), (30, 210), (15, 195), (15, 85)]
    return pts


def selo(img, cx, cy, escala):
    """Desenha o selo da marca centrado em (cx, cy)."""
    k = escala
    ox, oy = cx - 220 * k, cy - 140 * k
    P = lambda x, y: (ox + x * k, oy + y * k)
    d = ImageDraw.Draw(img)
    d.polygon([P(x, y) for x, y in contorno()], fill=CARVAO)
    borda = [P(13.2 + x * .94, 8.4 + y * .94) for x, y in contorno()]
    d.line(borda + [borda[0]], fill=CREME, width=max(2, round(2 * k)), joint="curve")
    w = max(2, round(2 * k))
    for (x, y) in [(-7, -4), (7, -4), (0, -13)]:
        a, b = P(220 + x - 6, 52 + y - 6), P(220 + x + 6, 52 + y + 6)
        d.ellipse([a, b], outline=CREME, width=w)
    d.polygon([P(209, 53), P(220, 76), P(231, 53)], outline=CREME, width=w)
    for x1, x2, y in [(78, 150, 100), (290, 362, 100), (110, 330, 196)]:
        d.line([P(x1, y), P(x2, y)], fill=CREME, width=max(1, round(1.5 * k)))
    def texto(t, y, f, esp):
        larg = sum(d.textlength(c, font=f) for c in t) + esp * k * (len(t) - 1)
        x = cx - larg / 2
        for c in t:
            d.text((x, oy + y * k), c, font=f, fill=CREME, anchor="ls")
            x += d.textlength(c, font=f) + esp * k
    texto("SORVETES", 106, fonte(SANS, round(17 * k), 600), 5)
    texto("ROCHA", 178, fonte(MARCA, round(74 * k), 900), 3)
    texto("DESDE 1947", 224, fonte(SANS, round(13 * k), 600), 3)


# ---------- og.png (1200x630) ----------
W, H = 1200, 630
X = 3  # desenha em tamanho maior e reduz, para bordas suaves
og = Image.new("RGB", (W * X, H * X), AMARELO)
selo(og, W * X // 2, 265 * X, 1.5 * X)
d = ImageDraw.Draw(og)
f = fonte(SANS, 34 * X, 600)
t = "Cardápio, sabores do dia e horário"
d.text((W * X // 2, 560 * X), t, font=f, fill=CARVAO, anchor="mm")
og = og.resize((W, H), Image.LANCZOS)
og.save(os.path.join(OUT, "og.png"), optimize=True)

# ---------- icone.png (180x180, tela inicial do celular) ----------
ic = Image.new("RGB", (180 * 4, 180 * 4), AMARELO)
selo(ic, 90 * 4, 92 * 4, .38 * 4)
ic = ic.resize((180, 180), Image.LANCZOS)
ic.save(os.path.join(OUT, "icone.png"), optimize=True)

print("site montado em", OUT, "com fotos, og.png e icone.png")
