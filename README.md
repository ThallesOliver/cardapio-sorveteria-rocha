# Cardápio — Sorvetes Rocha

Cardápio digital dos Sorvetes Rocha (@rocha.sorvetes), desde 1947 na Av. Dr. Altino Arantes, 90, Centro Histórico de São Sebastião (SP).

No ar em: https://cardapio-sorveteria-rocha.vercel.app

O site é só para consulta: mostra os sabores do dia, os preços, os adicionais e o horário de funcionamento, com busca e filtros (fruta, cremoso, sem lactose etc.).

## Como atualizar o cardápio

Tudo que muda no dia a dia fica em **`dados.js`**. Não precisa mexer no layout.

- **Horário de funcionamento:** em `CONFIG.horarios` (0 = domingo; `null` = fechado).
- **Sabores de massa:** em `SABORES`. Para marcar um sabor como acabado, use `esgotado: true`; para destacar, `estacao: true`.
- **Picolés:** em `PICOLES_FRUTA` e `PICOLES_CREMOSOS`.
- **Adicionais e acompanhamentos:** em `ADICIONAIS_SORVETE` e `ADICIONAIS_ACAI`.
- **Produtos e preços:** em `CATEGORIAS`.

Os sabores e preços que estão no arquivo hoje são exemplos e precisam ser trocados pelos reais.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `index.html` | Estrutura da página |
| `styles.css` | Visual |
| `app.js` | Monta o cardápio a partir dos dados, busca, filtros e status aberto/fechado |
| `dados.js` | Sabores, preços e horários |
| `build.py` | Usado na publicação: copia os arquivos para `public/` e gera a imagem de prévia do link (`og.png`) e o ícone (`icone.png`) |

## Publicação na Vercel

- Fotos: ficam na pasta `fotos/` (fotos das categorias e galeria).
- Install command: `python3 -m pip install --quiet --break-system-packages pillow`
- Build command: `python3 build.py`
- Output directory: `public`

As configurações acima também estão em `vercel.json`.

Para ver localmente sem a imagem de prévia, basta abrir `index.html` no navegador.
