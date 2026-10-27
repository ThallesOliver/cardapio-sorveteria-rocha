/* =========================================================
   DADOS DO CARDÁPIO — edite aqui sem mexer no layout.
   O cardápio mostra o que a loja vende, sem preços.
   ========================================================= */

window.CONFIG = {
  nome: "Sorvetes Rocha",
  instagram: "https://www.instagram.com/rocha.sorvetes/",
  telefone: "(12) 3892-3629",
  endereco: "Av. Dr. Altino Arantes, 90 — Centro Histórico, São Sebastião/SP",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sorveteria+Rocha+Av.+Dr.+Altino+Arantes+90+S%C3%A3o+Sebasti%C3%A3o+SP",
  // Horário por dia da semana (0 = domingo). null = fechado. CONFIRMAR COM A LOJA.
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

/* Categorias do cardápio (cada uma abre e fecha como um leque).
   - sabores: lista de sabores, mostrados como picolezinhos coloridos.
       tags: "sem-lactose", "vegano", "zero"
       esgotado: true mostra o sabor riscado
   - itens: lista de produtos { nome, desc }
   - foto: { src, alt } foto no topo da categoria (pasta fotos/), no formato 4:5 (ex.: 1000x1250)
   - fotos: [ { src, alt, legenda } ] várias fotos em carrossel, também 4:5
   - pacotes: { fotos, alt } embalagens recortadas que se abrem e balançam ao toque
   - leque: { pasta, alt } picolés recortados (fotos/<pasta>-1..5.webp) que abrem em leque
   - nota: frase curta abaixo do título
   - grupo: título que separa blocos de categorias
   - capa: miniatura redonda no cabeçalho (sem capa, usa um desenho) */
window.CATEGORIAS = [
  {
    id: "agua",
    grupo: "Picolés",
    capa: "fotos/capa-agua.webp",
    nome: "Picolés de fruta",
    rotulo: "Base de água",
    nota: "Feitos com fruta, à base de água. Todos sem lactose e veganos.",
    leque: { pasta: "agua", alt: "Cinco picolés de fruta Rocha abrindo em leque" },
    sabores: [
      { nome: "Abacaxi", cor: "#F4E07A", tags: ["sem-lactose", "vegano"] },
      { nome: "Açaí", cor: "#4B1F3E", tags: ["sem-lactose", "vegano"] },
      { nome: "Amora", cor: "#5B1E3A", tags: ["sem-lactose", "vegano"] },
      { nome: "Groselha", cor: "#D7263D", tags: ["sem-lactose", "vegano"] },
      { nome: "Jabuticaba", cor: "#3B1F3A", tags: ["sem-lactose", "vegano"] },
      { nome: "Limão", cor: "#CFE6A2", tags: ["sem-lactose", "vegano"] },
      { nome: "Manga", cor: "#F4A53A", tags: ["sem-lactose", "vegano"] },
      { nome: "Maracujá", cor: "#F1C232", tags: ["sem-lactose", "vegano"] },
      { nome: "Melancia", cor: "#F25C6E", tags: ["sem-lactose", "vegano"] },
      { nome: "Tangerina", cor: "#F39237", tags: ["sem-lactose", "vegano"] },
      { nome: "Uva", cor: "#8E5A9B", tags: ["sem-lactose", "vegano"] }
    ]
  },
  {
    id: "leite",
    grupo: "Picolés",
    capa: "fotos/capa-leite.webp",
    nome: "Picolés cremosos",
    rotulo: "Base de leite",
    nota: "Cremosos, feitos à base de leite.",
    leque: { pasta: "leite", alt: "Cinco picolés cremosos Rocha abrindo em leque" },
    sabores: [
      { nome: "Abacate", cor: "#B8D08A" },
      { nome: "Africano", cor: "#5A3420" },
      { nome: "Amarena", cor: "#A3243B" },
      { nome: "Amendoim", cor: "#C99A62" },
      { nome: "Banana", cor: "#F3DE8A" },
      { nome: "Bombom italiano", cor: "#7A4A2A" },
      { nome: "Brigadeiro", cor: "#4E2A1A" },
      { nome: "Chiclete", cor: "#F4A6C6" },
      { nome: "Chocolate", cor: "#6B3E26" },
      { nome: "Coco", cor: "#F6F2E7" },
      { nome: "Coco com abóbora", cor: "#F2B65A" },
      { nome: "Coco queimado", cor: "#C9965A" },
      { nome: "Coquinho", cor: "#E9DCC3" },
      { nome: "Creme", cor: "#F3E2B3" },
      { nome: "Creme do céu", cor: "#8FD3F4" },
      { nome: "Gengibre", cor: "#E8D9A8" },
      { nome: "Leite condensado", cor: "#FAF0D7" },
      { nome: "Milho verde", cor: "#F3D46B" },
      { nome: "Mini saia", cor: "#F08CA0" },
      { nome: "Morango", cor: "#F4B3C0" },
      { nome: "Palha italiana", cor: "#9C6B3F", casa: true },
      { nome: "Pistache", cor: "#B5C98A" },
      { nome: "Torta de limão", cor: "#E4EDB5" },
      { nome: "Trufado", cor: "#3E2418" },
      { nome: "Unicórnio", cor: "#C9A7E8" }
    ]
  },
  {
    id: "zero",
    grupo: "Picolés",
    capa: "fotos/capa-zero.webp",
    nome: "Picolés zero açúcar",
    rotulo: "Sem açúcar",
    pacotes: { fotos: ["fotos/zero-choco.webp", "fotos/zero-coco.webp"], alt: "Picolés Rocha Chocolate Zero e Coco Zero na embalagem" },
    sabores: [
      { nome: "Chocolate zero açúcar", cor: "#5A3420", tags: ["zero"] },
      { nome: "Coco zero açúcar", cor: "#F6F2E7", tags: ["zero"] }
    ]
  },
  {
    id: "especiais",
    grupo: "Picolés",
    nome: "Picolés especiais",
    rotulo: "Com cobertura",
    sabores: [
      { nome: "Skimo", cor: "#4E2A1A" },
      { nome: "Skimenta", cor: "#7FC8A9" },
      { nome: "Skimo doce de leite", cor: "#C98A4B" },
      { nome: "Pão de mel", cor: "#8A5A35" }
    ]
  },
  {
    id: "massa-agua",
    grupo: "Sorvetes de massa",
    nome: "Massa de fruta",
    rotulo: "Base de água",
    nota: "Feitos com fruta, à base de água. Todos sem lactose e veganos. No copinho ou no cascão, com 1 ou 2 bolas.",
    sabores: [
      { nome: "Abacaxi", cor: "#F4E07A", tags: ["sem-lactose", "vegano"] },
      { nome: "Açaí", cor: "#4B1F3E", tags: ["sem-lactose", "vegano"] },
      { nome: "Amora", cor: "#5B1E3A", tags: ["sem-lactose", "vegano"] },
      { nome: "Cupuaçu", cor: "#E9D7A6", tags: ["sem-lactose", "vegano"] },
      { nome: "Graviola", cor: "#EEF2DF", tags: ["sem-lactose", "vegano"] },
      { nome: "Limão", cor: "#CFE6A2", tags: ["sem-lactose", "vegano"] },
      { nome: "Maracujá", cor: "#F1C232", tags: ["sem-lactose", "vegano"] }
    ]
  },
  {
    id: "massa-leite",
    grupo: "Sorvetes de massa",
    capa: "fotos/capa-massa.jpg",
    nome: "Massa cremosa",
    rotulo: "Base de leite",
    nota: "No copinho ou no cascão, com 1 ou 2 bolas. Peça também a cobertura de chocolate.",
    foto: { src: "fotos/massa.jpg", alt: "Bola de sorvete com calda de chocolate e farofa de amendoim" },
    sabores: [
      { nome: "Africano", cor: "#5A3420" },
      { nome: "Amarena", cor: "#A3243B" },
      { nome: "Ameixa", cor: "#6E2B4A" },
      { nome: "Banana caramelada", cor: "#E9B865" },
      { nome: "Bombom italiano", cor: "#7A4A2A" },
      { nome: "Brigadeiro", cor: "#4E2A1A" },
      { nome: "Capuccino belga", cor: "#A07856" },
      { nome: "Caramelo com pipoca", cor: "#D9A35A" },
      { nome: "Chiclete", cor: "#F4A6C6" },
      { nome: "Chocolate", cor: "#6B3E26" },
      { nome: "Chocolate com avelã", cor: "#7B4A2E" },
      { nome: "Coco", cor: "#F6F2E7" },
      { nome: "Coco com abóbora", cor: "#F2B65A" },
      { nome: "Coco queimado", cor: "#C9965A" },
      { nome: "Cookies café", cor: "#8A6446" },
      { nome: "Creme", cor: "#F3E2B3" },
      { nome: "Creme do céu", cor: "#8FD3F4" },
      { nome: "Crocante", cor: "#D7B98A" },
      { nome: "Doce de leite", cor: "#C98A4B" },
      { nome: "Flocos", cor: "#F2EBDD" },
      { nome: "Gengibre", cor: "#E8D9A8" },
      { nome: "Groselha", cor: "#E26A86" },
      { nome: "Iogurte com amarena", cor: "#F1C7D2" },
      { nome: "Kinder Bueno", cor: "#C79A6B" },
      { nome: "Kinder Ovo", cor: "#F3E6CF" },
      { nome: "Leite condensado", cor: "#FAF0D7" },
      { nome: "Makako Loko", cor: "#9C6B3F" },
      { nome: "Menta", cor: "#A8DCC0" },
      { nome: "Mirtilo", cor: "#5F5A9E" },
      { nome: "Morango", cor: "#F4B3C0" },
      { nome: "Ninho com morango", cor: "#F7D3DA" },
      { nome: "Ninho trufado", cor: "#E7D3B6" },
      { nome: "Nozes", cor: "#B08560" },
      { nome: "Oreo", cor: "#3E3A3A" },
      { nome: "Ovomaltine", cor: "#9A6A43" },
      { nome: "Paçoca", cor: "#C99A62" },
      { nome: "Palha italiana", cor: "#9C6B3F" },
      { nome: "Pão de mel", cor: "#8A5A35" },
      { nome: "Passas ao rum", cor: "#B07A4A" },
      { nome: "Pipoca gourmet", cor: "#E8C67A" },
      { nome: "Pistache", cor: "#B5C98A" },
      { nome: "Raffaello", cor: "#F5EEDF" },
      { nome: "Sonho de valsa", cor: "#B48A6A" },
      { nome: "Torta de limão", cor: "#E4EDB5" }
    ]
  },
  {
    id: "massa-zero",
    grupo: "Sorvetes de massa",
    nome: "Massa zero açúcar",
    rotulo: "Sem açúcar",
    nota: "No copinho ou no cascão, com 1 ou 2 bolas.",
    sabores: [
      { nome: "Chocolate", cor: "#5A3420", tags: ["zero"] },
      { nome: "Coco", cor: "#F6F2E7", tags: ["zero"] },
      { nome: "Creme", cor: "#F3E2B3", tags: ["zero"] },
      { nome: "Iogurte com maracujá", cor: "#F3DE8A", tags: ["zero"] },
      { nome: "Iogurte com morango", cor: "#F4C6CF", tags: ["zero"] },
      { nome: "Morango", cor: "#F4B3C0", tags: ["zero"] },
      { nome: "Ninho trufado", cor: "#E7D3B6", tags: ["zero"] },
      { nome: "Pistache", cor: "#B5C98A", tags: ["zero"] }
    ]
  },
  {
    id: "massa-premium",
    grupo: "Sorvetes de massa",
    nome: "Linha premium",
    rotulo: "Sabores especiais",
    nota: "No copinho ou no cascão, com 1 ou 2 bolas.",
    sabores: [
      { nome: "Caramelo salgado", cor: "#C98A4B" },
      { nome: "Pistacchio premium", cor: "#9DB86A" },
      { nome: "Super Black", cor: "#1E1B1A", tags: ["sem-lactose", "vegano"] }
    ]
  },
  {
    id: "tacas",
    grupo: "Sobremesas",
    capa: "fotos/capa-tacas.jpg",
    nome: "Taças",
    rotulo: "Montadas na hora",
    fotos: [
      { src: "fotos/taca-sundae.jpg", alt: "Taça de sorvete de chocolate com chantilly, calda e farofa de amendoim" },
      { src: "fotos/taca-colorida.jpg", alt: "Taça de sorvete com chantilly, calda de morango e banana" },
      { src: "fotos/petit-gateau.jpg", alt: "Petit gâteau com bola de sorvete e calda de chocolate", legenda: "Petit gâteau" },
      { src: "fotos/milk-shake.jpg", alt: "Milk shake com chantilly e calda de chocolate" },
      { src: "fotos/tacas.jpg", alt: "Taça de sorvete com calda e farofa de amendoim" }
    ],
    itens: [
      { nome: "Colegial" },
      { nome: "Sundae" },
      { nome: "Banana split" },
      { nome: "Milk shake" },
      { nome: "Vaca preta" },
      { nome: "Petit gâteau" },
      { nome: "Brownie com sorvete" }
    ]
  },
  {
    id: "acai",
    grupo: "Sobremesas",
    nome: "Açaí",
    rotulo: "Na tigela ou no copo",
    itens: [
      { nome: "Açaí na tigela" },
      { nome: "Açaí no copo", desc: "300 ml ou 500 ml" }
    ]
  },
  {
    id: "bebidas",
    grupo: "Bebidas e para levar",
    nome: "Café e bebidas",
    rotulo: "Quente ou gelado",
    itens: [
      { nome: "Café" },
      { nome: "Água", desc: "Sem gás ou com gás" },
      { nome: "Refrigerante" },
      { nome: "Suco em lata" }
    ]
  },
  {
    id: "viagem",
    grupo: "Bebidas e para levar",
    capa: "fotos/capa-viagem.jpg",
    nome: "Para viagem",
    rotulo: "Para casa ou praia",
    foto: { src: "fotos/picoles-embalados.jpg", alt: "Picolés Rocha embalados: Chocolate Zero, Coco Zero, Coco, Groselha e Uva" },
    itens: [
      { nome: "Caixa com 12 picolés", desc: "Monte com os sabores que quiser" },
      { nome: "Isopor de sorvete", desc: "Tamanhos P, M e G" }
    ]
  }
];
