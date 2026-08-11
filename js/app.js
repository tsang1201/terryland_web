/* ========== TerryLand 修仙錄 官網渲染 ========== */
(function () {
  const D = DATA;

  const PAGES = [
    { id: 'home',      label: '首頁' },
    { id: 'realm',     label: '境界' },
    { id: 'technique', label: '功法' },
    { id: 'treasure',  label: '法寶' },
    { id: 'pet',       label: '靈寵' },
    { id: 'adventure', label: '奇遇' },
    { id: 'gacha',     label: '抽獎' },
    { id: 'dungeon',   label: '副本' },
    { id: 'story',     label: '主線' },
    { id: 'effect',    label: '特殊效果' },
    { id: 'gameplay',  label: '玩法' },
  ];

  const esc = s => String(s ?? '').replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const pct = v => (v === '—' ? 100 : 100 - parseFloat(v));
  const barColor = v => {
    const n = parseFloat(v);
    if (v === '—') return '#d4af37';
    if (n >= 40) return '#8b0000';
    if (n >= 15) return '#b5713a';
    return '#5a9c6e';
  };

  /* ---------- 各頁渲染 ---------- */
  const pages = {};

  pages.home = () => `
    <div class="hero">
      <span class="seal">凡人修仙</span>
      <p>長生路上，靈根定前程。少年TerryLand偶然得到仙緣，踏入修真界——
      從一介凡人在燕王府藏書閣偷學功法開始，歷經功法交融、境界突破、奇遇迭起，
      一路斬妖除魔、收集通天靈寶，直至扛過九道雷劫，登臨真仙之位。</p>
    </div>

    <div class="panel">
      <h2 class="page-title">☯ 苦海一覽</h2>
      <div class="page-desc">修真界全貌速覽</div>
      <div class="stat-grid">
        <div class="stat-card"><div class="num">${D.realms.length - 1}</div><div class="lbl">境界階層</div></div>
        <div class="stat-card"><div class="num">${D.techniques.length}</div><div class="lbl">部功法</div></div>
        <div class="stat-card"><div class="num">${D.treasures.length}</div><div class="lbl">件法寶</div></div>
        <div class="stat-card"><div class="num">${D.pets.length}</div><div class="lbl">隻靈寵</div></div>
        <div class="stat-card"><div class="num">${D.story.length}</div><div class="lbl">章主線</div></div>
        <div class="stat-card"><div class="num">${D.dungeons.length}</div><div class="lbl">座副本</div></div>
        <div class="stat-card"><div class="num">4</div><div class="lbl">抽獎獎池</div></div>
        <div class="stat-card"><div class="num">${D.effects.length}</div><div class="lbl">特殊效果</div></div>
      </div>
      <h2 class="block-title">玩法速覽</h2>
      <div class="chips">${D.gameplay.map(g => `<span class="chip">${esc(g.title)}</span>`).join('')}</div>
      <div class="note note-warn">⚠ 天機不可洩漏：頂級法寶與通天靈寶皆為「獨一無二」，先到先得，絕版即失——莫要錯過仙緣。</div>
    </div>
  `;

  pages.realm = () => {
    const tier = D.realms;
    const rows = tier.map(r => `
      <tr>
        <td><b>${esc(r.name)}</b>${r.stage !== '無' ? `<br><span style="font-size:12px;opacity:.7">${esc(r.stage)}</span>` : ''}</td>
        <td>${esc(r.threshold)}</td>
        <td style="width:200px">
          <span style="color:${barColor(r.rate)}">${esc(r.rate)}</span>
          <div class="bar"><i style="width:${pct(r.rate)}%;background:${barColor(r.rate)}"></i></div>
        </td>
      </tr>`).join('');

    const spec = D.realmSpecial.map(s => `
      <div class="card">
        <div class="name"><span>🧿</span>${esc(s.realm)}</div>
        <div class="desc"><b style="color:#ffd700">${esc(s.need)}</b> — ${esc(s.desc)}</div>
      </div>`).join('');

    const roots = D.roots.map(r => `
      <div class="card">
        <div class="name">${esc(r.type)}<span class="badge badge-tier">${esc(r.rate)}</span></div>
        <div class="desc">${esc(r.roots)}</div>
        <div class="stats"><b>修練速度</b> ${esc(r.speed)}</div>
      </div>`).join('');

    return `
      <div class="panel">
        <h2 class="page-title">☯ 境界體系</h2>
        <div class="page-desc">從凡人到真仙，修爲達標即可衝擊瓶頸（突破成功率隨境界遞減）。</div>
        <table>
          <tr><th>境界</th><th>突破所需修爲</th><th>成功率</th></tr>
          ${rows}
        </table>
        <div class="note">凡人大乘飛升真仙時，需以肉身扛過九道雷劫（總傷害為最大生命的180%），可借助渡劫丹與噬天吸雷珠減傷。</div>
      </div>
      <div class="panel">
        <h2 class="block-title">特殊突破</h2>
        <div class="grid">${spec}</div>
      </div>
      <div class="panel">
        <h2 class="page-title">☘ 靈根資質</h2>
        <div class="page-desc">靈根決定修練速度與可修練的功法屬性。</div>
        <div class="grid">${roots}</div>
        <div class="note">${esc(D.rootNote)}</div>
      </div>
    `;
  };

  pages.technique = () => {
    const tierMap = ['中階', '高階', '頂級'];
    const elemMap = ['金', '木', '水', '火', '土', '光', '暗'];
    const sel = id => `<select id="f-${id}" onchange="window.__renderTechnique()">
      <option value="">全部${id === 't' ? '階級' : '屬性'}</option>
      ${(id === 't' ? tierMap : elemMap).map(o => `<option value="${o}">${o}</option>`).join('')}
    </select>`;

    const cards = D.techniques.map(t => `
      <div class="card">
        <div class="name">${esc(t.name)}
          <span class="badge badge-tier">${esc(t.tier)}</span>
          <span class="badge badge-elem">${esc(t.element)}</span>
        </div>
        <div class="desc">${esc(t.desc)}</div>
        <div class="stats">${t.stats.map(s => `<b>▸</b> ${esc(s)}`).join(' ')}
          ${t.effect.length ? `<br><b>效果</b> ${t.effect.map(e => `<span class="chip" style="font-size:11px">${esc(e)}</span>`).join(' ')}` : ''}
        </div>
      </div>`).join('');

    return `
      <div class="panel">
        <h2 class="page-title">📜 功法總覽</h2>
        <div class="page-desc">中階 16 部・高階 23 部・頂級 19 部，共 ${D.techniques.length} 部</div>
        <div class="filter-row">${sel('t')}${sel('e')}</div>
        <div id="technique-grid" class="grid">${cards}</div>
        <div class="note">${esc(D.techniqueNote)}</div>
      </div>
    `;
  };

  pages.treasure = () => {
    const tierMap = ['低階', '中階', '高階', '頂級', '通天靈寶'];
    const sel = `<select id="f-tr" onchange="window.__renderTreasure()">
      <option value="">全部階級</option>
      ${tierMap.map(o => `<option value="${o}">${o}</option>`).join('')}
    </select>`;

    const cards = D.treasures.map(t => `
      <div class="card">
        <div class="name">${esc(t.name)}
          <span class="badge badge-tier">${esc(t.tier)}</span>
          <span class="badge badge-elem" style="background:rgba(139,0,0,.5)">${esc(t.type)}</span>
          ${t.unique ? `<span class="badge badge-unique">唯一</span>` : ''}
        </div>
        <div class="desc">${esc(t.desc)}</div>
      </div>`).join('');

    return `
      <div class="panel">
        <h2 class="page-title">🔪 法寶庫</h2>
        <div class="page-desc">低階 15 件・中階 19 件・高階 21 件・頂級 24 件・通天靈寶 22 件，共 ${D.treasures.length} 件</div>
        <div class="filter-row">${sel}</div>
        <div id="treasure-grid" class="grid">${cards}</div>
        <div class="note">${esc(D.treasureNote)}</div>
      </div>
    `;
  };

  pages.pet = () => {
    const rows = D.pets.map(p => `
      <tr>
        <td><b>${esc(p.name)}</b></td>
        <td><span class="badge ${p.rarity === '真靈' ? 'badge-rare' : p.rarity === '高級' ? 'badge-unique' : 'badge-tier'}">${esc(p.rarity)}</span></td>
        <td>${esc(p.base)}</td>
        <td>${esc(p.evolve)}</td>
        <td>${esc(p.penalty)}</td>
      </tr>`).join('');

    return `
      <div class="panel">
        <h2 class="page-title">🐉 靈寵圖鑑</h2>
        <div class="page-desc">捕捉後恆久相伴，最多上陣 2 隻提供加成；餵食果實可進化，閃光形態 1% 機率屬性翻倍。</div>
        <table>
          <tr><th>靈寵</th><th>稀有度</th><th>基礎加成</th><th>進化路線（三階）</th><th>捕捉懲罰</th></tr>
          ${rows}
        </table>
        <div class="note">${esc(D.petNote)}</div>
      </div>
    `;
  };

  pages.adventure = () => {
    const pools = D.adventure.pools.map(p => `
      <div class="panel">
        <h2 class="page-title" style="font-size:19px">☁ ${esc(p.name)}<span class="badge badge-unique" style="margin-left:10px">${esc(p.rate)}</span></h2>
        <div class="page-desc" style="margin-bottom:10px">抽取機率</div>
        <table>
          <tr><th>獎勵</th><th style="width:90px">機率</th><th>說明</th></tr>
          ${p.items.map(i => `<tr><td>${esc(i.name)}</td><td>${esc(i.rate)}</td><td>${esc(i.desc)}</td></tr>`).join('')}
        </table>
      </div>`).join('');

    return `
      <div class="panel">
        <h2 class="page-title">🌫 天降奇遇</h2>
        <div class="page-desc">每 ${esc(D.adventure.cooldown)} 可觸發一次隨機奇遇，一念資質翻身、一念被打家劫舍。</div>
      </div>
      ${pools}
    `;
  };

  pages.gacha = () => {
    const pools = D.gacha.pools.map(p => `
      <div class="panel">
        <h2 class="page-title" style="font-size:19px">🎰 ${esc(p.name)}
          <span class="badge badge-tier" style="margin-left:10px">${esc(p.cost)}</span></h2>
        <div class="page-desc" style="margin-bottom:10px">${esc(p.desc)}</div>
        <table>
          <tr><th>獎勵</th><th style="width:90px">機率</th><th>說明</th></tr>
          ${p.items.map(i => `<tr><td>${esc(i.name)}</td><td>${esc(i.rate)}</td><td>${esc(i.desc)}</td></tr>`).join('')}
        </table>
      </div>`).join('');

    return `
      <div class="panel">
        <h2 class="page-title">🎲 抽獎閣</h2>
        <div class="page-desc">四大獎池，靈石或高級靈石兌換。頂級法寶通天靈寶獨一無二，先抽先得。</div>
      </div>
      ${pools}
    `;
  };

  pages.dungeon = () => {
    const rows = D.dungeons.map((d, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><b>${esc(d.name)}</b></td>
        <td>${esc(d.realm)}</td>
        <td>${esc(d.boss)}</td>
        <td>${esc(d.note)}</td>
      </tr>`).join('');
    return `
      <div class="panel">
        <h2 class="page-title">🏯 秘境副本</h2>
        <div class="page-desc">逐一擊破妖窟魔域，掃蕩五行妖神谷以補全五行靈根，為煉虛之路鋪陳。</div>
        <table>
          <tr><th>#</th><th>秘境</th><th>適合境界</th><th>鎮守BOSS</th><th>備註</th></tr>
          ${rows}
        </table>
        <div class="note">${esc(D.dungeonNote)}</div>
      </div>
    `;
  };

  pages.story = () => {
    const rows = D.story.map(s => `
      <tr>
        <td>${String(s.id).padStart(2, '0')}</td>
        <td><b>${esc(s.title)}</b></td>
        <td>${esc(s.realm)}</td>
      </tr>`).join('');
    return `
      <div class="panel">
        <h2 class="page-title">📖 主線奇譚</h2>
        <div class="page-desc">三十章冒險，自村口鼠精至萬界之巔，每章一位強敵鎮守。</div>
        <table>
          <tr><th>章</th><th>章節</th><th>主題</th></tr>
          ${rows}
        </table>
        <div class="note">${esc(D.storyNote)}</div>
      </div>
    `;
  };

  pages.effect = () => {
    const list = D.effects.map(e => `
      <div class="effect-item">
        <div class="ico">${e.icon}</div>
        <div class="txt"><b>${esc(e.name)}</b> — ${esc(e.desc)}</div>
      </div>`).join('');
    return `
      <div class="panel">
        <h2 class="page-title">⚜ 特殊效果</h2>
        <div class="page-desc">戰場上翻雲覆雨的狀態機制。附身咒於功法法寶，定鼎勝負於一念之間。</div>
        ${list}
      </div>
    `;
  };

  pages.gameplay = () => {
    const cards = D.gameplay.map(g => `
      <div class="card">
        <div class="name">☄ ${esc(g.title)}</div>
        <div class="desc">${esc(g.desc)}</div>
      </div>`).join('');
    const shopRows = [
      ['普通商城', esc(D.shop.refresh) + ' 一刷新', esc(D.shop.normal)],
      ['高級商城', esc(D.shop.refresh) + ' 一刷新', esc(D.shop.high)],
    ].map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    const forgeRows = D.forge.map(f =>
      `<tr><td>${esc(f.cost)}</td><td>${esc(f.result)}</td><td>${esc(f.note)}</td></tr>`).join('');
    return `
      <div class="panel">
        <h2 class="page-title">⚙ 玩法系統</h2>
        <div class="page-desc">修仙十四式，環環相扣。</div>
        <div class="grid">${cards}</div>
      </div>
      <div class="panel">
        <h2 class="page-title">🛒 靈石商城</h2>
        <div class="page-desc">貨品隨機限時刷新，頂級奇貨可遇不可求。</div>
        <table><tr><th>商城</th><th>刷新</th><th>內容</th></tr>${shopRows}</table>
      </div>
      <div class="panel">
        <h2 class="page-title">🔨 煉器坊</h2>
        <div class="page-desc">以妖獸資材煉化法寶，等價交換仙緣。</div>
        <table><tr><th>投入</th><th>產出</th><th>備註</th></tr>${forgeRows}</table>
        <div class="note">${esc(D.forgeNote)}</div>
      </div>
    `;
  };

  /* ---------- 導覽切換 ---------- */
  function switchPage(id) {
    document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('active', b.dataset.page === id));
    document.querySelectorAll('#main .page').forEach(p => p.classList.toggle('active', p.dataset.page === id));
    window.scrollTo(0, 0);
    const f = document.getElementById('f-t');
    if (id === 'technique' && f) { f.value = ''; document.getElementById('f-e').value = ''; }
    const fTr = document.getElementById('f-tr');
    if (id === 'treasure' && fTr) { fTr.value = ''; }
  }

  /* ---------- 篩選 ---------- */
  window.__renderTechnique = () => {
    const t = document.getElementById('f-t').value;
    const e = document.getElementById('f-e').value;
    document.getElementById('technique-grid').innerHTML = D.techniques
      .filter(x => (!t || x.tier === t) && (!e || x.element === e))
      .map(x => `
        <div class="card">
          <div class="name">${esc(x.name)}
            <span class="badge badge-tier">${esc(x.tier)}</span>
            <span class="badge badge-elem">${esc(x.element)}</span>
          </div>
          <div class="desc">${esc(x.desc)}</div>
          <div class="stats">${x.stats.map(s => `<b>▸</b> ${esc(s)}`).join(' ')}
            ${x.effect.length ? `<br><b>效果</b> ${x.effect.map(e => `<span class="chip" style="font-size:11px">${esc(e)}</span>`).join(' ')}` : ''}
          </div>
        </div>`).join('');
  };

  window.__renderTreasure = () => {
    const t = document.getElementById('f-tr').value;
    document.getElementById('treasure-grid').innerHTML = D.treasures
      .filter(x => !t || x.tier === t)
      .map(x => `
        <div class="card">
          <div class="name">${esc(x.name)}
            <span class="badge badge-tier">${esc(x.tier)}</span>
            <span class="badge badge-elem" style="background:rgba(139,0,0,.5)">${esc(x.type)}</span>
            ${x.unique ? `<span class="badge badge-unique">唯一</span>` : ''}
          </div>
          <div class="desc">${esc(x.desc)}</div>
        </div>`).join('');
  };

  /* ---------- 背景音樂控制 ---------- */
  const BGM_KEY = 'fwdl_bgm_vol';
  function initBgm() {
    const audio = document.getElementById('bgm');
    const toggle = document.getElementById('bgm-toggle');
    const vol = document.getElementById('bgm-vol');
    if (!audio || !toggle || !vol) return;

    const saved = localStorage.getItem(BGM_KEY);
    const v = saved !== null ? Number(saved) : 60;
    audio.volume = v / 100;
    vol.value = v;

    toggle.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', () => toggle.classList.add('playing'));
    audio.addEventListener('pause', () => toggle.classList.remove('playing'));
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    vol.addEventListener('input', () => {
      audio.volume = vol.value / 100;
      localStorage.setItem(BGM_KEY, vol.value);
    });
  }

  /* ---------- 背景靈氣特效 ---------- */
  function initFx() {
    const cv = document.getElementById('fx');
    if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    const COLORS = ['212,175,55', '240,214,138', '255,255,200'];
    let W, H, stars = [];
    let raf;

    function build() {
      const n = Math.max(25, Math.min(90, Math.floor((W * H) / 22000)));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.8 + Math.random() * 2.2,
        vy: 0.08 + Math.random() * 0.35,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        tw: 2 + Math.random() * 3,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function resize() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      build();
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      const sec = t / 1000;
      for (const s of stars) {
        s.y -= s.vy;
        s.x += Math.sin(sec * s.sway + s.phase) * 0.25;
        if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }

        const a = (0.35 + 0.35 * Math.sin(sec * s.tw + s.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
        ctx.shadowColor = `rgba(${s.c},0.9)`;
        ctx.shadowBlur = 8;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    });
    raf = requestAnimationFrame(frame);
  }

  /* ---------- 初始化 ---------- */
  function init() {
    const nav = document.getElementById('nav');
    nav.innerHTML = PAGES.map(p =>
      `<button data-page="${p.id}">${p.label}</button>`).join('');
    document.getElementById('main').innerHTML = PAGES.map(p =>
      `<section class="page" data-page="${p.id}">${pages[p.id]()}</section>`).join('');

    nav.querySelectorAll('button').forEach(b =>
      b.addEventListener('click', () => switchPage(b.dataset.page)));

    initBgm();
    initFx();
    switchPage('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();