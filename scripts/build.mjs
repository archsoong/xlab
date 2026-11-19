// Build the static site into dist/ from content/*.md, src/style.css and assets/.
// Run from the project root: node scripts/build.mjs
// Every link is relative and ends in index.html, so dist/ works from file:// and from any sub-path.
import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { dirname } from 'node:path';
import { loadContent } from './content.mjs';

const OUT = 'dist';
const { program, labs } = loadContent();
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const section = (title) => program.sections.find((s) => s.title === title);
const plain = (html) => html.replace(/<[^>]+>/g, '');

const FONTS = 'https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;500;700&family=JetBrains+Mono:wght@500&display=swap';
const MARK = '<svg class="mark" viewBox="0 0 32 22" aria-hidden="true"><circle cx="11" cy="11" r="9" fill="var(--brick)"/><circle cx="21" cy="11" r="9" fill="var(--leaf)" fill-opacity=".85"/></svg>';

function page({ root, title, description, body, current = '' }) {
  const nav = [
    ['about', '計畫介紹', `${root}about/index.html`],
    ['labs', '共學實驗室', `${root}index.html#labs`],
    ['ideas', '點子收發室', `${root}index.html#ideas`],
  ];
  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${root}assets/style.css">
</head>
<body>
<header class="site-head">
  <div class="wrap site-head-in">
    <a class="brand" href="${root}index.html">${MARK}<span><b>${esc(program.title.replace(/平台$/, ''))}</b><small>${esc(program.org)}</small></span></a>
    <nav class="site-nav" aria-label="主選單">${nav.map(([k, label, href]) => `<a href="${href}"${k === current ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
  </div>
</header>
<main>
${body}
</main>
<footer class="site-foot">
  <div class="wrap foot-grid">
    <div><a class="brand light" href="${root}index.html">${MARK}<span><b>${esc(program.title)}</b><small>${esc(program.title_en)}</small></span></a>
      <p class="foot-org">${esc(program.org)}<br><span>${esc(program.org_en)}</span></p></div>
    <nav aria-label="共學實驗室"><p class="foot-label">共學實驗室</p>${labs.map((l) => `<a href="${root}labs/${l.slug}/index.html">${esc(l.short)}</a>`).join('')}</nav>
    <nav aria-label="網站"><p class="foot-label">網站</p>${nav.map(([, label, href]) => `<a href="${href}">${label}</a>`).join('')}</nav>
  </div>
</footer>
<dialog class="lightbox" aria-label="照片"><button type="button" class="lb-close" aria-label="關閉">×</button><img alt=""><p></p></dialog>
<script>
(() => {
  const dlg = document.querySelector('.lightbox');
  if (!dlg || !dlg.showModal) return;
  const img = dlg.querySelector('img'), cap = dlg.querySelector('p');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.zoom'); if (!a) return;
    e.preventDefault(); img.src = a.href; img.alt = a.dataset.caption || ''; cap.textContent = a.dataset.caption || ''; dlg.showModal();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('.lb-close')) dlg.close(); });
})();
</script>
</body>
</html>
`;
}

const secHead = (no, label, title) => `<header class="sec-head"><span class="sec-no">${no}</span><span class="sec-label">${esc(label)}</span><h2>${title}</h2></header>`;
const hostNames = (l) => l.hosts.map((h) => h.name).join('、');
const zoom = (src, caption, inner) => `<a class="zoom" href="${src}" data-caption="${esc(caption)}">${inner}</a>`;

// ---------- home ----------
function home() {
  const root = '';
  const lede = plain(section('一句話').html);
  const stages = section('自主學習的六個轉化階段').items;
  const conds = section('讓轉化發生的四個條件').items;
  const steps = section('平台怎麼運作').items;
  const body = `
<section class="hero wrap">
  <div class="hero-main">
    <p class="kicker">${esc(program.org)}</p>
    <h1 class="hero-title"><em>共學</em>實驗室平台</h1>
    <p class="hero-sub">${esc(program.subtitle)}<span>${esc(program.subtitle_en)}</span></p>
    <p class="hero-lede">${esc(lede)}</p>
    <div class="actions"><a class="btn" href="#labs">看 ${labs.length} 個共學實驗室</a><a class="text-link" href="about/index.html">讀計畫介紹</a></div>
  </div>
  <div class="hero-side">
    <p class="side-label">核心精神</p>
    <ol class="spirit">${program.spirit.map((s, i) => `<li><span>${pad(i + 1)}</span>${esc(s)}</li>`).join('')}</ol>
  </div>
</section>

<section class="strip" aria-label="各實驗室的活動照片">
  ${labs.map((l) => `<a href="labs/${l.slug}/index.html"><img src="${l.photos[0].file}" alt="${esc(l.photos[0].caption)}" loading="lazy"><span>No.${pad(l.order)}　${esc(l.short)}</span></a>`).join('\n  ')}
</section>

<section id="labs" class="wrap block">
  ${secHead('01', '共學實驗室', `${labs.length} 個正在發生的共學`)}
  <ol class="labs">
  ${labs.map((l) => `<li><a href="labs/${l.slug}/index.html">
    <span class="lab-no">${pad(l.order)}</span>
    <span class="lab-main"><span class="lab-name">${esc(l.short)}${l.abbr && l.abbr !== l.short ? `<small>${esc(l.abbr)}</small>` : ''}</span><span class="lab-full">${esc(l.name)}</span><span class="lab-hosts">主持：${esc(hostNames(l))}</span></span>
    <span class="lab-desc"><span>${esc(l.tagline)}</span><span class="tags">${l.keywords.map((k) => `<i>#${esc(k)}</i>`).join('')}</span></span>
    <span class="lab-thumb"><img src="${l.photos[0].file}" alt="" loading="lazy"></span>
    <span class="lab-go" aria-hidden="true">→</span>
  </a></li>`).join('\n  ')}
  </ol>
</section>

<section class="values">
  <div class="wrap">
    ${secHead('02', '核心價值', 'X 實驗學院關心的四個方向')}
    <ol class="value-list">${program.values.map((v, i) => `<li><span>${pad(i + 1)}</span>${esc(v)}</li>`).join('')}</ol>
  </div>
</section>

<section class="wrap block">
  ${secHead('03', '學習的轉化', '自主學習的六個轉化階段')}
  <ol class="stages">${stages.map((s, i) => `<li><span class="st-no">${pad(i + 1)}</span><h3>${esc(s.title)}</h3><p class="st-en">${esc(s.sub)}</p><p>${s.text}</p></li>`).join('')}</ol>
  <h3 class="sub-head">讓轉化發生的四個條件</h3>
  <div class="conds">${conds.map((c) => `<div><h4>${esc(c.title)}</h4><p>${c.text}</p></div>`).join('')}</div>
  <p class="more"><a class="text-link" href="about/index.html">讀完整的計畫介紹</a></p>
</section>

<section class="wrap block">
  ${secHead('04', '平台', '平台怎麼運作')}
  <ol class="steps">${steps.map((s, i) => `<li><span>${pad(i + 1)}</span><p>${s.text}</p></li>`).join('')}</ol>
</section>

<section id="ideas" class="ideas">
  <div class="wrap ideas-grid">
    <div><p class="kicker light">點子收發室</p><h2>有想一起做的事？</h2><p>${esc(program.site_role)}</p></div>
    <div class="ideas-box"><p class="box-label">提案與聯絡</p><a class="ideas-mail" href="mailto:${esc(program.contact_email)}">${esc(program.contact_email)}</a></div>
  </div>
</section>`;
  return page({ root, title: `${program.title}｜${program.org}`, description: lede, body });
}

// ---------- about ----------
function about() {
  const root = '../';
  const body = `
<header class="page-head wrap">
  <p class="kicker">計畫介紹</p>
  <h1>${esc(program.title)}</h1>
  <p class="page-en">${esc(program.title_en)}</p>
  <p class="page-sub">${esc(program.subtitle)}<span>${esc(program.subtitle_en)}</span></p>
</header>
<div class="wrap about-grid">
  <nav class="toc" aria-label="本頁目錄"><p class="side-label">目錄</p><ol>${program.sections.map((s, i) => `<li><a href="#s${i + 1}"><span>${pad(i + 1)}</span>${esc(s.title)}</a></li>`).join('')}</ol></nav>
  <div class="about-body">
  ${program.sections.map((s, i) => `<section id="s${i + 1}" class="about-sec"${/^[A-Za-z]/.test(s.title) ? ' lang="en"' : ''}>
    ${secHead(pad(i + 1), '', esc(s.title))}
    <div class="prose">${s.html}</div>
  </section>`).join('\n  ')}
  </div>
</div>`;
  return page({ root, title: `計畫介紹｜${program.title}`, description: plain(section('一句話').html), body, current: 'about' });
}

// ---------- lab ----------
function contactRows(c) {
  const rows = [];
  if (c.name) rows.push(['聯絡人', `${esc(c.name)}${c.role ? `<span class="muted">（${esc(c.role)}）</span>` : ''}`]);
  if (c.email) rows.push(['Email', `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`]);
  if (c.line_id) rows.push(['LINE ID', esc(c.line_id)]);
  if (c.phone) rows.push(['電話', esc(c.phone)]);
  const buttons = [];
  if (c.line_group) buttons.push(`<a class="btn leaf" href="${esc(c.line_group)}" target="_blank" rel="noopener">加入 LINE 群組</a>`);
  if (c.discord) buttons.push(`<a class="btn leaf" href="${esc(c.discord)}" target="_blank" rel="noopener">加入 Discord</a>`);
  return `<dl class="contact">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>${buttons.length ? `<div class="contact-btns">${buttons.join('')}</div>` : ''}`;
}

function lab(l, i) {
  const root = '../../';
  const src = (p) => root + p;
  const prev = labs[(i - 1 + labs.length) % labs.length];
  const next = labs[(i + 1) % labs.length];
  const [cover, ...rest] = l.photos;
  const alt = [l.abbr && l.abbr !== l.short ? l.abbr : '', l.name_en].filter(Boolean).join(' · ');
  const body = `
<header class="lab-head wrap">
  <p class="crumb"><a href="${root}index.html#labs">共學實驗室</a><span>/</span>No.${pad(l.order)}</p>
  <h1>${esc(l.name)}</h1>
  ${alt ? `<p class="page-en">${esc(alt)}</p>` : ''}
  <p class="lab-lede">${esc(l.tagline)}</p>
  <p class="tags">${l.keywords.map((k) => `<i>#${esc(k)}</i>`).join('')}</p>
</header>

<figure class="lab-cover">${zoom(src(cover.file), cover.caption, `<img src="${src(cover.file)}" alt="${esc(cover.caption)}">`)}<figcaption class="wrap">${esc(cover.caption)}</figcaption></figure>

<div class="wrap lab-grid">
  <article class="prose lab-body">${l.html}</article>
  <aside class="lab-aside">
    <section><h2>主持人</h2><ul class="hosts">${l.hosts.map((h) => `<li>${h.photo ? zoom(src(h.photo), `${h.name}，${h.title}`, `<img src="${src(h.photo)}" alt="${esc(h.name)}">`) : `<span class="avatar" aria-hidden="true">${esc(h.name[0])}</span>`}<div><b>${esc(h.name)}</b><span>${esc(h.title)}</span></div></li>`).join('')}</ul></section>
    <section><h2>聯絡窗口</h2>${contactRows(l.contact)}</section>
    ${l.links.length ? `<section><h2>相關連結</h2><ul class="link-list">${l.links.map((k) => `<li><a href="${esc(k.url)}" target="_blank" rel="noopener">${esc(k.label)}<span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>` : ''}
    ${l.press.length ? `<section><h2>媒體報導</h2><ul class="link-list press">${l.press.map((k) => `<li><a href="${esc(k.url)}" target="_blank" rel="noopener"><span class="press-title">${esc(k.label)}<small>${esc(k.source)}</small></span><span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>` : ''}
  </aside>
</div>

${rest.length ? `<section class="wrap block">
  ${secHead(`${l.photos.length} 張`, '照片', '活動紀錄')}
  <div class="gallery">${rest.map((p) => `<figure>${zoom(src(p.file), p.caption, `<img src="${src(p.file)}" alt="${esc(p.caption)}" loading="lazy">`)}<figcaption>${esc(p.caption)}</figcaption></figure>`).join('')}</div>
</section>` : ''}

<nav class="wrap pager" aria-label="其他實驗室">
  <a href="${root}labs/${prev.slug}/index.html"><span>← 上一個</span>${esc(prev.short)}</a>
  <a href="${root}labs/${next.slug}/index.html"><span>下一個 →</span>${esc(next.short)}</a>
</nav>`;
  return page({ root, title: `${l.name}｜${program.title}`, description: l.tagline, body, current: 'labs' });
}

// ---------- write ----------
rmSync(OUT, { recursive: true, force: true });
const write = (path, html) => { mkdirSync(dirname(`${OUT}/${path}`), { recursive: true }); writeFileSync(`${OUT}/${path}`, html); };
cpSync('assets', `${OUT}/assets`, { recursive: true });
cpSync('src/style.css', `${OUT}/assets/style.css`);
write('index.html', home());
write('about/index.html', about());
labs.forEach((l, i) => write(`labs/${l.slug}/index.html`, lab(l, i)));
console.log(`dist/: index, about, ${labs.length} labs (${labs.map((l) => l.slug).join(', ')})`);
