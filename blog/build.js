// Gerador do Nick News.
// Uso: node blog/build.js   (na raiz do repositório)
// Lê blog/posts/N.md e escreve: index.html, noticias/index.html, noticias/N/index.html,
// 404.html, feed.xml, sitemap.xml e robots.txt.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(__dirname, 'posts');
const SITE = 'https://nickguigui.qzz.io';
const NAME = 'Nick News';
const TAGLINE = 'Games, rádio, tecnologia e o que mais acontecer por aqui.';
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

// ---------- utilidades ----------
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const write = (rel, content) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const fail = (file, msg) => { console.error(`\n✖ ${file}: ${msg}\n`); process.exit(1); };

function parseDate(str, file) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
  if (!m) fail(file, `data inválida "${str}" (use AAAA-MM-DD, ex: 2026-11-19)`);
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  return {
    iso: str,
    long: `${d} de ${MESES[mo - 1]} de ${y}`,
    short: `${d} ${MESES[mo - 1].slice(0, 3)}`,
    rfc: new Date(Date.UTC(y, mo - 1, d, 12)).toUTCString(),
  };
}

// ---------- front matter + markdown ----------
function parseFile(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!m) fail(file, 'falta o cabeçalho entre --- e ---');
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
    meta[kv[1]] = v;
  }
  return { meta, body: m[2] };
}

function inline(s) {
  // guarda trechos de código para não serem formatados
  const codes = [];
  s = esc(s).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const ext = /^https?:/.test(u) && !u.startsWith(SITE);
      return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

function markdown(src) {
  const out = [];
  for (const block of src.trim().split(/\n\s*\n/)) {
    const b = block.trim();
    if (!b) continue;
    let m;
    if (b.startsWith('<')) out.push(b); // HTML puro (vídeo do YouTube, etc.)
    else if ((m = /^(#{2,3})\s+(.*)$/.exec(b))) out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
    else if (b.startsWith('>')) out.push(`<blockquote>${inline(b.replace(/^>\s?/gm, '').replace(/\n/g, ' '))}</blockquote>`);
    else if (/^[-*]\s/.test(b)) out.push(`<ul>${b.split('\n').map(l => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`);
    else if (/^\d+\.\s/.test(b)) out.push(`<ol>${b.split('\n').map(l => `<li>${inline(l.replace(/^\d+\.\s+/, ''))}</li>`).join('')}</ol>`);
    else if ((m = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(b))) out.push(`<figure><img src="${m[2]}" alt="${esc(m[1])}" loading="lazy">${m[1] ? `<figcaption>${esc(m[1])}</figcaption>` : ''}</figure>`);
    else out.push(`<p>${inline(b).replace(/\n/g, '<br>')}</p>`);
  }
  return out.join('');
}

// ---------- carregar posts ----------
const posts = fs.readdirSync(POSTS_DIR)
  .filter(f => /^\d+\.md$/.test(f))
  .map(f => {
    const file = path.join('blog', 'posts', f);
    const { meta, body } = parseFile(path.join(POSTS_DIR, f));
    for (const k of ['titulo', 'resumo', 'assunto', 'data']) if (!meta[k]) fail(file, `falta "${k}:" no cabeçalho`);
    const words = body.replace(/<[^>]+>|[#>*`\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
    return {
      id: parseInt(f, 10),
      titulo: meta.titulo, resumo: meta.resumo, assunto: meta.assunto,
      capa: meta.capa || '',
      date: parseDate(meta.data, file),
      html: markdown(body),
      minutos: Math.max(1, Math.round(words / 200)),
    };
  })
  .sort((a, b) => b.id - a.id); // número maior = mais recente

if (!posts.length) fail('blog/posts', 'nenhum post encontrado');
const byId = new Map(posts.map(p => [p.id, p]));
const cats = [...new Set(posts.map(p => p.assunto))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

// versão do CSS/JS para o navegador baixar a nova quando mudar
const ver = crypto.createHash('sha1')
  .update(fs.readFileSync(path.join(ROOT, 'assets/style.css')))
  .update(fs.readFileSync(path.join(ROOT, 'assets/site.js')))
  .digest('hex').slice(0, 8);

// ---------- pedaços de HTML ----------
const ICON = {
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  news: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h10M7 13h10M7 17h6"/></svg>',
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
};

// rel = caminho até a raiz ("", "../", "../../" ou "/")
function page({ rel, title, description, url, current, image, type = 'website', body }) {
  const full = title === NAME ? NAME : `${title} | ${NAME}`;
  const img = image ? (/^https?:/.test(image) ? image : SITE + '/' + image.replace(/^\/+/, '')) : '';
  const nav = [
    ['', 'Início', ICON.home, 'home'],
    ['noticias/', 'Notícias', ICON.news, 'news'],
  ].map(([href, label, icon, key]) =>
    `<a href="${rel}${href || (rel ? '' : './')}"${current === key ? ' aria-current="page"' : ''}>${icon}<span>${label}</span></a>`).join('');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b1030">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
${url ? `<link rel="canonical" href="${SITE}${url}">\n` : ''}<meta property="og:site_name" content="${NAME}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${url ? `<meta property="og:url" content="${SITE}${url}">\n` : ''}${img ? `<meta property="og:image" content="${img}">\n<meta name="twitter:card" content="summary_large_image">\n` : '<meta name="twitter:card" content="summary">\n'}<meta property="og:locale" content="pt_BR">
<link rel="alternate" type="application/rss+xml" title="${NAME}" href="${rel}feed.xml">
<script>/* precisa rodar antes da primeira pintura: ao abrir uma notícia, a folha de vidro "condensa" */
addEventListener('pagereveal',e=>{if(e.viewTransition&&location.pathname.match('/noticias/[0-9]'))e.viewTransition.types.add('abrir')});</script>
<link rel="stylesheet" href="${rel}assets/style.css?v=${ver}">
</head>
<body>
<div class="wall" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
<header class="bar glass">
  <a class="brand" href="${rel || './'}">${NAME}</a>
  <nav aria-label="Principal">${nav}</nav>
</header>
<main class="page">
${body}
<footer class="foot">© ${new Date().getFullYear()} ${NAME} · <a href="${rel}feed.xml">RSS</a></footer>
</main>
<script src="${rel}assets/site.js?v=${ver}" defer></script>
</body>
</html>
`;
}

// vt(): nome de View Transition; o número da lista vira o número gigante da notícia
const vt = (name, cls) => ` style="view-transition-name:${name};view-transition-class:${cls}"`;
const listItem = (p, base, { num = true, row = false } = {}) => `<li data-cat="${esc(p.assunto)}"${row ? vt('row' + p.id, 'row') : ''}><a class="item" href="${base}${p.id}/">
  <span class="num" aria-label="Notícia ${p.id}"${num ? vt('n' + p.id, 'num') : ''}>${p.id}</span>
  <div><h3>${esc(p.titulo)}</h3><p>${esc(p.resumo)}</p></div>
  <span class="side"><span class="pill">${esc(p.assunto)}</span><span>${p.date.short}</span></span>
</a></li>`;

// ---------- páginas ----------
const top = posts[0];
write('index.html', page({
  rel: '', title: NAME, description: 'Games, rádio e tecnologia, pelo Nick.', url: '/', current: 'home',
  image: top.capa,
  body: `<section class="hero">
  <h1>${NAME}</h1>
  <p>${TAGLINE}</p>
</section>
<a class="featured glass" href="noticias/${top.id}/" aria-label="Notícia mais recente: ${esc(top.titulo)}">
  ${top.capa ? `<img class="cover" src="${esc(top.capa.replace(/^\/+/, ''))}" alt="" loading="lazy">` : `<span class="id" aria-hidden="true"${vt('n' + top.id, 'num')}>${top.id}</span>`}
  <div>
    <h2>${esc(top.titulo)}</h2>
    <p>${esc(top.resumo)}</p>
    <div class="meta"><span class="pill">${esc(top.assunto)}</span><span class="pill plain">${top.date.long}</span></div>
  </div>
</a>
<div class="section-head"><h2>Últimas notícias</h2><a href="noticias/">Ver todas</a></div>
<ol class="list glass">${posts.slice(0, 6).map(p => listItem(p, 'noticias/', { num: top.capa ? true : p !== top })).join('')}</ol>`,
}));

write('noticias/index.html', page({
  rel: '../', title: 'Notícias', description: `Todas as notícias do ${NAME}.`, url: '/noticias/', current: 'news',
  body: `<h1 class="page-title">Notícias</h1>
<div class="tools">
  <div class="seg glass" role="group" aria-label="Filtrar por assunto">${['Todas', ...cats].map((c, i) =>
    `<button type="button" data-filter="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('')}</div>
  <label class="searchbox glass">${ICON.search}<input id="search" type="search" placeholder="Buscar" aria-label="Buscar notícias"></label>
</div>
<ol class="list glass">${posts.map(p => listItem(p, '', { row: true })).join('')}
<li class="empty" id="empty" hidden>Nenhuma notícia com essa palavra. Tente outra ou toque em Todas.</li></ol>`,
}));

for (const p of posts) {
  const prev = byId.get(p.id - 1), next = byId.get(p.id + 1);
  const cover = p.capa ? `<img class="cover" src="../../${esc(p.capa.replace(/^\/+/, ''))}" alt="" loading="lazy">` : '';
  write(`noticias/${p.id}/index.html`, page({
    rel: '../../', title: p.titulo, description: p.resumo, url: `/noticias/${p.id}/`, current: 'news',
    image: p.capa, type: 'article',
    body: `<div class="article">
  <a class="back glass" href="../">${ICON.back}Notícias</a>
  <article class="sheet glass">
    ${cover}<div class="id" aria-hidden="true"${vt('n' + p.id, 'num')}>${p.id}</div>
    <h1>${esc(p.titulo)}</h1>
    <p class="lead">${esc(p.resumo)}</p>
    <div class="meta"><span class="pill">${esc(p.assunto)}</span><span class="pill plain"><time datetime="${p.date.iso}">${p.date.long}</time></span><span class="pill plain">${p.minutos} min de leitura</span></div>
    <div class="body">${p.html}</div>
    <div class="actions"><button class="btn primary" id="copy" type="button">Copiar link</button>${prev ? `<a class="btn" href="../${prev.id}/">Notícia ${prev.id}</a>` : ''}${next ? `<a class="btn" href="../${next.id}/">Notícia ${next.id}</a>` : ''}</div>
  </article>
</div>`,
  }));
}

write('404.html', page({
  rel: '/', title: 'Página não encontrada', description: 'Essa página não existe.', current: '',
  body: `<section class="hero">
  <h1>Ops, nada aqui</h1>
  <p>Essa página não existe ou mudou de lugar. <a href="/noticias/">Ver todas as notícias</a></p>
</section>`,
}));

// ---------- feed, sitemap, robots ----------
write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${NAME}</title>
<link>${SITE}/</link>
<description>${esc(TAGLINE)}</description>
<language>pt-BR</language>
<atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map(p => `<item>
<title>${esc(p.titulo)}</title>
<link>${SITE}/noticias/${p.id}/</link>
<guid>${SITE}/noticias/${p.id}/</guid>
<pubDate>${p.date.rfc}</pubDate>
<category>${esc(p.assunto)}</category>
<description>${esc(p.resumo)}</description>
</item>`).join('\n')}
</channel>
</rss>
`);

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${SITE}/</loc><lastmod>${top.date.iso}</lastmod></url>
<url><loc>${SITE}/noticias/</loc><lastmod>${top.date.iso}</lastmod></url>
${posts.map(p => `<url><loc>${SITE}/noticias/${p.id}/</loc><lastmod>${p.date.iso}</lastmod></url>`).join('\n')}
</urlset>
`);

write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

// avisa sobre pastas de notícias sem .md (seriam páginas órfãs)
const orphan = fs.readdirSync(path.join(ROOT, 'noticias'), { withFileTypes: true })
  .filter(d => d.isDirectory() && /^\d+$/.test(d.name) && !byId.has(+d.name)).map(d => d.name);
if (orphan.length) console.warn(`⚠ Pastas sem post em blog/posts: noticias/${orphan.join(', noticias/')}`);

console.log(`✔ ${posts.length} notícias geradas (mais recente: ${top.id}), versão ${ver}`);
