(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();const p="sterile_md_last_content_v1",f="sterile_md_last_filename_v1",y=document.getElementById("app");if(!y)throw new Error("Missing #app element");function m(a){return a.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function w(a){const s=a.replaceAll(`\r
`,`
`).split(`
`);let r="",n=!1,e=[],t=!1;const i=()=>{t&&(r+="</ul>",t=!1)},l=()=>{if(n){const d=m(e.join(`
`));r+=`<pre><code>${d}</code></pre>`,e=[],n=!1}},c=d=>{let o=m(d);return o=o.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'),o=o.replace(/`([^`]+)`/g,"<code>$1</code>"),o=o.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),o=o.replace(/\*([^*]+)\*/g,"<em>$1</em>"),o};for(const d of s){const o=d??"";if(o.trim().startsWith("```")){n?l():(i(),n=!0,e=[]);continue}if(n){e.push(o);continue}const x=o.match(/^###\s+(.*)$/),h=o.match(/^##\s+(.*)$/),b=o.match(/^#\s+(.*)$/);if(x){i(),r+=`<h3>${c(x[1])}</h3>`;continue}if(h){i(),r+=`<h2>${c(h[1])}</h2>`;continue}if(b){i(),r+=`<h1>${c(b[1])}</h1>`;continue}const v=o.match(/^(\-|\*)\s+(.*)$/);if(v){t||(r+="<ul>",t=!0),r+=`<li>${c(v[2])}</li>`;continue}else i();if(o.trim()===""){r+='<div class="spacer"></div>';continue}r+=`<p>${c(o)}</p>`}return i(),l(),r}function u(a,s){const r=a?m(a):"no file";y.innerHTML=`
    <main class="wrap">
      <header class="top">
        <div>
          <div class="title">Sterile MD</div>
          <div class="sub">last file: <span class="mono">${r}</span></div>
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
          ${s?w(s):'<p class="muted">Pick a markdown file to view it here.</p>'}
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
  `;const n=document.getElementById("file"),e=document.getElementById("clear");n==null||n.addEventListener("change",async()=>{var l;const t=(l=n.files)==null?void 0:l[0];if(!t)return;const i=await t.text();localStorage.setItem(p,i),localStorage.setItem(f,t.name),u(t.name,i),g()}),e==null||e.addEventListener("click",()=>{localStorage.removeItem(p),localStorage.removeItem(f),u(null,""),g()})}async function g(){const a=document.getElementById("sw");if(a){if(!("serviceWorker"in navigator)){a.textContent="Service Worker: not supported";return}try{const s=await navigator.serviceWorker.register("./sw.js",{scope:"./"});a.textContent=`Service Worker: registered (${s.scope})`}catch(s){a.textContent=`Service Worker: failed (${String(s)})`}}}const S=localStorage.getItem(p)||"",$=localStorage.getItem(f);u($,S);g();
