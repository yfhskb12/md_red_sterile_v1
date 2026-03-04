// index.tsx — minimal markdown reader, keeps existing PWA/SW setup

const STORAGE_KEY = 'sterile_md_last_content_v1';
const STORAGE_NAME_KEY = 'sterile_md_last_filename_v1';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app element');

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Minimal Markdown to HTML.
 * Supports:
 * - # / ## / ### headings
 * - unordered lists (- / * )
 * - fenced code blocks ``` ```
 * - inline code `code`
 * - **bold**, *italic*
 * - links [text](url)
 * - paragraphs
 */
function mdToHtml(md: string) {
  const lines = md.replaceAll('\r\n', '\n').split('\n');

  let html = '';
  let inCode = false;
  let codeBuf: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      html += '</ul>';
      inList = false;
    }
  };

  const flushCode = () => {
    if (inCode) {
      const code = escapeHtml(codeBuf.join('\n'));
      html += `<pre><code>${code}</code></pre>`;
      codeBuf = [];
      inCode = false;
    }
  };

  const inline = (text: string) => {
    let t = escapeHtml(text);

    // links
    t = t.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      `<a href="$2" target="_blank" rel="noreferrer">$1</a>`
    );

    // inline code
    t = t.replace(/`([^`]+)`/g, `<code>$1</code>`);

    // bold
    t = t.replace(/\*\*([^*]+)\*\*/g, `<strong>$1</strong>`);

    // italic (simple)
    t = t.replace(/\*([^*]+)\*/g, `<em>$1</em>`);

    return t;
  };

  for (const rawLine of lines) {
    const line = rawLine ?? '';

    // fenced code block
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        flushList();
        inCode = true;
        codeBuf = [];
      } else {
        flushCode();
      }
      continue;
    }

    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    // headings
    const h3 = line.match(/^###\s+(.*)$/);
    const h2 = line.match(/^##\s+(.*)$/);
    const h1 = line.match(/^#\s+(.*)$/);

    if (h3) {
      flushList();
      html += `<h3>${inline(h3[1])}</h3>`;
      continue;
    }
    if (h2) {
      flushList();
      html += `<h2>${inline(h2[1])}</h2>`;
      continue;
    }
    if (h1) {
      flushList();
      html += `<h1>${inline(h1[1])}</h1>`;
      continue;
    }

    // unordered list
    const li = line.match(/^(\-|\*)\s+(.*)$/);
    if (li) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${inline(li[2])}</li>`;
      continue;
    } else {
      flushList();
    }

    // blank line => spacing
    if (line.trim() === '') {
      html += `<div class="spacer"></div>`;
      continue;
    }

    // paragraph
    html += `<p>${inline(line)}</p>`;
  }

  flushList();
  flushCode();

  return html;
}

function renderUI(filename: string | null, md: string) {
  const safeName = filename ? escapeHtml(filename) : 'no file';

  app!.innerHTML = `
    <main class="wrap">
      <header class="top">
        <div>
          <div class="title">Sterile MD</div>
          <div class="sub">last file: <span class="mono">${safeName}</span></div>
        </div>

        <div class="actions">
          <label class="btn">
            <input id="file" type="file" accept=".md,text/markdown,text/plain" hidden />
            Choose .md
          </label>

          <button id="clear" class="btn ghost">Clear</button>
        </div>
      </header>

      <section class="viewer">
        <article class="md">
          ${
            md
              ? mdToHtml(md)
              : `<p class="muted">Pick a markdown file to view it here.</p>`
          }
        </article>
      </section>

      <footer class="foot">
        <div id="sw" class="muted">Service Worker: ...</div>
      </footer>
    </main>

    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        background: #0b0f14;
        color: #e6e8ee;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }
      a { color: #8ab4ff; }
      .wrap { max-width: 980px; margin: 0 auto; padding: 14px; }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        border: 1px solid #2a2f3a;
        border-radius: 14px;
        background: rgba(18,24,36,0.55);
        backdrop-filter: blur(10px);
      }
      .title { font-size: 18px; font-weight: 700; }
      .sub { font-size: 12px; opacity: 0.8; margin-top: 4px; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .actions { display: flex; gap: 10px; align-items: center; }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid #2a2f3a;
        background: #121824;
        color: #e6e8ee;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
      }
      .btn.ghost { background: transparent; }
      .btn:active { transform: translateY(1px); }
      .viewer {
        margin-top: 12px;
        border: 1px solid #2a2f3a;
        border-radius: 14px;
        background: rgba(11,15,20,0.6);
        overflow: hidden;
      }
      .md { padding: 14px; line-height: 1.55; }
      .md h1 { font-size: 22px; margin: 16px 0 10px; }
      .md h2 { font-size: 18px; margin: 16px 0 10px; }
      .md h3 { font-size: 16px; margin: 14px 0 8px; }
      .md p { margin: 10px 0; }
      .md ul { margin: 10px 0 10px 18px; }
      .md li { margin: 6px 0; }
      .md code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        background: rgba(255,255,255,0.06);
        padding: 2px 6px;
        border-radius: 8px;
      }
      .md pre {
        background: rgba(255,255,255,0.06);
        border: 1px solid #2a2f3a;
        border-radius: 12px;
        padding: 12px;
        overflow: auto;
      }
      .md pre code { background: transparent; padding: 0; }
      .spacer { height: 10px; }
      .muted { opacity: 0.75; font-size: 12px; }
      .foot { margin-top: 10px; padding: 0 4px; }
    </style>
  `;

  const fileInput = document.getElementById('file') as HTMLInputElement | null;
  const clearBtn = document.getElementById('clear') as HTMLButtonElement | null;

  fileInput?.addEventListener('change', async () => {
    const f = fileInput.files?.[0];
    if (!f) return;

    const text = await f.text();
    localStorage.setItem(STORAGE_KEY, text);
    localStorage.setItem(STORAGE_NAME_KEY, f.name);

    renderUI(f.name, text);
    attachSWStatus();
  });

  clearBtn?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_NAME_KEY);
    renderUI(null, '');
    attachSWStatus();
  });
}

async function attachSWStatus() {
  const swEl = document.getElementById('sw');
  if (!swEl) return;

  if (!('serviceWorker' in navigator)) {
    swEl.textContent = 'Service Worker: not supported';
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    swEl.textContent = `Service Worker: registered (${reg.scope})`;
  } catch (e) {
    swEl.textContent = `Service Worker: failed (${String(e)})`;
  }
}

// bootstrap
const last = localStorage.getItem(STORAGE_KEY) || '';
const lastName = localStorage.getItem(STORAGE_NAME_KEY);
renderUI(lastName, last);
attachSWStatus();