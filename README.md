# Cardápio — Sorvetes Rocha

Cardápio digital dos Sorvetes Rocha (@rocha.sorvetes), desde 1947 na Av. Dr. Altino Arantes, 90, Centro Histórico de São Sebastião (SP).

No ar em: https://cardapio-sorveteria-rocha.vercel.app

O site é só para consulta e não mostra preços: apresenta o que a loja vende (picolés de fruta à base de água, picolés cremosos à base de leite, zero açúcar, especiais, sorvete de massa, taças, açaí, café e bebidas, itens para viagem) e o horário de funcionamento, com busca e filtros (sem lactose, vegano, zero açúcar).

## Como atualizar o cardápio

Tudo que muda no dia a dia fica em **`dados.js`**. Não precisa mexer no layout.

- **Horário de funcionamento:** em `CONFIG.horarios` (0 = domingo; `null` = fechado).
- **Categorias, sabores e produtos:** em `CATEGORIAS`. Categorias de picolé usam `sabores` (com `cor` e `tags`: `sem-lactose`, `vegano`, `zero`); as demais usam `itens` (`nome` e `desc`). Para marcar um sabor como acabado, use `esgotado: true`.
- **Fotos:** campo `foto` de cada categoria, apontando para a pasta `fotos/`.

Os sabores de sorvete de massa ainda não estão no site; o horário é provisório e precisa ser confirmado.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `index.html` | Estrutura da página |
| `styles.css` | Visual |
| `app.js` | Monta o cardápio a partir dos dados, busca, filtros e status aberto/fechado |
| `dados.js` | Categorias, sabores, produtos e horários |
| `build.py` | Usado na publicação: copia os arquivos para `public/` e gera a imagem de prévia do link (`og.png`) e o ícone (`icone.png`) |

## Publicação na Vercel

- Fotos: ficam na pasta `fotos/` (fotos das categorias).
- Install command: `python3 -m pip install --quiet --break-system-packages pillow`
- Build command: `python3 build.py`
- Output directory: `public`

As configurações acima também estão em `vercel.json`.

Para ver localmente sem a imagem de prévia, basta abrir `index.html` no navegador.
