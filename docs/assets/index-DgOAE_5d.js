(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function p(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=p(e);fetch(e.href,r)}})();const d=document.getElementById("app");if(!d)throw new Error("Missing #app element");d.innerHTML=`
  <main style="font-family: system-ui; padding: 16px; max-width: 900px; margin: 0 auto;">
    <h1 style="margin: 0 0 8px 0;">Sterile MD PWA</h1>
    <p style="margin: 0 0 16px 0; opacity: 0.8;">
      Build ok = Vite работает. Дальше проверяем PWA и офлайн.
    </p>

    <section style="display: grid; gap: 12px; margin: 16px 0;">
      <button id="btn-sw" style="padding: 10px 12px; border-radius: 10px; border: 1px solid #2a2f3a; background: #121824; color: #e6e8ee;">
        Проверить Service Worker
      </button>

      <div id="sw-status" style="padding: 10px 12px; border-radius: 10px; border: 1px solid #2a2f3a; background: #0b0f14; color: #e6e8ee;">
        Service Worker: not checked
      </div>

      <details style="border: 1px solid #2a2f3a; border-radius: 10px; padding: 10px 12px;">
        <summary style="cursor: pointer;">Диагностика путей</summary>
        <ul style="margin: 10px 0 0 18px; padding: 0;">
          <li><a href="./manifest.json" target="_blank">./manifest.json</a></li>
          <li><a href="./sw.js" target="_blank">./sw.js</a></li>
          <li><a href="./icon-192.png" target="_blank">./icon-192.png</a></li>
          <li><a href="./icon-512.png" target="_blank">./icon-512.png</a></li>
        </ul>
      </details>
    </section>
  </main>
`;const c=document.getElementById("sw-status"),s=document.getElementById("btn-sw");function i(t){c&&(c.textContent=t)}async function l(){if(!("serviceWorker"in navigator)){i("Service Worker: not supported");return}try{const t=await navigator.serviceWorker.register("./sw.js",{scope:"./"});i(`Service Worker: registered, scope = ${t.scope}`)}catch(t){i(`Service Worker: register failed: ${String(t)}`)}}s==null||s.addEventListener("click",async()=>{i("Service Worker: checking..."),await l()});l();
