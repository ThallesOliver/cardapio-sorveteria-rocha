"""Monta o site em ./public e gera a imagem de prévia (og.png) e o ícone (icone.png).
Roda na Vercel a cada publicação. Não precisa mexer aqui para trocar preços ou sabores."""
import os, shutil, urllib.request
from PIL import Image, ImageDraw, ImageFont

OUT = "public"
ARQUIVOS = ["index.html", "styles.css", "app.js", "dados.js"]
BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
FONTES = {
    "Caslon.ttf": BASE + "librecaslondisplay/LibreCaslonDisplay-Regular.ttf",
    "Figtree.ttf": BASE + "figtree/Figtree%5Bwght%5D.ttf",
}
MARINHO = (29, 58, 102); PAPEL = (250, 250, 248); OURO = (168, 123, 42)
TINTA = (28, 34, 48); SUAVE = (100, 107, 120); BRANCO = (255, 255, 255)

os.makedirs(OUT, exist_ok=True)
for a in ARQUIVOS:
    shutil.copy(a, os.path.join(OUT, a))

os.makedirs("/tmp/fontes", exist_ok=True)
for nome, url in FONTES.items():
    destino = "/tmp/fontes/" + nome
    if not os.path.exists(destino):
        urllib.request.urlretrieve(url, destino)
SERIF, SANS = "/tmp/fontes/Caslon.ttf", "/tmp/fontes/Figtree.ttf"


def sans(tam, peso):
    f = ImageFont.truetype(SANS, tam)
    f.set_variation_by_axes([peso])
    return f


def centro(d, w, y, texto, f, cor):
    bb = d.textbbox((0, 0), texto, font=f)
    d.text(((w - (bb[2] - bb[0])) // 2 - bb[0], y - bb[1]), texto, font=f, fill=cor)
    return bb[3] - bb[1]


def faixa(d, w, alto, listra):
    for i, x in enumerate(range(0, w + listra, listra)):
        d.rectangle([x, 0, x + listra, alto], fill=MARINHO if i % 2 == 0 else BRANCO)


# ---------- og.png (1200x630) ----------
W, H = 1200, 630
og = Image.new("RGB", (W, H), PAPEL)
d = ImageDraw.Draw(og)
faixa(d, W, 18, 36)
centro(d, W, 150, "Sorveteria", sans(36, 500), SUAVE)
centro(d, W, 205, "Rocha", ImageFont.truetype(SERIF, 190), MARINHO)
centro(d, W, 405, "Desde 1947, no Centro Histórico de São Sebastião", ImageFont.truetype(SERIF, 38), TINTA)
d.line([(W // 2 - 40, 480), (W // 2 + 40, 480)], fill=OURO, width=2)
centro(d, W, 515, "Cardápio, sabores do dia e horário", sans(32, 500), SUAVE)
og.save(os.path.join(OUT, "og.png"), optimize=True)

# ---------- icone.png (180x180, tela inicial do celular) ----------
ic = Image.new("RGB", (180, 180), MARINHO)
d = ImageDraw.Draw(ic)
centro(d, 180, 38, "R", ImageFont.truetype(SERIF, 130), BRANCO)
ic.save(os.path.join(OUT, "icone.png"), optimize=True)

print("site montado em", OUT, "com og.png e icone.png")
