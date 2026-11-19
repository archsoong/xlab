// Read content/*.md into plain objects for scripts/build.mjs.
// Frontmatter uses a small YAML subset: scalars, inline [a, b] lists, one-level maps,
// and lists of one-level maps. Comment lines (# ...) are skipped.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const unquote = (v) => v.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
const scalar = (v) => {
  v = v.trim();
  if (v.startsWith('[') && v.endsWith(']')) return v.slice(1, -1).split(',').map((s) => unquote(s.trim())).filter(Boolean);
  return unquote(v);
};

function parseFrontmatter(src) {
  const out = {};
  let key = null; // current block key
  let item = null; // current list item (map)
  for (const raw of src.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^ */)[0].length;
    const line = raw.trim();
    if (indent === 0) {
      const [, k, v] = line.match(/^([\w-]+):\s*(.*)$/);
      key = k; item = null;
      out[k] = v === '' ? null : scalar(v);
      continue;
    }
    if (line.startsWith('- ')) {
      const [, k, v] = line.slice(2).match(/^([\w-]+):\s*(.*)$/);
      if (!Array.isArray(out[key])) out[key] = [];
      item = { [k]: scalar(v) };
      out[key].push(item);
      continue;
    }
    const [, k, v] = line.match(/^([\w-]+):\s*(.*)$/);
    if (item && indent >= 4) item[k] = scalar(v);
    else { if (!out[key] || Array.isArray(out[key])) out[key] = {}; out[key][k] = scalar(v); }
  }
  return out;
}

const inline = (s) => s
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>');

export function mdToHtml(md) {
  md = md.replace(/<!--[\s\S]*?-->/g, '');
  const html = [];
  let list = null;
  const close = () => { if (list) { html.push(`</${list}>`); list = null; } };
  for (const block of md.split(/\n{2,}/)) {
    for (const line of block.split('\n')) {
      const t = line.trim();
      if (!t) continue;
      let m;
      if ((m = t.match(/^(#{2,4})\s+(.*)$/))) { close(); const n = m[1].length; html.push(`<h${n}>${inline(m[2])}</h${n}>`); }
      else if ((m = t.match(/^(\d+)\.\s+(.*)$/))) { if (list !== 'ol') { close(); list = 'ol'; html.push('<ol>'); } html.push(`<li>${inline(m[2])}</li>`); }
      else if ((m = t.match(/^-\s+(.*)$/))) { if (list !== 'ul') { close(); list = 'ul'; html.push('<ul>'); } html.push(`<li>${inline(m[1])}</li>`); }
      else { close(); html.push(`<p>${inline(t)}</p>`); }
    }
  }
  close();
  return html.join('\n');
}

// "**啟動加入**（Engaging）：說明" -> { title, sub, text }
function listItems(md) {
  return md.split('\n').map((l) => l.trim()).filter((l) => /^(\d+\.|-)\s+/.test(l)).map((l) => {
    const body = l.replace(/^(\d+\.|-)\s+/, '');
    const m = body.match(/^\*\*(.+?)\*\*(?:（(.+?)）)?：(.*)$/);
    return m ? { title: m[1], sub: m[2] || '', text: inline(m[3]) } : { title: '', sub: '', text: inline(body) };
  });
}

function read(file) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  return { meta: parseFrontmatter(m[1]), body: m[2] };
}

export function loadContent(root = '.') {
  const program = read(join(root, 'content/program.md'));
  const sections = program.body.replace(/<!--[\s\S]*?-->/g, '').split(/\n(?=## )/).filter((s) => s.startsWith('## ')).map((s) => {
    const [first, ...rest] = s.split('\n');
    const md = rest.join('\n').trim();
    return { title: first.replace(/^##\s+/, ''), html: mdToHtml(md), items: listItems(md) };
  });

  const labs = readdirSync(join(root, 'content/labs')).filter((f) => f.endsWith('.md')).sort().map((f) => {
    const { meta, body } = read(join(root, 'content/labs', f));
    const img = (file) => (file ? `assets/labs/${meta.slug}/${file}` : null);
    return {
      ...meta,
      hosts: (meta.hosts || []).map((h) => ({ ...h, photo: img(h.photo) })),
      photos: (meta.photos || []).map((p) => ({ ...p, file: img(p.file) })),
      links: meta.links || [],
      press: meta.press || [],
      contact: meta.contact || {},
      html: mdToHtml(body),
    };
  });

  return { program: { ...program.meta, sections }, labs };
}
