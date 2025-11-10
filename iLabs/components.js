/* ========================================================================
 *  Imtiaz Lab UI System (iLab)  –  generative component engine
 *  Syntax: iLab.Component.format(credentials,{theme,format})
 * ======================================================================== */
export const iLab = (() => {
  /* -------- private factory -------- */
  const el = (tag, cls = '', html = '') => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  };
  const themeClass = (t = 'purple') => `iLab-theme-${t}`;

  /* ------------------------------------------------------------------
   *  Buttons
   *  formats: solid,ghost,neon,outline,animated
   * ------------------------------------------------------------------ */
  const Buttons = {
    solid:  (txt, { theme } = {}) => el('button','iLab-btn iLab-btn-solid ' + themeClass(theme),txt),
    ghost:  (txt, { theme } = {}) => el('button','iLab-btn iLab-btn-ghost ' + themeClass(theme),txt),
    neon:   (txt, { theme } = {}) => el('button','iLab-btn iLab-btn-neon ' + themeClass(theme),txt),
    outline:(txt, { theme } = {}) => el('button','iLab-btn iLab-btn-outline ' + themeClass(theme),txt),
    animated:(txt, { theme } = {}) => el('button','iLab-btn iLab-btn-animated ' + themeClass(theme),txt)
  };

  /* ------------------------------------------------------------------
   *  Cards
   *  formats: f1 academic, f2 stats, f3 profile, f4 project, f5 summary, f6 notification
   * ------------------------------------------------------------------ */
  const Cards = {
    info: (data = {}, { theme = 'purple', format = 'f1' } = {}) => {
      const e = el('div', `iLab-card iLab-card-${format} ${themeClass(theme)}`);
      const { title = 'Title', desc = 'Description' } = data;
      e.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
      return e;
    },
    stat: (data = {}, { theme = 'blue', format = 'f2' } = {}) => {
      const e = el('div', `iLab-card iLab-card-${format} ${themeClass(theme)}`);
      const { value = '0', label = 'metric' } = data;
      e.innerHTML = `<div style="font-size:2rem;font-weight:700">${value}</div><small>${label}</small>`;
      return e;
    },
    profile: (data = {}, { theme = 'green', format = 'f3' } = {}) => {
      const e = el('div', `iLab-card iLab-card-${format} ${themeClass(theme)}`);
      const { name = 'User', role = 'Role' } = data;
      e.innerHTML = `<strong>${name}</strong><div style="opacity:.7">${role}</div>`;
      return e;
    },
    project: (data = {}, { theme = 'sunset', format = 'f4' } = {}) => {
      const e = el('div', `iLab-card iLab-card-${format} ${themeClass(theme)}`);
      const { name = 'Project', progress = 0 } = data;
      e.innerHTML = `<div>${name}</div>
        <div class="iLab-slider" style="margin-top:.5rem"><div style="width:${progress}%;height:6px;background:var(--iLab-primary);border-radius:3px"></div></div>`;
      return e;
    },
    summary: (data = {}, { theme = 'neon', format = 'f5' } = {}) => {
      const e = el('div', `iLab-card iLab-card-${format} ${themeClass(theme)}`);
      e.innerHTML = `<div style="display:flex;justify-content:space-between"><span>Summary</span><i>→</i></div>`;
      return e;
    },
    notification: (data = {}, { theme = 'midnight', format = 'f6' } = {}) => {
      const e = el('div', `iLab-card iLab-card-${format} ${themeClass(theme)}`);
      const { msg = 'New alert' } = data;
      e.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem"><span class="iLab-pulse" style="width:8px;height:8px;background:var(--iLab-accent);border-radius:50%"></span>${msg}</div>`;
      return e;
    }
  };

  /* ------------------------------------------------------------------
   *  Headers
   *  formats: f1 centered, f2 split, f3 minimal, f4 icon-based, f5 scroll-aware
   * ------------------------------------------------------------------ */
  const Headers = {
    top: (data = {}, { theme = 'purple', format = 'f1' } = {}) => {
      const e = el('header', `iLab-header iLab-header-${format} ${themeClass(theme)}`);
      const { title = 'Page' } = data;
      if (format === 'f1') e.innerHTML = `<h2>${title}</h2>`;
      if (format === 'f2') e.innerHTML = `<div>${title}</div><div>${Buttons.solid('Action')}</div>`;
      if (format === 'f3') e.innerHTML = `<h3 style="font-weight:400">${title}</h3>`;
      if (format === 'f4') e.innerHTML = `<span class="iLab-icon">⚡</span><h3>${title}</h3>`;
      if (format === 'f5') e.classList.add('iLab-hover');
      return e;
    }
  };

  /* ------------------------------------------------------------------
   *  Navs
   *  top & bottom each 5 formats
   * ------------------------------------------------------------------ */
  const Navs = {
    top: (data = {}, { theme = 'dark', format = 'f1' } = {}) => {
      const e = el('nav', `iLab-nav-top iLab-nav-top-${format} ${themeClass(theme)}`);
      const { links = [] } = data;
      e.innerHTML = links.map(l=>`<a class="iLab-nav-item">${l}</a>`).join('');
      return e;
    },
    bottom: (data = {}, { theme = 'neon', format = 'f1' } = {}) => {
      const e = el('nav', `iLab-nav-bottom iLab-nav-bottom-${format} ${themeClass(theme)}`);
      const { links = [] } = data;
      e.innerHTML = links.map(l=>`<a class="iLab-nav-item"><span>${l}</span></a>`).join('');
      return e;
    }
  };

  /* ------------------------------------------------------------------
   *  Charts (visual placeholders)
   *  formats: bars, line, pie, donut, radial
   * ------------------------------------------------------------------ */
  const Charts = {
    verticalBars: (data = [], { theme = 'blue', format = 'f1' } = {}) => {
      const e = el('div', `iLab-chart iLab-chart-${format} ${themeClass(theme)}`);
      const max = Math.max(...data);
      e.innerHTML = `<div class="iLab-chart-bars">${data.map(v=>`<div class="iLab-chart-bar" style="height:${v/max*100}%"></div>`).join('')}</div>`;
      return e;
    },
    lineChart: (data = [], { theme = 'green', format = 'f2' } = {}) => {
      const e = el('div', `iLab-chart iLab-chart-${format} ${themeClass(theme)}`);
      const w = 300, h = 200;
      const pts = data.map((d,i)=>`${i*(w/(data.length-1))},${h-d*2}`).join(' ');
      e.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline class="iLab-chart-line" points="${pts}"/></svg>`;
      return e;
    },
    pie: (data = [], { theme = 'sunset', format = 'f3' } = {}) => {
      const e = el('div', `iLab-chart iLab-chart-${format} ${themeClass(theme)}`);
      e.innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--iLab-primary)" stroke-width="20" stroke-dasharray="60 40"/></svg>`;
      return e;
    },
    donut: (data = [], { theme = 'neon', format = 'f4' } = {}) => {
      const e = el('div', `iLab-chart iLab-chart-${format} ${themeClass(theme)}`);
      e.innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--iLab-accent)" stroke-width="10" stroke-dasharray="75 25"/></svg>`;
      return e;
    },
    radialGauge: (value = 50, { theme = 'purple', format = 'f5' } = {}) => {
      const e = el('div', `iLab-chart iLab-chart-${format} ${themeClass(theme)}`);
      e.innerHTML = `<svg viewBox="0 0 100 50"><path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="10"/>
      <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="var(--iLab-primary)" stroke-width="10" stroke-dasharray="${value*.6283} 62.83"/></svg>`;
      return e;
    }
  };

  /* ------------------------------------------------------------------
   *  Panels / Widgets
   * ------------------------------------------------------------------ */
  const Panels = {
    analytics: (data = {}, { theme = 'green', format = 'f1' } = {}) => {
      const e = el('div', `iLab-panel iLab-panel-${format} ${themeClass(theme)}`);
      e.innerHTML = `<h4>Analytics</h4><div style="margin-top:.5rem">Active users: ${data.users||0}</div>`;
      return e;
    },
    quickActions: (actions = [], { theme = 'neon', format = 'f2' } = {}) => {
      const e = el('div', `iLab-panel iLab-panel-${format} ${themeClass(theme)}`);
      e.append(...actions.map(a=>Buttons[a.type||'solid'](a.label,{theme})));
      return e;
    },
    progress: (data = {}, { theme = 'blue', format = 'f3' } = {}) => {
      const e = el('div', `iLab-panel iLab-panel-${format} ${themeClass(theme)}`);
      const { percent = 0 } = data;
      e.innerHTML = `<div>Progress</div><div class="iLab-slider" style="margin-top:.5rem"><div style="width:${percent}%;height:6px;background:var(--iLab-primary);border-radius:3px"></div></div>`;
      return e;
    },
    notifications: (list = [], { theme = 'sunset', format = 'f4' } = {}) => {
      const e = el('div', `iLab-panel iLab-panel-${format} ${themeClass(theme)}`);
      e.append(...list.map(msg=>Cards.notification({msg},{theme})));
      return e;
    }
  };

  /* ------------------------------------------------------------------
   *  Inputs & Controls
   * ------------------------------------------------------------------ */
  const Inputs = {
    text: (placeholder = 'Type…', { theme = 'purple' } = {}) => el('input', `iLab-input ${themeClass(theme)}`),
    slider: (value = 50, { theme = 'blue' } = {}) => {
      const e = el('input', `iLab-slider ${themeClass(theme)}`);
      e.type = 'range'; e.value = value;
      return e;
    },
    toggle: (checked = false, { theme = 'neon' } = {}) => {
      const e = el('div', `iLab-toggle ${checked?'active':''} ${themeClass(theme)}`);
      e.onclick = () => e.classList.toggle('active');
      return e;
    }
  };

  /* ------------------------------------------------------------------
   *  Layout helpers
   * ------------------------------------------------------------------ */
  const Layouts = {
    grid: (cols = 2, { gap = '1rem' } = {}) => el('div', 'iLab-grid', '', { style: `grid-template-columns:repeat(${cols},1fr);--gap:${gap}` }),
    flex: (dir = 'row', { gap = '1rem' } = {}) => el('div', 'iLab-flex', '', { style: `flex-direction:${dir};--gap:${gap}` })
  };

  /* ------------------------------------------------------------------
   *  Effects (decorative wrappers)
   * ------------------------------------------------------------------ */
  const Effects = {
    hover:  (child) => { child.classList.add('iLab-hover'); return child; },
    pulse:  (child) => { child.classList.add('iLab-pulse'); return child; },
    float:  (child) => { child.classList.add('iLab-float'); return child; },
    blur:   (child) => { child.classList.add('iLab-blur'); return child; },
    shimmer:(child) => { child.classList.add('iLab-shimmer'); return child; },
    reflect:(child) => { child.classList.add('iLab-reflect'); return child; },
    tilt:   (child) => { child.classList.add('iLab-tilt'); return child; }
  };

  /* -------- public API -------- */
  return { Charts, Cards, Navs, Headers, Panels, Buttons: Buttons, Inputs, Layouts, Effects };
})();
