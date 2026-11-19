---
name: Nick News
description: Games, rádio, tecnologia e o que mais acontecer por aqui — um blog pessoal em vidro sobre neon.
colors:
  night-canvas: "#0b1030"
  cobalt-glow: "#2f4bff"
  hot-magenta: "#ff3d8b"
  signal-cyan: "#00c2ff"
  amber-flare: "#ff9f1c"
  ultraviolet: "#8b3dff"
  text-white: "#ffffff"
  text-soft: "rgba(255,255,255,.84)"
  text-faint: "rgba(255,255,255,.68)"
  glass-clear: "rgba(16,20,50,.46)"
  glass-deep: "rgba(22,26,52,.6)"
  glass-fallback: "rgba(30,36,80,.88)"
  ink-on-white: "#141a3c"
  link-sky: "#9fdcff"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI Variable', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(3.4rem, 13vw, 8.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI Variable', 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI Variable', 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "clamp(1.05rem, 2.4vw, 1.25rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI Variable', 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "clamp(1.05rem, 2.2vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI Variable', 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  code: "6px"
  tile: "16px"
  md: "18px"
  lg: "24px"
  xl: "32px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  page: "clamp(16px, 4vw, 32px)"
components:
  button-primary:
    backgroundColor: "{colors.text-white}"
    textColor: "{colors.ink-on-white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  button-glass:
    backgroundColor: "rgba(255,255,255,.18)"
    textColor: "{colors.text-white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  button-glass-hover:
    backgroundColor: "rgba(255,255,255,.26)"
  pill:
    backgroundColor: "rgba(255,255,255,.14)"
    textColor: "{colors.text-white}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  segment-active:
    backgroundColor: "{colors.text-white}"
    textColor: "{colors.ink-on-white}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
  segment-idle:
    textColor: "{colors.text-soft}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
  search-field:
    backgroundColor: "{colors.glass-clear}"
    textColor: "{colors.text-white}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "48px"
  card-glass:
    backgroundColor: "{colors.glass-clear}"
    rounded: "{rounded.xl}"
    padding: "8px"
  article-sheet:
    backgroundColor: "{colors.glass-deep}"
    textColor: "{colors.text-white}"
    rounded: "{rounded.xl}"
    padding: "clamp(24px, 5vw, 52px)"
  number-tile:
    backgroundColor: "rgba(255,255,255,.16)"
    textColor: "{colors.text-white}"
    rounded: "{rounded.tile}"
    size: "clamp(48px, 9vw, 60px)"
---

# Design System: Nick News

## Overview

**Creative North Star: "Vidro sobre neon"**

Nick News é um blog pessoal que se comporta como a tela de um celular moderno: um papel de parede escuro onde cinco manchas de cor viva (cobalto, magenta, ciano, âmbar e ultravioleta) brilham desfocadas, e por cima delas flutuam placas de vidro translúcido que carregam todo o conteúdo. A cor nunca está no texto nem nos botões; ela mora atrás do vidro e chega filtrada. Isso deixa a página viva sem ficar barulhenta.

A densidade é baixa e generosa: títulos enormes e apertados, listas com bastante respiro, uma coluna de leitura de no máximo 760px. Cada notícia tem um número fixo que vira elemento gráfico (o número gigante do destaque, os ladrilhos numerados da lista), herança do conceito de "canais" de um sintonizador. Os componentes são lisos e confiantes: formas de pílula, brilho suave que acompanha o dedo, sensação de controle nativo do sistema.

Ele rejeita explicitamente três caminhos: a cara de portal de notícias (banners, colunas apertadas, propaganda), o fundo branco corporativo e sem cor, e o visual gamer exagerado (RGB piscando, fontes agressivas, neon em tudo).

**Key Characteristics:**
- Fundo noturno fixo com cinco manchas de cor desfocadas (60px) que nunca rolam.
- Todo conteúdo vive em vidro: base noturna translúcida a 46% com véu sobre o neon, desfoque de 22px com saturação 180%, bordas de luz internas.
- Texto sempre branco; hierarquia por opacidade (100% / 84% / 68%), não por cor.
- Formas de pílula para tudo que é tocável; cantos de 18–32px para superfícies.
- Fonte do sistema (SF Pro / Segoe UI Variable), sem fontes externas.
- Números das notícias como protagonistas visuais.

## Colors

Uma noite azul-marinho profunda iluminada por trás por cinco luzes de neon; na frente, só branco em diferentes opacidades.

### Primary
- **Noite Profunda** (#0b1030): o canvas de tudo. Fundo do `html`, da `.wall`, cor do tema do navegador. Também a vinheta radial que escurece as bordas inferiores.

### Secondary (luzes de fundo — só na `.wall`)
- **Cobalto** (#2f4bff): a maior mancha, canto superior esquerdo.
- **Magenta Quente** (#ff3d8b): canto superior direito.
- **Ciano Sinal** (#00c2ff): base, à esquerda.
- **Âmbar** (#ff9f1c): base, à direita.
- **Ultravioleta** (#8b3dff): centro, opacidade 0.7.

### Neutral
- **Branco** (#ffffff): todo texto principal, título, botão primário (fundo), anel de foco.
- **Branco Suave** (rgba(255,255,255,.84)): resumos, metadados, links de navegação em repouso.
- **Branco Apagado** (rgba(255,255,255,.68)): placeholder.
- **Vidro Claro** (rgba(16,20,50,.46)): fundo padrão de toda superfície `.glass`. É uma base noturna translúcida, não branca: segura texto pequeno sobre o neon.
- **Vidro Fundo** (rgba(22,26,52,.6)): a folha da notícia, mais escura para leitura longa.
- **Tinta** (#141a3c): texto sobre o botão branco primário.
- **Céu** (#9fdcff): links dentro do texto da notícia, o único texto colorido do sistema.

### Named Rules
**A Regra da Cor Atrás do Vidro.** As cinco cores neon só existem na `.wall`. Nunca aplique cobalto, magenta, ciano, âmbar ou ultravioleta em texto, borda, botão ou ícone; a cor chega ao conteúdo apenas filtrada pelo vidro.

**A Regra do Branco em Camadas.** Hierarquia de texto é feita com opacidade de branco (100 / 92 / 84 / 68%), nunca com cinza sólido nem com cor. Texto direto sobre o neon (sem vidro) usa no mínimo 92%.

**A Regra do Véu.** Um véu noturno de 24% fica sobre as manchas da `.wall`, e todo texto precisa passar 4,5:1 (3:1 se grande) contra o pixel mais claro embaixo dele, medido com `.impeccable/review/contrast.js`. Se uma cor reprovar, escureça o vidro antes de apagar o neon.

## Typography

**Display Font:** pilha do sistema (SF Pro Display, Segoe UI Variable, Roboto, Arial)
**Body Font:** a mesma pilha do sistema
**Label/Mono Font:** ui-monospace, Consolas (só para `code` dentro do texto)

**Character:** Uma única família nativa usada em pesos extremos: 800 bem apertado (-0.035 a -0.06em) para títulos e números, 400 arejado (line-height 1.7) para leitura. Parece parte do sistema operacional, não um site.

### Hierarchy
- **Display** (800, clamp(3.4rem, 13vw, 8.5rem), 0.9): o "Nick News" do topo da home. Títulos de página usam a variante clamp(2.8rem, 10vw, 5.5rem). Os números gigantes (até 11rem, -0.06em) são da mesma família.
- **Headline** (800, clamp(2rem, 6vw, 3.2rem), 1.05): título da notícia. O destaque da home usa 750, até 2.6rem.
- **Title** (700, clamp(1.05rem, 2.4vw, 1.25rem), 1.25): títulos dos itens da lista; cabeçalhos de seção em 750, até 1.8rem.
- **Body** (400, clamp(1.05rem, 2.2vw, 1.15rem), 1.7): texto da notícia, máximo de 65ch por linha, branco a 92%.
- **Label** (600, 0.85–0.95rem): pílulas, navegação, botões, filtros, data.

### Named Rules
**A Regra do Peso Extremo.** Títulos ficam em 750–800 com espaçamento negativo; texto corrido em 400. Não use pesos intermediários (500–600) em títulos.

## Layout

Coluna central de no máximo 1080px (`.page`), com margem lateral fluida clamp(16px, 4vw, 32px). A notícia aberta estreita para 760px e o parágrafo para 65ch. No desktop a barra de navegação flutua no topo, centralizada (14px do topo); o conteúdo começa 76px abaixo para não ficar sob ela.

Abaixo de 720px a barra vira uma barra de abas no rodapé, estilo iPhone (largura até 420px, 12px acima da área segura), o nome "Nick News" some e os ícones aparecem com rótulos de 0.72rem. O destaque (número ao lado do texto, `auto 1fr`) passa a uma coluna, com o número em cima. Abaixo de 720px o nome "Nick News" aparece no topo das páginas de lista (nas notícias, o botão "voltar" ocupa esse lugar), e em telas baixas a barra de abas mostra só ícones.

Ritmo: espaços de 8–10px entre controles, 14–24px entre elementos de um bloco, clamp(36px, 6vw, 64px) entre seções. A página reserva 120px no fim para a barra de abas não cobrir o rodapé.

## Elevation & Depth

A profundidade vem do vidro, não da sombra. Cada superfície é uma placa translúcida com `backdrop-filter: saturate(180%) blur(22px)` sobre o fundo colorido, com linhas de luz internas que simulam a espessura da borda: mais forte em cima, quase nada embaixo. Uma única sombra externa, larga e azulada, solta a placa do fundo. Um reflexo radial de 260px segue o ponteiro (`--mx`, `--my`), atualizado no máximo uma vez por quadro e desligado quando o usuário pede menos movimento.

### Shadow Vocabulary
- **Borda de vidro** (`box-shadow: inset 0 1px 0 rgba(255,255,255,.38), inset 0 -1px 0 rgba(255,255,255,.08), inset 1px 0 0 rgba(255,255,255,.12), inset -1px 0 0 rgba(255,255,255,.06), 0 18px 50px rgba(5,8,30,.28)`): toda `.glass`.
- **Brilho de controle** (`box-shadow: inset 0 1px 0 rgba(255,255,255,.45)`): pílulas, segmento ativo, aba ativa, ladrilho numerado.
- **Elevação do botão primário** (`box-shadow: 0 6px 20px rgba(5,8,30,.25)`): só no botão branco.

### Named Rules
**A Regra da Luz de Cima.** A luz sempre vem de cima: a borda superior interna é a mais clara. Nunca inverta nem adicione brilho colorido em volta de elementos.

**A Regra do Fallback Sólido.** Onde o navegador não tem `backdrop-filter`, o vidro vira um azul sólido rgba(30,36,80,.88). O texto nunca pode ficar sobre o fundo colorido sem uma placa.

## Shapes

Tudo que se toca é pílula (999px): barra de navegação, abas, botões, filtros, busca, etiquetas, voltar. Superfícies grandes usam cantos generosos: 32px para lista, destaque e folha da notícia; 24px para o vidro padrão e capas; 18px para itens da lista, citações, imagens e vídeos; 16px para o ladrilho numerado; 6px só para `code`. Não há bordas visíveis além das linhas de luz e do divisor de 1px a 10% entre itens da lista.

## Components

### Buttons
Lisos e confiantes, com cara de controle nativo.
- **Shape:** pílula (999px), altura mínima de 46px.
- **Primary:** fundo branco, texto Tinta (#141a3c), peso 650, padding 0 20px, sombra de elevação. Uma ação primária por tela ("Copiar link").
- **Glass (secundário):** fundo branco a 18% com brilho de controle; hover sobe para 26%.
- **Focus:** anel branco de 3px com 3px de afastamento (global).

### Chips (pílulas)
- **Style:** branco a 14%, brilho de controle, texto branco 600 em 0.85rem, padding 5px 12px. Marcam o assunto.
- **Plain:** sem fundo, branco suave, peso 500. Usada para data e tempo de leitura.

### Segmented filter
- **Style:** trilho de vidro em pílula com padding de 5px; botões sem fundo em branco suave.
- **State:** ativo vira pílula branca com texto Tinta (`aria-pressed="true"`), igual ao botão primário. Rola na horizontal sem barra quando não cabe.

### Inputs / Fields
- **Style:** a busca é uma pílula de vidro de 48px de altura com ícone de lupa a 70%; o input em si é transparente.
- **Focus:** anel branco a 55% de 3px em volta da pílula inteira (`:focus-within`).

### Cards / Containers
- **Corner Style:** 32px (lista, destaque, folha), 24px (vidro padrão).
- **Background:** Vidro Claro; a folha de leitura usa Vidro Fundo para mais contraste.
- **Shadow Strategy:** Borda de vidro (ver Elevation).
- **Internal Padding:** lista 8px; destaque clamp(22px, 4vw, 44px); folha clamp(24px, 5vw, 52px).

### Navigation
- **Desktop:** pílula de vidro flutuante centralizada no topo, nome "Nick News" em 800, links em branco suave 600; hover em branco com fundo a 10%; ativo em branco com fundo a 22% e brilho de controle.
- **Celular (≤720px):** barra de abas no rodapé com ícone de 24px sobre rótulo de 0.72rem; o nome some. Só duas abas: Início e Notícias.

### Lista numerada (signature)
Cada linha é um grid `ladrilho | texto`, com a pílula de assunto e a data curta ("5 nov") numa linha logo abaixo do resumo, em qualquer largura. O ladrilho é um quadrado de clamp(48px, 9vw, 60px) com o número em 800, fundo branco a 16% e brilho de controle, centralizado nas duas linhas (no celular, alinhado ao topo). Hover (só com mouse) pinta a linha inteira com branco a 10%. Divisores de 1px a 10% entre itens. Na home, a lista "Mais notícias" nunca repete a notícia do destaque.

### Número gigante (signature)
O número da notícia em 800, -0.06em, line-height 0.8, até 11rem no destaque e 7rem na folha, com um degradê vertical de branco sólido para branco a 30–35%. É decorativo (`aria-hidden`) e é o único uso de degradê em texto do sistema.

### Citação
Bloco de vidro de 18px com branco a 12%, texto em 700 a 1.3rem. Serve para a frase de efeito da notícia, não para citações longas.

## Do's and Don'ts

### Do:
- **Do** coloque todo conteúdo dentro de uma placa `.glass` sobre a `.wall`; o fundo colorido nunca fica atrás de texto solto, exceto o título display e o subtítulo da home.
- **Do** use opacidades de branco (100 / 92 / 84 / 68%) para a hierarquia de texto, e meça o contraste contra o neon.
- **Do** use pílulas (999px) para qualquer coisa tocável e cantos de 18–32px para superfícies.
- **Do** mostre o número da notícia como elemento gráfico; ele é o link permanente e a identidade de cada post.
- **Do** mantenha a fonte do sistema e os títulos em 750–800 com espaçamento negativo.
- **Do** respeite `prefers-reduced-motion`: sem transições e sem reflexo seguindo o ponteiro.

### Don't:
- **Don't** faça parecer portal de notícias: nada de banners, colunas laterais apertadas, blocos de propaganda ou grades densas de manchetes.
- **Don't** use fundo branco ou claro como superfície principal; o sistema é noturno.
- **Don't** caia no visual gamer: nada de RGB animado, cores neon em texto ou borda, brilho colorido em volta de elementos, fontes agressivas.
- **Don't** aplique as cores da `.wall` (#2f4bff, #ff3d8b, #00c2ff, #ff9f1c, #8b3dff) em componentes.
- **Don't** use degradê em texto fora do número gigante decorativo.
- **Don't** adicione fontes externas; o site carrega só a fonte do sistema.
