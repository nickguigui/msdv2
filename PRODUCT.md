# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Nerds como o próprio Nick: a galera de games (principalmente Nintendo Switch) e o pessoal de rádio (radioamadores e curiosos). Leem por diversão, na maior parte pelo celular, muitas vezes chegando por um link de notícia que alguém mandou.

## Product Purpose

Nick News é o blog pessoal do Nick: notícias e textos sobre games, rádio e tecnologia, escritos por ele. Além das notícias, o objetivo é que o próprio blog ganhe ferramentas criadas pelo Nick, feitas dentro do Nick News. Sucesso é ter um lugar dele, que a turma volta para ler, comentar e usar.

## Positioning

- Mistura de assuntos de nerd (games, rádio, tecnologia) num só lugar, sem ser um portal especializado.
- Cada notícia tem um número fixo (`/noticias/N/`) que nunca muda, fácil de falar e mandar para alguém.
- Ferramentas próprias que vivem dentro do blog, feitas pelo autor.

## Operating Context

- O Nick escreve cada notícia em `blog/posts/N.md` e roda `node blog/build.js`, que gera todo o site estático; commit e push no GitHub (`nickguigui/msdv2`) publicam pela Vercel em `nickguigui.qzz.io`.
- Os leitores encontram as notícias por links compartilhados (WhatsApp, Discord), pelo RSS (`/feed.xml`) e pela busca e filtros por assunto da página de notícias.

## Capabilities and Constraints

- Hoje: home com destaque e últimas notícias, lista com filtro por assunto e busca, página da notícia com tempo de leitura e "Copiar link"/compartilhar, RSS, sitemap e página 404.
- Site estático em HTML/CSS/JS puro, sem framework, gerado por um script Node sem dependências.
- Planejado, ainda não existe:
  - Comentários abertos: qualquer pessoa pode ler e comentar **sem criar conta**.
  - Conta opcional, que serve só para quem quiser apoiar o projeto com doação pelo LivePix (https://livepix.gg/nickguigui).
  - Ferramentas novas construídas dentro do blog. A forma de hospedar comentários e contas ainda não foi decidida.
- As pastas `tomo/`, `conversor/`, `tradutor/`, `recon/`, `invertexto/` e `ltd-save-editor-2.4.1/` são projetos separados no mesmo repositório e **não** contam como as ferramentas do Nick News. A aba Tomo foi removida do menu de propósito.
- Terminologia: "notícia" (cada post), "assunto" (categoria: Games, Rádio, Novidades...), "número" (o id fixo da notícia).

## Brand Commitments

- Nome: Nick News. Escrito pelo Nick, em primeira pessoa, tom de conversa.
- Conteúdo em grande parte em português do Brasil, mas nem tudo precisa ser.
- Sem propaganda, nunca.
- Ninguém é obrigado a criar conta para ler ou comentar.

## Evidence on Hand

- Três notícias publicadas (`blog/posts/1.md` a `3.md`); as de Games e Rádio ainda têm texto provisório ("Troque este texto...").
- Nenhuma imagem de capa, logo, depoimento ou número de audiência existe. Não inventar leitores, citações, estatísticas nem doadores.

## Product Principles

1. **Do Nick, para a turma.** Voz pessoal e opinião própria acima de cobertura completa; nunca soar como portal de notícias.
2. **Ler é livre.** Ler e comentar não exigem conta; a conta existe só para quem quer apoiar.
3. **Sem anúncio, apoio voluntário.** O projeto se sustenta por doação opcional (LivePix), nunca por propaganda ou bloqueio de conteúdo.
4. **Link que dura.** O número de uma notícia é permanente; nada pode quebrar um link já compartilhado.
5. **Celular primeiro.** Tudo precisa funcionar bem no celular, onde a maioria lê.

## Accessibility & Inclusion

Leitura principalmente pelo celular: alvos de toque confortáveis, texto legível sem zoom e respeito a "reduzir movimento" do sistema.
