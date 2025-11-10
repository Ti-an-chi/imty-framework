// uiKit-phase3.js — Phase 3 (Ephemeral Arsenal, refactored)
// Exported as ES module: export { ui }

/*
  Goals:
  - Preserve all existing behaviors (toasts, modals, prompts, loading, dismissAll)
  - Add ephemeral components: tooltip, snackbar, banner, progress, badge, contextMenu, highlight, quickInput
  - Central registry for ephemeral instances for easier cleanup and targeting
  - Scalable, modular, mobile-friendly
*/

const uiCSS = `
:root{
  --ui-font: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  --ui-accent: #3b82f6;
  --ui-radius: 8px;
  --ui-shadow: 0 6px 20px rgba(2,6,23,.16);
  --ui-bg: #fff;
  --ui-text: #111827;
  --ui-muted: #6b7280;
}
@media (prefers-color-scheme: dark){
  :root{
    --ui-bg: #0b1220; --ui-text: #e6eef8; --ui-shadow: 0 6px 30px rgba(2,6,23,.6);
  }
}
/* containers */
.uik-container{position:fixed;inset:0;pointer-events:none;z-index:9999;font-family:var(--ui-font);}
.uik-top{top:20px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:8px}
.uik-middle{top:50%;left:0;right:0;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:8px}
.uik-bottom{bottom:20px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:8px}

.uik-toast{pointer-events:auto;max-width:92vw;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--ui-radius);background:var(--ui-bg);color:var(--ui-text);box-shadow:var(--ui-shadow);opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s}
.uik-toast.show{opacity:1;transform:translateY(0)}
.uik-toast .uik-close{margin-left:auto;cursor:pointer;opacity:.75}

/* modal */
.uik-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:10010;pointer-events:auto;opacity:0;transition:opacity .18s}
.uik-mask.show{opacity:1}
.uik-modal{width:clamp(280px,86vw,720px);border-radius:12px;background:var(--ui-bg);color:var(--ui-text);box-shadow:var(--ui-shadow);transform:scale(.96);opacity:0;transition:transform .18s,opacity .18s}
.uik-modal.show{transform:scale(1);opacity:1}
.uik-modal-header{padding:12px 16px;border-bottom:1px solid rgba(0,0,0,.06);font-weight:600}
.uik-modal-body{padding:14px}
.uik-modal-footer{padding:10px 14px;border-top:1px solid rgba(0,0,0,.06);text-align:right}
.uik-btn{border-radius:8px;padding:8px 12px;border:0;cursor:pointer;font-size:14px}
.uik-btn-primary{background:var(--ui-accent);color:#fff}
.uik-btn-secondary{background:#f3f4f6;color:var(--ui-text)}

/* spinner */
.uik-spinner-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:10020;background:rgba(0,0,0,.32);pointer-events:auto}
.uik-spinner{width:36px;height:36px;border-radius:50%;border:3px solid rgba(255,255,255,.14);border-top-color:var(--ui-accent);animation:uik-spin .8s linear infinite}
@keyframes uik-spin{to{transform:rotate(360deg)}}

/* tooltip */
.uik-tooltip{position:absolute;padding:6px 8px;border-radius:6px;background:rgba(0,0,0,.85);color:#fff;font-size:12px;pointer-events:none;opacity:0;transform:translateY(6px);transition:opacity .15s,transform .15s}
.uik-tooltip.show{opacity:1;transform:translateY(0)}

/* snackbar */
.uik-snackbar{pointer-events:auto;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;box-shadow:var(--ui-shadow);background:var(--ui-bg);}
.uik-snackbar .uik-action{margin-left:auto;border:0;background:none;cursor:pointer;font-weight:600}

/* banner */
.uik-banner{position:fixed;left:10px;right:10px;top:12px;padding:10px 14px;border-radius:10px;box-shadow:var(--ui-shadow);pointer-events:auto;max-width:calc(100% - 20px)}

/* context menu */
.uik-context{position:absolute;border-radius:8px;padding:6px;background:var(--ui-bg);box-shadow:var(--ui-shadow);min-width:140px;pointer-events:auto}
.uik-context button{display:block;width:100%;padding:8px;border:0;background:transparent;text-align:left;cursor:pointer}

/* badge & highlight */
.uik-badge{position:absolute;border-radius:999px;padding:2px 6px;font-size:12px;pointer-events:none}
.uik-highlight{pointer-events:none;position:absolute;inset:auto;border-radius:10px;box-shadow:0 0 0 4px rgba(59,130,246,.14);animation:uik-pulse .9s ease-out}
@keyframes uik-pulse{0%{transform:scale(.98);opacity:1}100%{transform:scale(1.06);opacity:0}}

/* quick input */
.uik-quick-input{position:fixed;left:50%;transform:translateX(-50%);bottom:20px;background:var(--ui-bg);padding:10px;border-radius:12px;box-shadow:var(--ui-shadow);pointer-events:auto}
`;

// inject css
(function inject(){
  if (!document.getElementById('uik-styles')){
    const s = document.createElement('style'); s.id='uik-styles'; s.textContent=uiCSS; document.head.appendChild(s);
  }
})();

// Small helpers
const $ = sel => document.querySelector(sel);
const create = (tag, props = {}, children = []) => {
  const el = document.createElement(tag);
  Object.entries(props||{}).forEach(([k,v])=>{
    if (k === 'class') el.className = v;
    else if (k === 'style') Object.assign(el.style, v);
    else if (k.startsWith('data-')) el.setAttribute(k, v);
    else if (k === 'html') el.innerHTML = v;
    else el[k] = v;
  });
  (Array.isArray(children)?children:[children]).flat().filter(Boolean).forEach(c=>el.appendChild(typeof c==='string'?document.createTextNode(c):c));
  return el;
};

// Registry for ephemeral instances (lightweight)
const registry = new Map();
function register(id, obj){ registry.set(id, obj); 
  return id;
}
function unregister(id){ registry.delete(id); }
function getInstance(id){ return registry.get(id); }

// Base containers
const containers = {
  top: ensureContainer('uik-top'),
  middle: ensureContainer('uik-middle'),
  bottom: ensureContainer('uik-bottom')
};

function ensureContainer(kind){
  const rootId = 'uik-root';
  let root = document.getElementById(rootId);
  if (!root){ root = create('div',{id:rootId,class:'uik-container'}); document.body.appendChild(root); }
  let c = root.querySelector('.'+kind);
  if (!c){ c = create('div',{class:kind}); root.appendChild(c); }
  return c;
}

// ID generator
function makeId(prefix='uik'){ return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }

// Public api object (we'll fill methods below)
const ui = (function(){

  const cfg = {
    accent: getComputedStyle(document.documentElement).getPropertyValue('--ui-accent') || '#3b82f6',
    defaultDuration: 2400
  };

  function config(newCfg={}){ Object.assign(cfg,newCfg); document.documentElement.style.setProperty('--ui-accent', cfg.accent); }

  // === TOAST ===
  function toast({message='', type='info', duration=cfg.defaultDuration, position='bottom', closable=false, icon=null} = {}){
    const id = makeId('toast');
    const el = create('div',{class:'uik-toast',html:`${icon?`<span>${icon}</span>`:''}<span class="uik-msg">${message}</span>${closable?'<span class="uik-close">✕</span>':''}`});
    const colorMap = {info:'#3b82f6', success:'#10b981', warn:'#f59e0b', error:'#ef4444'};
    el.style.borderLeft = `4px solid ${colorMap[type]||colorMap.info}`;
    containers[position].appendChild(el);
    // show
    requestAnimationFrame(()=>el.classList.add('show'));
    const timer = setTimeout(()=>dismiss(), duration);
    function dismiss(){ el.classList.remove('show'); setTimeout(()=>{ el.remove(); unregister(id); }, 260); }
    el.querySelector('.uik-close')?.addEventListener('click', ()=>{ clearTimeout(timer); dismiss(); });
    register(id,{type:'toast', el, meta:{message,type}});
    return { id, el, remove: dismiss, update: (opts={})=>{ if (opts.message) el.querySelector('.uik-msg').textContent = opts.message; } };
  }

  // === SNACKBAR === (toast with action)
  function snackbar({message='', actionText='', onAction=null, duration=4000, position='bottom'} = {}){
    const id = makeId('snack');
    const el = create('div',{class:'uik-snackbar', html:`<span class="uik-msg">${message}</span>`});
    if (actionText){
      const act = create('button',{class:'uik-action', html:actionText});
      act.addEventListener('click', ()=>{ onAction?.(); dismiss(); });
      el.appendChild(act);
    }
    containers[position].appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    const timer = setTimeout(()=>dismiss(), duration);
    function dismiss(){ el.remove(); unregister(id); }
    register(id,{type:'snackbar', el, meta:{message,actionText}});
    return {id, el, remove: dismiss};
  }

  // === BANNER === (top notice) ===
  function banner({text='', type='info', duration=0} = {}){
    const id = makeId('banner');
    const el = create('div',{class:'uik-banner', html:`<div><strong>${text}</strong></div>`});
    // simple coloring by type
    if (type==='warn') el.style.background = '#fffbeb';
    if (type==='error') el.style.background = '#fee2e2';
    document.body.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    if (duration>0) setTimeout(()=>{ el.remove(); unregister(id); }, duration);
    register(id,{type:'banner', el, meta:{text,type}});
    return {id,el,remove:()=>{el.remove();unregister(id)}};
  }

  // === TOOLTIPS ===
  function tooltip({target, text='', position='top', duration=1800} = {}){
    const elTarget = typeof target === 'string'? document.querySelector(target) : target;
    if (!elTarget) return null;
    const id = makeId('tooltip');
    const tip = create('div',{class:'uik-tooltip',html:text});
    document.body.appendChild(tip);
    // position
    const rect = elTarget.getBoundingClientRect();
    document.body.appendChild(tip);
    const pos = calcTooltipPos(rect, tip, position);
    tip.style.left = pos.left + 'px'; tip.style.top = pos.top + 'px';
    requestAnimationFrame(()=>tip.classList.add('show'));
    const timer = setTimeout(()=>{ tip.remove(); unregister(id); }, duration);
    register(id,{type:'tooltip', el:tip, meta:{target:elTarget}});
    return {id,el:tip,remove:()=>{clearTimeout(timer);tip.remove();unregister(id)}};
  }
  function calcTooltipPos(rect, tip, pos){
    const tw = tip.offsetWidth || 120; const th = tip.offsetHeight || 30;
    let left = rect.left + rect.width/2 - tw/2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    let top = (pos==='top') ? rect.top - th - 8 : rect.bottom + 8;
    if (pos==='middle') top = rect.top + rect.height/2 - th/2;
    return {left, top};
  }

  // === PROGRESS TOAST ===
  function progress({text='Working...', position='bottom'} = {}){
    const id = makeId('progress');
    const el = create('div',{class:'uik-toast', html:`<span class="uik-progress-text">${text}</span><div class="uik-progress-bar" style="margin-left:10px;min-width:80px"></div>`});
    containers[position].appendChild(el); requestAnimationFrame(()=>el.classList.add('show'));
    register(id,{type:'progress', el, meta:{progress:0}});
    return {
      id, el,
      update: (pct)=>{ const p = Math.max(0,Math.min(100,pct)); const bar = el.querySelector('.uik-progress-bar'); bar.style.width = Math.max(30, p)+'%'; bar.style.height='8px'; bar.style.background = 'linear-gradient(90deg,var(--ui-accent), #60a5fa)'; register(id,{type:'progress', el, meta:{progress:p}}); },
      complete: ()=>{ el.classList.remove('show'); setTimeout(()=>{el.remove(); unregister(id)},260); }
    };
  }

  // === CONTEXT MENU ===
  function contextMenu({x=0,y=0,items=[]} = {}){
    const id = makeId('ctx');
    const el = create('div',{class:'uik-context'});
    items.forEach(it=>{
      const btn = create('button', {html:it.text});
      btn.addEventListener('click', ()=>{ it.onClick?.(); dismiss(); });
      el.appendChild(btn);
    });
    document.body.appendChild(el);
    el.style.left = x+'px'; el.style.top = y+'px';
    function dismiss(){ el.remove(); unregister(id); }
    const onDoc = (e)=>{ if (!el.contains(e.target)) dismiss(); };
    setTimeout(()=>document.addEventListener('pointerdown', onDoc),10);
    register(id,{type:'context', el, meta:{items}});
    return {id, el, remove: dismiss};
  }

  // === BADGE ===
  function badge({target, text='', duration=2000} = {}){
    const elTarget = typeof target === 'string'? document.querySelector(target) : target;
    if (!elTarget) return null;
    const id = makeId('badge');
    const b = create('div',{class:'uik-badge', html:text});
    document.body.appendChild(b);
    const rect = elTarget.getBoundingClientRect();
    b.style.left = (rect.right - 14) + 'px'; b.style.top = (rect.top - 6) + 'px';
    setTimeout(()=>{ b.remove(); unregister(id); }, duration);
    register(id,{type:'badge', el:b, meta:{target:elTarget}});
    return {id, el:b, remove: ()=>{ b.remove(); unregister(id);} };
  }

  // === HIGHLIGHT ===
  function highlight({target, duration=900} = {}){
    const elTarget = typeof target === 'string'? document.querySelector(target) : target;
    if (!elTarget) return null;
    const id = makeId('hl');
    const rect = elTarget.getBoundingClientRect();
    const hl = create('div',{class:'uik-highlight'});
    document.body.appendChild(hl);
    hl.style.left = rect.left+'px'; hl.style.top = rect.top+'px'; hl.style.width = rect.width+'px'; hl.style.height = rect.height+'px';
    setTimeout(()=>{ hl.remove(); unregister(id); }, duration);
    register(id,{type:'highlight', el:hl, meta:{target:elTarget}});
    return {id, el:hl};
  }

  // === QUICK INPUT ===
  function quickInput({placeholder='Type...', onSubmit=null, onCancel=null} = {}){
    const id = makeId('qinput');
    const wrap = create('div',{class:'uik-quick-input'});
    const input = create('input',{placeholder, style:{padding:'8px 10px',borderRadius:'8px',border:'1px solid rgba(0,0,0,.08)'}});
    const btn = create('button',{class:'uik-btn uik-btn-primary', html:'Send'});
    wrap.appendChild(input); wrap.appendChild(btn);
    document.body.appendChild(wrap);
    input.focus();
    function clean(){ wrap.remove(); unregister(id); }
    btn.addEventListener('click', ()=>{ onSubmit?.(input.value); clean(); });
    input.addEventListener('keydown', (e)=>{ if (e.key==='Enter'){ onSubmit?.(input.value); clean(); } if (e.key==='Escape'){ onCancel?.(); clean(); } });
    register(id,{type:'quickInput', el:wrap});
    return {id, el:wrap, remove:clean};
  }

  // === MODAL BASE / PROMPT / ALERT / CONFIRM ===
  function baseModal({title='', content='', footerButtons=[], overlayClose=false, closable=true} = {}){
    return new Promise(res=>{
      const mask = create('div',{class:'uik-mask'});
      const modal = create('div',{class:'uik-modal'});
      if (title){
        const head = create('div',{class:'uik-modal-header', html:title});
        if (closable){ const c = create('button',{html:'✕', style:{float:'right',background:'none',border:'none',cursor:'pointer'}}); c.addEventListener('click', ()=>{ dismiss(); res(false); }); head.appendChild(c); }
        modal.appendChild(head);
      }
      const body = create('div',{class:'uik-modal-body'});
      if (typeof content === 'string') body.innerHTML = content; else body.appendChild(content);
      modal.appendChild(body);
      if (footerButtons.length){ const foot = create('div',{class:'uik-modal-footer'});
        footerButtons.forEach(b=>{
          const btn = create('button',{class:'uik-btn '+(b.primary?'uik-btn-primary':'uik-btn-secondary'), html:b.text});
          btn.addEventListener('click', ()=>{ dismiss(); res(b.value); });
          foot.appendChild(btn);
        });
        modal.appendChild(foot);
      }
      mask.appendChild(modal); document.body.appendChild(mask);
      requestAnimationFrame(()=>{ mask.classList.add('show'); modal.classList.add('show'); });
      function dismiss(){ mask.classList.remove('show'); modal.classList.remove('show'); setTimeout(()=>mask.remove(),200); }
      if (overlayClose) mask.addEventListener('click', e=>{ if (e.target === mask){ dismiss(); res(false); } });
    });
  }

  function alert(opts={title:'Alert', text:''}){
    return baseModal({ title:opts.title, content:opts.text, footerButtons:[{text:'OK', value:true, primary:true}] });
  }
  function confirm(opts={title:'Confirm', text:'Are you sure?'}){
    return baseModal({ title:opts.title, content:opts.text, footerButtons:[{text:opts.cancelText||'Cancel', value:false},{text:opts.okText||'OK', value:true, primary:true}] });
  }
  function prompt(opts={title:'Input', text:'', placeholder:''}){
    return new Promise(res=>{
      const input = create('input',{placeholder:opts.placeholder||'', style:{width:'100%',padding:'8px',border:'1px solid rgba(0,0,0,.08)',borderRadius:'8px'}});
      const wrap = create('div',{html:`<p style="margin-bottom:8px">${opts.text||''}</p>`}); wrap.appendChild(input);
      baseModal({ title:opts.title, content:wrap, footerButtons:[{text:opts.cancelText||'Cancel', value:null},{text:opts.okText||'OK', value:'ok', primary:true}] }).then(v=>{ if (v==='ok') res(input.value); else res(null); });
      setTimeout(()=>input.focus(),30);
    });
  }

  // === LOADING ===
  let loadingEl = null;
  function loading(show=true, text=''){
    if (show){ if (loadingEl) return; loadingEl = create('div',{class:'uik-spinner-overlay'}); const spinner = create('div',{class:'uik-spinner'}); loadingEl.appendChild(spinner); if (text) loadingEl.appendChild(create('div',{html:text, style:{marginTop:'10px',color:'#fff'}})); document.body.appendChild(loadingEl); }
    else{ loadingEl?.remove(); loadingEl = null; }
  }

  // === DISMISS ALL ===
  function dismissAll(){
    // remove all registered ephemerals
    Array.from(registry.keys()).forEach(id=>{ const it = registry.get(id); try{ it.el?.remove(); }catch(e){} registry.delete(id); });
    document.querySelectorAll('.uik-mask,.uik-spinner-overlay').forEach(e=>e.remove());
  }

  // expose read/update/delete by id for persistent-ish ephemerals
  function get(id){ return getInstance(id) || null; }
  function remove(id){ const it = getInstance(id); if (!it) return false; try{ it.el?.remove(); }catch(e){} unregister(id); return true; }
  function update(id, opts={}){
    const it = getInstance(id); if (!it) return false;
    if (it.type === 'toast' && opts.message){ it.el.querySelector('.uik-msg').textContent = opts.message; it.meta.message = opts.message; return true; }
    if (it.type === 'progress' && typeof opts.progress !== 'undefined'){ it.el.querySelector('.uik-progress-bar').style.width = Math.max(0,Math.min(100,opts.progress)) + '%'; it.meta.progress = opts.progress; return true; }
    // noop fallback: merge meta
    Object.assign(it.meta, opts);
    return true;
  }

  return {
    config,
    toast, snackbar, banner, tooltip, progress, contextMenu, badge, highlight, quickInput,
    alert, confirm, prompt,
    loading, dismissAll,
    // lightweight CRUD-like ops for ephemerals
    get, remove, update
  };
})();

export { ui };