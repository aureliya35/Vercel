<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Auréliya — Sovereign AI System (56)</title>
  <link rel="icon" href="data:,">
  <style>
    :root {
      --bg1: #432889; --bg2:#9e85d4;
      --card: rgba(255,255,255,.12);
      --cardBorder: rgba(255,255,255,.25);
      --ink:#fff; --muted: rgba(255,255,255,.85);
      --chip:#fff; --chipInk:#222;
    }
    *{box-sizing:border-box}
    html,body{margin:0;height:100%;background:linear-gradient(135deg,var(--bg1),var(--bg2));color:var(--ink);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Inter,Roboto,Arial}
    a{color:#fff}
    .wrap{min-height:100vh;display:flex;flex-direction:column}
    .nav{position:sticky;top:0;z-index:10;backdrop-filter:blur(8px);background:rgba(0,0,0,.25);padding:10px 12px;display:flex;gap:14px;align-items:center}
    .nav button{background:transparent;border:0;color:#fff;font-weight:600;padding:8px 10px;border-radius:10px;cursor:pointer}
    .nav button.active{background:rgba(255,255,255,.18)}
    .nav input{margin-left:auto;padding:10px 12px;border-radius:10px;border:0;min-width:220px}
    main{width:100%;max-width:1120px;margin:0 auto;padding:24px}
    .halo{width:160px;height:160px;border:4px solid gold;border-radius:50%;box-shadow:0 0 20px gold;margin:18px auto}
    .home{display:flex;flex-direction:column;align-items:center;gap:8px}
    .card{background:var(--card);border:1px solid var(--cardBorder);border-radius:16px;padding:18px 18px 22px 18px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
    h1,h2{margin:0 0 10px 0}
    pre{background:rgba(0,0,0,.35);color:#fff;padding:14px;border-radius:12px;overflow:auto}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
    .tile{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:12px}
    .tile h4{margin:0 0 6px 0}
    .row{display:flex;gap:10px;flex-wrap:wrap}
    .chip{background:var(--chip);color:var(--chipInk);border-radius:999px;font-weight:600;padding:7px 12px;border:0;cursor:pointer}
    .muted{opacity:.9}
    .sr{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
  </style>
</head>
<body>
<div class="wrap">
  <nav id="hdr" class="nav">
    <button data-goto="#/home"  id="nav-home">🏠 Home</button>
    <button data-goto="#/modules" id="nav-mods">🧩 Modules</button>
    <button data-goto="#/module/01-trustos" id="nav-trust">🔐 Trust</button>
    <button data-goto="#/settings" id="nav-settings">⚙️ Settings</button>
    <button data-goto="#/files" id="nav-files">📁 Files</button>
    <input id="q" placeholder="Search modules…"/>
  </nav>

  <main id="main">
    <p class="muted">Loading…</p>
  </main>
</div>

<script type="module">
/* ---------- show fatal errors right on the page (handy on mobile) ---------- */
window.addEventListener('error', e => {
  const pre=document.createElement('pre'); pre.textContent='Error: '+e.message;
  document.getElementById('main').prepend(pre);
});
window.addEventListener('unhandledrejection', e => {
  const pre=document.createElement('pre'); pre.textContent='Promise Rejection: '+(e.reason?.message||e.reason);
  document.getElementById('main').prepend(pre);
});

/* --------------------------------- helpers -------------------------------- */
const el = id => document.getElementById(id);
const json = v => typeof v==='string' ? v : JSON.stringify(v, null, 2);
const backBtn = () => `<a class="chip" href="#/modules">↩ Back to Modules</a>`;

/* ----------------------------- module registry ---------------------------- */
const Registry = {
  modules: {},
  add(m){ this.modules[m.id]=m; },
  list(){ return Object.values(this.modules); },
  get(id){ return this.modules[id]; }
};

/* --------------------------- CORE / FEATURED MODS -------------------------- */
// 01 TrustOS — uses /api/time and /api/trust-feed
Registry.add({
  id:"01-trustos", name:"TrustOS",
  async render(mount){
    mount.innerHTML = `
      <section class="home">
        <div class="halo"></div>
        <h1>Welcome back, Sabrina ✨</h1>
      </section>
      <div class="card" style="margin-top:16px">
        <h2>🔐 TrustOS</h2>
        <p class="muted">Live trust checks via <code>/api/time</code> and <code>/api/trust-feed</code>.</p>
        <div class="row">
          <button class="chip" id="btnTime">Get Server Time</button>
          <button class="chip" id="btnFeed">Load Trust Feed</button>
          ${backBtn()}
        </div>
        <pre id="out">Ready…</pre>
      </div>`;
    const out = v => el('out').textContent = json(v);
    el('btnTime').onclick = async()=>{
      try{ const r=await fetch('/api/time'); out(await r.json()); }catch(e){ out(String(e)); }
    };
    el('btnFeed').onclick = async()=>{
      try{ const r=await fetch('/api/trust-feed'); out(await r.json()); }catch(e){ out(String(e)); }
    };
  }
});

// 02 SovereignWealth — uses /api/ping as health
Registry.add({
  id:"02-sovereignwealth", name:"SovereignWealth",
  async render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>💰 SovereignWealth</h2>
        <p class="muted">Connectivity test via <code>/api/ping</code>. Wire income/grants here.</p>
        <div class="row">
          <button class="chip" id="btnPing">Ping</button>
          ${backBtn()}
        </div>
        <pre id="out">Click Ping…</pre>
      </div>`;
    const out = v => el('out').textContent = json(v);
    el('btnPing').onclick = async()=>{
      try{ const r=await fetch('/api/ping'); out(await r.json()); }catch(e){ out(String(e)); }
    };
  }
});

// 03 MirrorMe — sends JSON to /api/echo
Registry.add({
  id:"03-mirrorme", name:"MirrorMe",
  async render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>🪞 MirrorMe</h2>
        <p class="muted">POST JSON to <code>/api/echo</code> and view the reply.</p>
        <textarea id="payload" rows="6" style="width:100%">{ "hello":"Sabrina", "module":"MirrorMe" }</textarea>
        <div class="row" style="margin-top:10px">
          <button class="chip" id="btnEcho">Send</button>
          ${backBtn()}
        </div>
        <pre id="out">Type JSON and click Send…</pre>
      </div>`;
    const out = v => el('out').textContent = json(v);
    el('btnEcho').onclick = async()=>{
      try{
        const body = el('payload').value;
        const r = await fetch('/api/echo', { method:'POST', headers:{'Content-Type':'application/json'}, body });
        out(await r.json());
      }catch(e){ out(String(e)); }
    };
  }
});

// 04 Boardroom Access — proxies to /api/openai with {prompt}
Registry.add({
  id:"04-boardroomaccess", name:"Boardroom Access",
  async render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>🏛️ Boardroom Access</h2>
        <p class="muted">Calls <code>/api/openai</code>. If <code>OPENAI_API_KEY</code> isn’t set, you’ll get a safe mock reply.</p>
        <input id="prompt" style="width:100%;padding:10px;border-radius:10px;border:0" value="Draft a 1-sentence greeting for Auréliya Holdings."/>
        <div class="row" style="margin-top:10px">
          <button class="chip" id="btnGo">Run</button>
          ${backBtn()}
        </div>
        <pre id="out">Enter a prompt and click Run…</pre>
      </div>`;
    const out = v => el('out').textContent = json(v);
    el('btnGo').onclick = async()=>{
      try{
        const prompt = el('prompt').value;
        const r = await fetch('/api/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});
        out(await r.json());
      }catch(e){ out(String(e)); }
    };
  }
});

// 05 Auréliya Air — placeholder (wire flight APIs later)
Registry.add({
  id:"05-aureliyaair", name:"Auréliya Air",
  render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>✈️ Auréliya Air</h2>
        <p class="muted">Private aviation orchestration. Wire flight search/booking APIs here.</p>
        ${backBtn()}
      </div>`;
  }
});

// 06 Quantum Income Router — template with quick demo
Registry.add({
  id:"06-quantumincomerouter", name:"Quantum Income Router",
  render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>💠 Quantum Income Router</h2>
        <p class="muted">Diversified income channels. Demo shows synthetic allocation.</p>
        <div class="row"><button class="chip" id="sim">Simulate Allocation</button>${backBtn()}</div>
        <pre id="out">Ready…</pre>
      </div>`;
    el('sim').onclick=()=>{
      const alloc=[['Grants',0.32],['Royalties',0.18],['Trading',0.27],['Rents',0.12],['Misc',0.11]];
      el('out').textContent=json({allocation:Object.fromEntries(alloc), ts:new Date().toISOString()});
    };
  }
});

// 07 Legal Advisor — template
Registry.add({
  id:"07-legaladvisor", name:"Legal Advisor",
  render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>📜 Legal Advisor</h2>
        <p class="muted">Contracts, NDAs, filings. Add doc templates & e-sign APIs here.</p>
        ${backBtn()}
      </div>`;
  }
});

/* ----------------------- GENERIC MODULE FACTORY (08–56) -------------------- */
const genericModule = (id, name) => ({
  id, name,
  render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>🧩 ${name}</h2>
        <p class="muted">Placeholder UI. Add module-specific logic and API calls here.</p>
        <div class="row">
          <button class="chip" id="btn-${id}-ping">Test /api/ping</button>
          ${backBtn()}
        </div>
        <pre id="out-${id}">Ready…</pre>
      </div>`;
    const out = v => (el(`out-${id}`).textContent = json(v));
    el(`btn-${id}-ping`).onclick = async()=>{ try{
      const r=await fetch('/api/ping'); out(await r.json());
    }catch(e){ out(String(e)); } };
  }
});

// names for 08–56 (you can rename anytime)
const names = [
  "Module 08","Module 09","Module 10","Module 11","Module 12","Module 13","Module 14",
  "Module 15","Module 16","Module 17","Module 18","Module 19","Module 20","Module 21",
  "Module 22","Module 23","Module 24","Module 25","Module 26","Module 27","Module 28",
  "Module 29","Module 30","Module 31","Module 32","Module 33","Module 34","Module 35",
  "Module 36","Module 37","Module 38","Module 39","Module 40","Module 41","Module 42",
  "Module 43","Module 44","Module 45","Module 46","Module 47","Module 48","Module 49",
  "Module 50","Module 51","Module 52","Module 53","Module 54","Module 55","Module 56"
];
// register 08–56
for(let i=0;i<names.length;i++){
  const n=i+8; const id=String(n).padStart(2,'0')+'-module'+String(n).padStart(2,'0');
  Registry.add(genericModule(id, names[i]));
}

/* ---------------------------------- PAGES --------------------------------- */
function renderHome(){
  el('main').innerHTML = `
    <section class="home">
      <div class="halo"></div>
      <h1>Welcome back, Sabrina ✨</h1>
      <p class="muted">Choose a module to begin, or search above.</p>
    </section>
    <div class="card" style="margin-top:16px">
      <h2>Quick Launch</h2>
      <div class="row" style="margin-top:8px">
        <a class="chip" href="#/module/01-trustos">🔐 TrustOS</a>
        <a class="chip" href="#/module/02-sovereignwealth">💰 Wealth</a>
        <a class="chip" href="#/module/03-mirrorme">🪞 Mirror</a>
        <a class="chip" href="#/module/04-boardroomaccess">🏛️ Boardroom</a>
        <a class="chip" href="#/module/05-aureliyaair">✈️ Air</a>
      </div>
    </div>`;
}

function renderModules(){
  const items = Registry.list().map(m=>{
    return `<div class="tile"><h4>${m.name}</h4><a class="chip" href="#/module/${m.id}">Open</a></div>`;
  }).join('');
  el('main').innerHTML = `
    <div class="card">
      <h2>🧩 Modules (${Registry.list().length})</h2>
      <div class="grid" style="margin-top:12px">${items}</div>
    </div>`;
}

async function renderModule(id){
  const mod = Registry.get(id);
  if(!mod){
    el('main').innerHTML = `<div class="card"><h2>Not found</h2><p>Unknown module: <code>${id}</code></p>${backBtn()}</div>`;
    return;
  }
  el('main').innerHTML = `<div class="card"><h2>Loading ${mod.name}…</h2></div>`;
  await mod.render(el('main'));
}

function renderSettings(){
  el('main').innerHTML = `
    <div class="card">
      <h2>⚙️ Settings</h2>
      <p class="muted">Add environment & feature switches here.</p>
      ${backBtn()}
    </div>`;
}

function renderFiles(){
  el('main').innerHTML = `
    <div class="card">
      <h2>📁 Files</h2>
      <p class="muted">Connect storage and list artifacts here.</p>
      ${backBtn()}
    </div>`;
}

/* --------------------------------- ROUTER --------------------------------- */
function route(){
  const h = location.hash || '#/home';
  document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
  if(h.startsWith('#/home'))     el('nav-home').classList.add('active');
  else if(h.startsWith('#/modules'))  el('nav-mods').classList.add('active');
  else if(h.startsWith('#/module/'))  el('nav-trust').classList.add('active');

  if(h === '#/home'){ renderHome(); }
  else if(h === '#/modules'){ renderModules(); }
  else if(h.startsWith('#/module/')){ renderModule(h.split('/')[2]); }
  else if(h === '#/settings'){ renderSettings(); }
  else if(h === '#/files'){ renderFiles(); }
  else { renderHome(); }
}
window.addEventListener('hashchange', route);
window.addEventListener('load', route);

/* ----------------------------- header behaviors ---------------------------- */
document.querySelectorAll('.nav [data-goto]').forEach(b=>{
  b.onclick = ()=> location.hash = b.getAttribute('data-goto');
});
el('q').addEventListener('keydown', e=>{
  if(e.key!=='Enter') return;
  const q = e.target.value.trim().toLowerCase();
  if(!q) return;
  const hit = Registry.list().find(m => (m.name||m.id).toLowerCase().includes(q));
  if(hit) location.hash = '#/module/'+hit.id;
});
</script>
</body>
</html>
