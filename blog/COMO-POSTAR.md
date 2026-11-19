# Como postar no Nick News

1. Crie `blog/posts/N.md`, onde N é o próximo número (o maior número aparece como mais recente).
2. Comece o arquivo com o cabeçalho:

```
---
titulo: Título da notícia
resumo: Uma frase que aparece na lista e na prévia do link.
assunto: Games
data: 2026-11-19
capa: assets/capas/minha-foto.jpg   (opcional)
---
```

3. Escreva o texto embaixo. Funciona:
   - parágrafo: linha em branco entre eles
   - `## Subtítulo` e `### Subtítulo menor`
   - `> citação`
   - `- item` ou `1. item` para listas
   - `**negrito**`, `*itálico*`, `` `código` ``, `[link](https://...)`
   - `![legenda](../../assets/fotos/x.jpg)` sozinho na linha vira foto com legenda
   - um bloco que começa com `<` é HTML puro (ex: vídeo do YouTube em `<iframe>`)
4. Na raiz do repositório rode `node blog/build.js`.
5. Faça commit e push. A Vercel publica sozinha.

O gerador atualiza a home, a lista, os filtros, os botões de notícia anterior/próxima,
o `feed.xml`, o `sitemap.xml` e a versão do CSS/JS. Não edite os `index.html` à mão:
eles são sobrescritos a cada build.
