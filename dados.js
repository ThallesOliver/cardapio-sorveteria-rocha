/* =========================================================
   DADOS DO CARDÁPIO — edite aqui sem mexer no layout.
   Preços e sabores abaixo são EXEMPLOS: troque pelos reais.
   ========================================================= */

window.CONFIG = {
  nome: "Sorvetes Rocha",
  slogan: "A original desde 1947",
  instagram: "https://www.instagram.com/rocha.sorvetes/",
  telefone: "(12) 3892-3629",
  endereco: "Av. Dr. Altino Arantes, 90 — Centro Histórico, São Sebastião/SP",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sorveteria+Rocha+Av.+Dr.+Altino+Arantes+90+S%C3%A3o+Sebasti%C3%A3o+SP",
  // Horário por dia da semana (0 = domingo). null = fechado.
  horarios: {
    0: ["11:00", "22:00"],
    1: ["12:00", "21:00"],
    2: ["12:00", "21:00"],
    3: ["12:00", "21:00"],
    4: ["12:00", "21:00"],
    5: ["11:00", "23:00"],
    6: ["11:00", "23:00"]
  },
  fuso: "America/Sao_Paulo"
};

/* Sabores de massa (bolas, potes, milkshake).
   tags: fruta, cremoso, classico, sem-lactose, zero
   estacao: true mostra o selo "Da estação"
   esgotado: true mostra o sabor riscado com "Esgotado hoje"
   casa: true mostra o selo "Especialidade da casa" */
window.SABORES = [
  { id: "palha-italiana", nome: "Palha italiana", cor: "#9C6B3F", tags: ["cremoso", "classico"], casa: true },
  { id: "coco-queimado", nome: "Coco queimado", cor: "#C9965A", tags: ["cremoso", "classico"] },
  { id: "coco-branco", nome: "Coco branco", cor: "#F6F2E7", tags: ["cremoso", "classico"] },
  { id: "milho-verde", nome: "Milho verde", cor: "#F3D46B", tags: ["cremoso", "classico"] },
  { id: "abacaxi", nome: "Abacaxi", cor: "#F4E07A", tags: ["fruta", "sem-lactose", "classico"] },
  { id: "maracuja", nome: "Maracujá", cor: "#F1C232", tags: ["fruta", "classico"] },
  { id: "morango", nome: "Morango", cor: "#F08CA0", tags: ["fruta"] },
  { id: "manga", nome: "Manga", cor: "#F4A53A", tags: ["fruta", "sem-lactose"] },
  { id: "limao", nome: "Limão", cor: "#CFE6A2", tags: ["fruta", "sem-lactose"] },
  { id: "graviola", nome: "Graviola", cor: "#EEF0E0", tags: ["fruta"] },
  { id: "jabuticaba", nome: "Jabuticaba", cor: "#3B1F3A", tags: ["fruta"] },
  { id: "jaca", nome: "Jaca", cor: "#E9C46A", tags: ["fruta"] },
  { id: "uva", nome: "Uva", cor: "#8E5A9B", tags: ["fruta", "sem-lactose"] },
  { id: "ameixa", nome: "Ameixa", cor: "#7A3457", tags: ["cremoso", "classico"] },
  { id: "creme", nome: "Creme holandês", cor: "#F3E2B3", tags: ["cremoso"] },
  { id: "flocos", nome: "Flocos", cor: "#EFE8DA", tags: ["cremoso"] },
  { id: "chocolate", nome: "Chocolate", cor: "#6B3E26", tags: ["cremoso"] },
  { id: "doce-de-leite", nome: "Doce de leite", cor: "#C98A4B", tags: ["cremoso"] },
  { id: "pistache", nome: "Pistache", cor: "#B5C98A", tags: ["cremoso"] },
  { id: "chocolate-zero", nome: "Chocolate zero açúcar", cor: "#5A3420", tags: ["cremoso", "zero"] }
];

window.PICOLES_FRUTA = [
  { id: "p-limao", nome: "Limão", cor: "#CFE6A2" },
  { id: "p-abacaxi", nome: "Abacaxi", cor: "#F4E07A" },
  { id: "p-morango", nome: "Morango", cor: "#F08CA0" },
  { id: "p-maracuja", nome: "Maracujá", cor: "#F1C232" },
  { id: "p-uva", nome: "Uva", cor: "#8E5A9B" },
  { id: "p-groselha", nome: "Groselha", cor: "#D7263D" },
  { id: "p-manga", nome: "Manga", cor: "#F4A53A" },
  { id: "p-tamarindo", nome: "Tamarindo", cor: "#8B5A2B" }
];

window.PICOLES_CREMOSOS = [
  { id: "p-coco", nome: "Coco", cor: "#F6F2E7" },
  { id: "p-coco-queimado", nome: "Coco queimado", cor: "#C9965A" },
  { id: "p-coco-zero", nome: "Coco zero açúcar", cor: "#F6F2E7" },
  { id: "p-chocolate-zero", nome: "Chocolate zero açúcar", cor: "#5A3420" },
  { id: "p-milho", nome: "Milho verde", cor: "#F3D46B" },
  { id: "p-abacate", nome: "Abacate", cor: "#B8D08A" },
  { id: "p-leite-ninho", nome: "Leite ninho", cor: "#FAF5E8" },
  { id: "p-chocolate", nome: "Chocolate", cor: "#6B3E26" },
  { id: "p-morango-leite", nome: "Morango com leite condensado", cor: "#F4B3C0" }
];

window.ADICIONAIS_SORVETE = [
  { id: "calda-choc", nome: "Calda de chocolate", preco: 2 },
  { id: "calda-morango", nome: "Calda de morango", preco: 2 },
  { id: "chantilly", nome: "Chantilly", preco: 2.5 },
  { id: "granulado", nome: "Granulado", preco: 1.5 },
  { id: "castanha", nome: "Castanha de caju", preco: 3 }
];

window.ADICIONAIS_ACAI = [
  { id: "banana", nome: "Banana", preco: 0 },
  { id: "morango-f", nome: "Morango", preco: 0 },
  { id: "granola", nome: "Granola", preco: 0 },
  { id: "leite-po", nome: "Leite em pó", preco: 0 },
  { id: "leite-cond", nome: "Leite condensado", preco: 0 },
  { id: "pacoca", nome: "Paçoca", preco: 0 },
  { id: "nutella", nome: "Creme de avelã", preco: 4 },
  { id: "kiwi", nome: "Kiwi", preco: 3 }
];

/* Categorias e itens.
   opcoes.sabores: { de: "SABORES" | "PICOLES_FRUTA" | "PICOLES_CREMOSOS", min, max, repetir }
     - de "SABORES": o item mostra quantas bolas/sabores leva (ex.: "2 bolas, sabores à escolha")
     - de "PICOLES_...": os sabores aparecem listados embaixo do item
     - repetir: true = conta como bolas (pode repetir o sabor)
   opcoes.adicionais: "ADICIONAIS_SORVETE" | "ADICIONAIS_ACAI" (a lista aparece no fim da categoria)
   opcoes.gratis: quantos acompanhamentos de preço 0 já vêm inclusos (açaí)
   foto: { src, alt } mostra uma foto no topo da categoria (arquivos na pasta fotos/) */
window.CATEGORIAS = [
  {
    id: "massa",
    nome: "Copos e casquinhas",
    nota: "Escolha entre os sabores de massa do dia.",
    itens: [
      { id: "copo1", nome: "Copinho 1 bola", preco: 9, cor: "#F3D46B", opcoes: { sabores: { de: "SABORES", min: 1, max: 1, repetir: true }, adicionais: "ADICIONAIS_SORVETE" } },
      { id: "copo2", nome: "Copinho 2 bolas", preco: 15, cor: "#C9965A", opcoes: { sabores: { de: "SABORES", min: 2, max: 2, repetir: true }, adicionais: "ADICIONAIS_SORVETE" } },
      { id: "copo3", nome: "Copo 3 bolas", preco: 20, cor: "#F08CA0", opcoes: { sabores: { de: "SABORES", min: 3, max: 3, repetir: true }, adicionais: "ADICIONAIS_SORVETE" } },
      { id: "casq1", nome: "Casquinha 1 bola", preco: 10, cor: "#F4E07A", opcoes: { sabores: { de: "SABORES", min: 1, max: 1, repetir: true } } },
      { id: "casq2", nome: "Cascão 2 bolas", preco: 17, cor: "#C98A4B", opcoes: { sabores: { de: "SABORES", min: 2, max: 2, repetir: true } } }
    ]
  },
  {
    id: "fruta",
    nome: "Picolés de fruta",
    nota: "Feitos com fruta de verdade.",
    foto: { src: "fotos/fruta.jpg", alt: "Picolés de fruta coloridos sobre fundo amarelo" },
    itens: [
      { id: "picole-fruta", nome: "Picolé de fruta", desc: "Sabores de hoje:", preco: 6, cor: "#CFE6A2", tags: ["fruta", "sem-lactose"], opcoes: { sabores: { de: "PICOLES_FRUTA", min: 1, max: 1 } } }
    ]
  },
  {
    id: "cremosos",
    nome: "Picolés cremosos",
    foto: { src: "fotos/cremosos.jpg", alt: "Picolés recheados com cobertura de chocolate empilhados" },
    itens: [
      { id: "picole-cremoso", nome: "Picolé cremoso", desc: "Sabores de hoje:", preco: 8, cor: "#C9965A", tags: ["cremoso", "zero"], opcoes: { sabores: { de: "PICOLES_CREMOSOS", min: 1, max: 1 } } },
      { id: "picole-recheado", nome: "Picolé recheado de coco queimado", desc: "Casquinha de chocolate e recheio cremoso", preco: 10, cor: "#8A5A35", tags: ["cremoso", "classico"] }
    ]
  },
  {
    id: "potes",
    nome: "Potes para levar",
    nota: "Com os sabores de massa do dia.",
    itens: [
      { id: "pote1", nome: "Pote 1 litro", preco: 32, cor: "#F6F2E7", opcoes: { sabores: { de: "SABORES", min: 1, max: 2 } } },
      { id: "pote15", nome: "Pote 1,5 litro", preco: 42, cor: "#F3D46B", opcoes: { sabores: { de: "SABORES", min: 1, max: 3 } } },
      { id: "pote2", nome: "Pote 2 litros", preco: 52, cor: "#C9965A", opcoes: { sabores: { de: "SABORES", min: 1, max: 3 } } }
    ]
  },
  {
    id: "acai",
    nome: "Açaí",
    itens: [
      { id: "acai300", nome: "Açaí 300 ml", preco: 22, cor: "#4B1F3E", opcoes: { adicionais: "ADICIONAIS_ACAI", gratis: 3 } },
      { id: "acai500", nome: "Açaí 500 ml", preco: 28, cor: "#4B1F3E", opcoes: { adicionais: "ADICIONAIS_ACAI", gratis: 3 } },
      { id: "acai700", nome: "Açaí 700 ml", preco: 36, cor: "#4B1F3E", opcoes: { adicionais: "ADICIONAIS_ACAI", gratis: 3 } }
    ]
  },
  {
    id: "especiais",
    nome: "Taças e especiais",
    itens: [
      { id: "taca-rocha", nome: "Taça Rocha", desc: "3 bolas, calda quente, chantilly e castanha de caju", preco: 27, cor: "#1F4E8C", opcoes: { sabores: { de: "SABORES", min: 3, max: 3, repetir: true } } },
      { id: "banana-split", nome: "Banana split", desc: "Banana, 3 bolas, caldas e chantilly", preco: 29, cor: "#F2E3A0", opcoes: { sabores: { de: "SABORES", min: 3, max: 3, repetir: true } } },
      { id: "sundae", nome: "Sundae", desc: "2 bolas com calda à escolha", preco: 19, cor: "#6B3E26", opcoes: { sabores: { de: "SABORES", min: 2, max: 2, repetir: true }, adicionais: "ADICIONAIS_SORVETE" } }
    ]
  },
  {
    id: "bebidas",
    nome: "Milkshakes e bebidas",
    itens: [
      { id: "shake400", nome: "Milkshake 400 ml", preco: 20, cor: "#F4B3C0", opcoes: { sabores: { de: "SABORES", min: 1, max: 1 } } },
      { id: "shake500", nome: "Milkshake 500 ml", preco: 24, cor: "#F4B3C0", opcoes: { sabores: { de: "SABORES", min: 1, max: 1 } } },
      { id: "agua", nome: "Água mineral 500 ml", preco: 4, cor: "#CFE3F2" },
      { id: "refri", nome: "Refrigerante lata", preco: 6, cor: "#B8312F" },
      { id: "cafe", nome: "Café espresso", preco: 6, cor: "#4A2C1A" }
    ]
  }
];
