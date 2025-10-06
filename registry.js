/* ---------- error surface (so crashes show on-screen, esp. on iPhone) ----- */
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

// 02 SovereignWealth — /api/ping
Registry.add({
  id:"02-sovereignwealth", name:"SovereignWealth",
  async render(mount){
    mount.innerHTML = `
      <div class="card">
        <h2>💰 SovereignWealth</h2>
        <p class="muted">Connectivity test via <code>/api/ping</code>.</p>
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

// 03 MirrorMe — POST JSON to /api/echo
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

// 04 Boardroom Access — /api/openai {prompt}
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

// 05 Auréliya Air — template
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

// 06 Quantum Income Router — demo
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

// names for 08–56 (rename later if you like)
const names = [
  "Module 08","Module 09","Module 10","Module 11","Module 12","Module 13","Module 14",
  "Module 15","Module 16","Module 17","Module 18","Module 19","Module 20","Module 21",
  "Module 22","Module 23","Module 24","Module 25","Module 26","Module 27","Module 28",
  "Module 29","Module 30","Module 31","Module 32","Module 33","Module 34","Module 35",
  "Module 36","Module 37","Module 38","Module 39","Module 40","Module 41","Module 42",
  "Module 43","Module 44","Module 45","Module 46","Module 47","Module 48","Module 49",
  "Module 50","Module 51","Module 52","Module 53","Module 54","Module 55","Module 56"
];
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
  const items = Registry.list().map(m=>(
    `<div class="tile"><h4>${m.name}</h4><a class="chip" href="#/module/${m.id}">Open</a></div>`
  )).join('');
  el('main').innerHTML = `<div class="card"><h2>🧩 Modules (${Registry.list().length})</h2>
    <div class="grid" style="margin-top:12px">${items}</div></div>`;
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
  el('main').innerHTML = `<div class="card"><h2>⚙️ Settings</h2><p class="muted">Add environment & feature switches here.</p>${backBtn()}</div>`;
}

function renderFiles(){
  el('main').innerHTML = `<div class="card"><h2>📁 Files</h2><p class="muted">Connect storage and list artifacts here.</p>${backBtn()}</div>`;
}

/* --------------------------------- ROUTER --------------------------------- */
function route(){
  const h = location.hash || '#/home';
  document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
  if(h.startsWith('#/home'))        el('nav-home').classList.add('active');
  else if(h.startsWith('#/modules')) el('nav-mods').classList.add('active');
  else if(h.startsWith('#/module/')) el('nav-trust').classList.add('active');

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
document.getElementById('q').addEventListener('keydown', e=>{
  if(e.key!=='Enter') return;
  const q = e.target.value.trim().toLowerCase();
  if(!q) return;
  const hit = Registry.list().find(m => (m.name||m.id).toLowerCase().includes(q));
  if(hit) location.hash = '#/module/'+hit.id;
});
