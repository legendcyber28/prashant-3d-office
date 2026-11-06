/* Prashant's Office - isometric 3D walk-through portfolio.
   Plain Three.js (r149, global build). No build step, no paid assets:
   every mesh is procedural low-poly geometry. */
(function () {
  'use strict';

  var LINKS = {
    email: 'mailto:prashantkatheriya9970@gmail.com',
    linkedin: 'https://www.linkedin.com/in/prashant-katheriya',
    github: 'https://github.com/legendcyber28',
    instagram: 'https://www.instagram.com/devspace786',
    youtube: 'https://www.youtube.com/@devspace786'
  };

  var ZONES = [
    { id: 'reception', name: 'Reception', tag: 'Start here', x: 0, z: 10.5, r: 3.0,
      title: 'Welcome to my office',
      text: "Hi, I'm Prashant Katheriya - IT Support Engineer at HCLTech by day, builder and content creator by night. Walk around: tap the floor to move, step into a room and its card opens.",
      chips: ['Tap / click to walk', 'Rooms open cards', 'Tour list tracks you'], links: [] },
    { id: 'about', name: 'About cabin', tag: 'About me', x: -10.5, z: -7.5, r: 2.8,
      title: 'Prashant Katheriya',
      text: 'Citrix Support Engineer at HCLTech (since July 2025), working incidents in ServiceNow plus Citrix and cloud virtualization. B.Tech CSE (Cyber Security), G.H. Raisoni College of Engineering, Nagpur - RTM Nagpur University. Based in Nagpur, open to any city or remote.',
      chips: ['HCLTech', 'Citrix + M365', 'B.Tech CSE (Cyber Security)'],
      links: [ { label: 'LinkedIn', url: LINKS.linkedin, primary: true } ] },
    { id: 'projects', name: 'Project desks', tag: 'Projects', x: 8.5, z: -8.5, r: 3.2,
      title: 'Things I have built',
      text: 'Each desk in this room is a real project. Full source lives on my GitHub - everything is built to run without depending on anyone.',
      chips: ['GupShup - chat app', 'Fee Manager - coaching SaaS', 'OfficeFlow - Android office suite', '3D Portfolio', 'Prashant Unfolded'],
      links: [
        { label: 'GupShup live', url: 'https://gupshup-chat-yco8.onrender.com', primary: true },
        { label: 'Fee Manager live', url: 'https://coaching-fee-manager-migrated.onrender.com/', primary: true },
        { label: 'GitHub', url: LINKS.github, primary: false }
      ] },
    { id: 'skills', name: 'Skills wall', tag: 'Skills', x: -11, z: 5.5, r: 2.6,
      title: 'What I work with',
      text: 'Day-job stack plus what I build with at night.',
      chips: ['Citrix', 'Microsoft 365 admin', 'MSP environments', 'Teams support', 'REST APIs / HTTP', 'React + TypeScript', 'AI tools + agents'],
      links: [ { label: 'GitHub profile', url: LINKS.github, primary: true } ] },
    { id: 'studio', name: 'Creator studio', tag: 'Content', x: 10.5, z: 6.5, r: 2.8,
      title: 'DevSpace - my creator corner',
      text: "I run @devspace786 - short Hinglish reels on cyber-fraud awareness, tech help and news, fronted by my AI mascot. This office's style comes straight from that channel.",
      chips: ['Instagram reels', 'YouTube', 'AI voice + mascot'],
      links: [
        { label: 'Instagram', url: LINKS.instagram, primary: true },
        { label: 'YouTube', url: LINKS.youtube, primary: false }
      ] },
    { id: 'contact', name: 'Contact desk', tag: 'Say hello', x: 0, z: -12.5, r: 2.8,
      title: 'Let us talk',
      text: 'Hiring, collaborating or just curious about a build - my inbox is open. I reply fastest on email and LinkedIn.',
      chips: ['Nagpur, India', 'Open to relocate / remote'],
      links: [
        { label: 'Email me', url: LINKS.email, primary: true },
        { label: 'LinkedIn', url: LINKS.linkedin, primary: false }
      ] }
  ];

  var COLORS = {
    dark:  { bg: 0x10151b, floor: 0x232b36, carpet: 0x1b232d, wall: 0x38424f, wallTop: 0x46525f, desk: 0x4c5a6b, deskTop: 0x5d6f82, plant: 0x4f8f6b, pot: 0x8a5a3c, sofa: 0x8a5a48, accent: 0xe8825a, accent2: 0x7fd4c1, avatar: 0xe8825a, npc: 0x7fd4c1, screen: 0x9fe8d4, hemi: 0.55, dir: 0.75 },
    light: { bg: 0xf3ede4, floor: 0xe7dcc8, carpet: 0xdfd2ba, wall: 0xfaf6ee, wallTop: 0xffffff, desk: 0xc9b18c, deskTop: 0xe0cda8, plant: 0x5da877, pot: 0xa9714b, sofa: 0xd9906f, accent: 0xd96f3f, accent2: 0x3d8f7c, avatar: 0xd96f3f, npc: 0x3d8f7c, screen: 0xbfe9dc, hemi: 0.95, dir: 0.85 }
  };
  var dark = true;
  try { dark = localStorage.getItem('pko-theme') !== 'light'; } catch (e) {}

  var simple = document.getElementById('simple');
  function buildSimpleView() {
    var h = '<button class="iconbtn" id="closesimple">✕</button><h1>Prashant Katheriya</h1>' +
      '<div class="sub">Simple view of the 3D office - same content, no WebGL needed.</div>';
    ZONES.forEach(function (z) {
      h += '<section><h3>' + z.name + '</h3><p>' + z.text + '</p>';
      if (z.chips.length) h += '<ul>' + z.chips.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>';
      z.links.forEach(function (l) { h += '<p><a href="' + l.url + '">' + l.label + '</a></p>'; });
      h += '</section>';
    });
    simple.innerHTML = h;
    document.getElementById('closesimple').addEventListener('click', function () { simple.classList.remove('show'); });
  }
  buildSimpleView();

  var canvas = document.getElementById('scene');
  var renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  } catch (e) { renderer = null; }
  if (!renderer) {
    document.getElementById('loader').classList.add('fadeout');
    simple.classList.add('show');
    return;
  }

  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
  renderer.shadowMap.enabled = !coarse;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var scene = new THREE.Scene();
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  var VIEW = 13;

  function resize() {
    var w = window.innerWidth, h = window.innerHeight, a = w / h;
    cam.left = -VIEW * a; cam.right = VIEW * a; cam.top = VIEW; cam.bottom = -VIEW;
    cam.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  var hemi = new THREE.HemisphereLight(0xffffff, 0x30343a, 0.55);
  scene.add(hemi);
  var dir = new THREE.DirectionalLight(0xffffff, 0.75);
  dir.position.set(12, 22, 8);
  dir.castShadow = !coarse;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.left = -20; dir.shadow.camera.right = 20;
  dir.shadow.camera.top = 20; dir.shadow.camera.bottom = -20;
  scene.add(dir);
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));

  var tintables = [];
  function mat(key, opts) {
    var m = new THREE.MeshLambertMaterial(Object.assign({ color: COLORS[dark ? 'dark' : 'light'][key] }, opts || {}));
    m.userData.key = key; tintables.push(m); return m;
  }
  function box(w, h, d, key, x, y, z, ry) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(key));
    m.position.set(x || 0, y || 0, z || 0);
    if (ry) m.rotation.y = ry;
    m.castShadow = !coarse; m.receiveShadow = true;
    scene.add(m); return m;
  }
  function cyl(rt, rb, h, key, x, y, z, seg) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 10), mat(key));
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = !coarse; m.receiveShadow = true;
    scene.add(m); return m;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function textSprite(text, size, fg, bg) {
    var c = document.createElement('canvas'); var ctx = c.getContext('2d');
    var font = '700 ' + (size || 42) + 'px system-ui, sans-serif';
    ctx.font = font;
    var w = Math.ceil(ctx.measureText(text).width) + 44;
    c.width = w; c.height = 76;
    ctx = c.getContext('2d'); ctx.font = font;
    if (bg) { ctx.fillStyle = bg; roundRect(ctx, 0, 8, w, 60, 18); ctx.fill(); }
    ctx.fillStyle = fg || '#ffffff';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillText(text, w / 2, 40);
    var tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    sp.scale.set(w / 76 * 0.9, 0.9, 1);
    return sp;
  }

  // ---------- Office shell ----------
  var FLOOR = 34;
  box(FLOOR, 0.4, FLOOR, 'floor', 0, -0.2, 0);
  var carpet = box(24, 0.06, 24, 'carpet', 0, 0.03, 0); carpet.castShadow = false;

  var WH = 1.6, WT = 0.5;
  box(FLOOR, WH, WT, 'wall', 0, WH / 2, -FLOOR / 2);
  box(FLOOR, WH, WT, 'wall', 0, WH / 2, FLOOR / 2);
  box(WT, WH, FLOOR, 'wall', -FLOOR / 2, WH / 2, 0);
  box(WT, WH, FLOOR, 'wall', FLOOR / 2, WH / 2, 0);
  box(FLOOR + 0.3, 0.18, WT + 0.3, 'wallTop', 0, WH + 0.09, -FLOOR / 2);
  box(FLOOR + 0.3, 0.18, WT + 0.3, 'wallTop', 0, WH + 0.09, FLOOR / 2);
  box(WT + 0.3, 0.18, FLOOR + 0.3, 'wallTop', -FLOOR / 2, WH + 0.09, 0);
  box(WT + 0.3, 0.18, FLOOR + 0.3, 'wallTop', FLOOR / 2, WH + 0.09, 0);
  box(0.35, WH, 12, 'wall', -5.5, WH / 2, -11);
  box(0.35, WH, 12, 'wall', 5.5, WH / 2, -11);
  box(12, WH, 0.35, 'wall', -11, WH / 2, -2);
  box(12, WH, 0.35, 'wall', 11, WH / 2, -2);
  box(0.35, WH, 10, 'wall', -5.5, WH / 2, 8);
  box(0.35, WH, 10, 'wall', 5.5, WH / 2, 8);

  function desk(x, z, ry) {
    var g = new THREE.Group();
    var top = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.16, 1.4), mat('deskTop'));
    top.position.y = 1.0; top.castShadow = !coarse; top.receiveShadow = true; g.add(top);
    [[-1.35, -0.55], [1.35, -0.55], [-1.35, 0.55], [1.35, 0.55]].forEach(function (p) {
      var leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.0, 0.14), mat('desk'));
      leg.position.set(p[0], 0.5, p[1]); g.add(leg);
    });
    var mon = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.08), mat('desk'));
    mon.position.set(0, 1.6, -0.25); mon.castShadow = !coarse; g.add(mon);
    var scr = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.55), new THREE.MeshBasicMaterial({ color: COLORS[dark ? 'dark' : 'light'].screen }));
    scr.userData.key = 'screen'; scr.position.set(0, 1.6, -0.2); g.add(scr); tintables.push(scr.material);
    var stand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.1), mat('desk'));
    stand.position.set(0, 1.2, -0.25); g.add(stand);
    g.position.set(x, 0, z); g.rotation.y = ry || 0;
    scene.add(g); return g;
  }
  function chair(x, z, ry) {
    var g = new THREE.Group();
    var seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.8), mat('sofa'));
    seat.position.y = 0.55; seat.castShadow = !coarse; g.add(seat);
    var back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.12), mat('sofa'));
    back.position.set(0, 1.05, -0.34); g.add(back);
    var post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8), mat('desk'));
    post.position.y = 0.27; g.add(post);
    g.position.set(x, 0, z); g.rotation.y = ry || 0; scene.add(g); return g;
  }
  function plant(x, z, s) {
    var g = new THREE.Group();
    var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.5, 8), mat('pot'));
    pot.position.y = 0.25; pot.castShadow = !coarse; g.add(pot);
    var bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), mat('plant'));
    bush.position.y = 1.0; bush.castShadow = !coarse; g.add(bush);
    g.position.set(x, 0, z); g.scale.setScalar(s || 1); scene.add(g); return g;
  }
  function sofa(x, z, ry) {
    var g = new THREE.Group();
    var base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1.1), mat('sofa'));
    base.position.y = 0.35; base.castShadow = !coarse; g.add(base);
    var back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 0.3), mat('sofa'));
    back.position.set(0, 0.9, -0.4); g.add(back);
    g.position.set(x, 0, z); g.rotation.y = ry || 0; scene.add(g); return g;
  }
  function shelf(x, z, ry) {
    var g = new THREE.Group();
    var frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.4), mat('desk'));
    frame.position.y = 1.3; frame.castShadow = !coarse; g.add(frame);
    for (var i = 0; i < 3; i++) {
      var books = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.42, 0.3), mat(i % 2 ? 'accent' : 'accent2'));
      books.position.set(0, 0.7 + i * 0.72, 0.08); g.add(books);
    }
    g.position.set(x, 0, z); g.rotation.y = ry || 0; scene.add(g); return g;
  }
  function person(key, x, z, labelText, labelBg) {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 1.05, 10), mat(key));
    body.position.y = 0.85; body.castShadow = !coarse; g.add(body);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), new THREE.MeshLambertMaterial({ color: 0xf0c8a0 }));
    head.position.y = 1.72; head.castShadow = !coarse; g.add(head);
    var hair = new THREE.Mesh(new THREE.SphereGeometry(0.31, 12, 8, 0, Math.PI * 2, 0, 1.4), new THREE.MeshLambertMaterial({ color: 0x2c2320 }));
    hair.position.y = 1.78; g.add(hair);
    [[-0.16], [0.16]].forEach(function (p) {
      var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.5, 8), mat('desk'));
      leg.position.set(p[0], 0.25, 0); g.add(leg);
    });
    if (labelText) {
      var lab = textSprite(labelText, 40, '#ffffff', labelBg || 'rgba(0,0,0,.45)');
      lab.position.y = 2.45; g.add(lab);
    }
    g.position.set(x, 0, z); scene.add(g); return g;
  }

  // ---------- Dress the rooms ----------
  desk(0, 12.6, 0); chair(0, 13.6, Math.PI);
  person('npc', -1.8, 12.8, 'Prashant', 'rgba(217,111,63,.9)');
  plant(-3.4, 13.2, 1.1); plant(3.4, 13.2, 1.1);
  var rug1 = cyl(2.0, 2.0, 0.05, 'accent', 0, 0.06, 10.5, 24); rug1.castShadow = false;

  desk(-10.5, -9.2, 0); chair(-10.5, -8.2, Math.PI);
  shelf(-14.6, -9, Math.PI / 2); plant(-7.2, -10.8, 0.9);
  sofa(-12.8, -5.4, Math.PI / 2);

  var projDesks = [[7.4, -10.6, 0], [11.4, -10.6, 0], [7.4, -6.6, Math.PI], [11.4, -6.6, Math.PI]];
  projDesks.forEach(function (p) {
    desk(p[0], p[1], p[2]);
    chair(p[0], p[1] + (p[2] === 0 ? 1.05 : -1.05), p[2] === 0 ? Math.PI : 0);
  });
  desk(9.4, -8.6, Math.PI / 2);
  plant(14.2, -10.9, 1.0); shelf(14.6, -6.2, -Math.PI / 2);

  shelf(-14.6, 4.4, Math.PI / 2); shelf(-14.6, 7.2, Math.PI / 2);
  desk(-11, 3.2, Math.PI); chair(-11, 4.2, 0);
  plant(-7.4, 8.4, 1.0);

  desk(10.5, 4.6, 0); chair(10.5, 5.6, Math.PI);
  box(0.5, 0.5, 0.7, 'desk', 12.6, 1.5, 6.8);
  cyl(0.05, 0.05, 1.3, 'desk', 12.6, 0.65, 6.8, 6);
  var ringLight = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.07, 8, 20), mat('accent2'));
  ringLight.position.set(8.6, 1.6, 7.4); scene.add(ringLight);
  cyl(0.05, 0.05, 1.4, 'desk', 8.6, 0.7, 7.4, 6);
  plant(14.2, 8.6, 1.0);

  desk(0, -14.2, Math.PI); chair(0, -13.2, 0);
  person('npc', 1.9, -14.0, null, null);
  var rug2 = cyl(1.7, 1.7, 0.05, 'accent2', 0, 0.06, -12.3, 24); rug2.castShadow = false;
  plant(-3.2, -14.4, 1.1); plant(3.6, -14.4, 0.9);
  plant(-3.2, 1.2, 0.8); plant(3.4, -0.6, 0.8);

  ZONES.forEach(function (z) {
    var ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 8, 32), new THREE.MeshBasicMaterial({ color: COLORS[dark ? 'dark' : 'light'].accent }));
    ring2.rotation.x = -Math.PI / 2; ring2.position.set(z.x, 0.08, z.z);
    ring2.userData.key = 'accent'; tintables.push(ring2.material);
    scene.add(ring2); z.ring = ring2;
    var lab = textSprite(z.name, 36, dark ? '#f2efe9' : '#26221f', dark ? 'rgba(23,30,38,.85)' : 'rgba(255,253,249,.9)');
    lab.position.set(z.x, 3.1, z.z); scene.add(lab); z.label = lab;
  });

  // ---------- Avatar ----------
  var avatar = person('avatar', 0, 14.2, 'YOU', 'rgba(0,0,0,.55)');
  var target = null;
  var SPEED = 6.2;
  var openCardSoon = null;
  var hintHidden = false;

  var camFocus = new THREE.Vector3(0, 0, 12);
  var ISO = new THREE.Vector3(14, 17, 14);
  function placeCamera() {
    cam.position.copy(camFocus).add(ISO);
    cam.lookAt(camFocus.x, 0.6, camFocus.z);
  }

  function applyTheme() {
    var c = COLORS[dark ? 'dark' : 'light'];
    scene.background = new THREE.Color(c.bg);
    scene.fog = new THREE.Fog(c.bg, 55, 110);
    hemi.intensity = c.hemi; dir.intensity = c.dir;
    tintables.forEach(function (m) { if (m.userData.key && c[m.userData.key] !== undefined) m.color.setHex(c[m.userData.key]); });
    document.body.classList.toggle('light', !dark);
    document.getElementById('themebtn').textContent = dark ? '☀️' : '🌙';
    try { localStorage.setItem('pko-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  document.getElementById('themebtn').addEventListener('click', function () { dark = !dark; applyTheme(); });

  var cardwrap = document.getElementById('cardwrap');
  var visited = {};
  var tourlist = document.getElementById('tourlist');
  ZONES.forEach(function (z) {
    var el = document.createElement('div');
    el.className = 'touritem'; el.id = 'tour-' + z.id;
    el.innerHTML = '<span class="box"></span><span>' + z.name + '</span>';
    el.addEventListener('click', function () { target = new THREE.Vector3(z.x, 0, z.z); openCardSoon = z; });
    tourlist.appendChild(el);
  });
  document.getElementById('tourhead').addEventListener('click', function () {
    document.getElementById('tour').classList.toggle('open');
  });
  function markVisited(z) {
    if (visited[z.id]) return;
    visited[z.id] = true;
    var el = document.getElementById('tour-' + z.id);
    if (el) { el.classList.add('done'); el.querySelector('.box').textContent = '✓'; }
    var n = Object.keys(visited).length;
    document.getElementById('tourcount').textContent = (n === ZONES.length) ? 'Done ✓' : (n + ' / ' + ZONES.length);
  }
  function openCard(z) {
    document.getElementById('cardtag').textContent = z.tag;
    document.getElementById('cardtitle').textContent = z.title;
    document.getElementById('cardtext').textContent = z.text;
    var chips = document.getElementById('cardchips');
    chips.innerHTML = '';
    z.chips.forEach(function (c) {
      var s = document.createElement('span'); s.className = 'chip'; s.textContent = c; chips.appendChild(s);
    });
    chips.style.display = z.chips.length ? 'flex' : 'none';
    var links = document.getElementById('cardlinks');
    links.innerHTML = '';
    z.links.forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'btn ' + (l.primary ? 'primary' : 'ghost');
      a.href = l.url; a.textContent = l.label;
      if (l.url.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
      links.appendChild(a);
    });
    links.style.display = z.links.length ? 'flex' : 'none';
    cardwrap.classList.add('show');
    markVisited(z);
  }
  function closeCard() { cardwrap.classList.remove('show'); }
  document.getElementById('cardclose').addEventListener('click', closeCard);
  cardwrap.addEventListener('click', function (e) { if (e.target === cardwrap) closeCard(); });

  // ---------- Pointer: walk + tap zones ----------
  var ray = new THREE.Raycaster();
  var groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  var downAt = 0, downX = 0, downY = 0;
  function hideHint() {
    if (hintHidden) return; hintHidden = true;
    document.getElementById('hint').classList.add('fadeout');
  }
  canvas.addEventListener('pointerdown', function (e) { downAt = performance.now(); downX = e.clientX; downY = e.clientY; });
  canvas.addEventListener('pointerup', function (e) {
    if (performance.now() - downAt > 350) return;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 12) return;
    var ndc = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    var pt = new THREE.Vector3();
    if (ray.ray.intersectPlane(groundPlane, pt)) {
      for (var j = 0; j < ZONES.length; j++) {
        var z = ZONES[j];
        if (Math.hypot(pt.x - z.x, pt.z - z.z) < z.r) {
          target = new THREE.Vector3(z.x, 0, z.z); openCardSoon = z; hideHint(); return;
        }
      }
      var lim = FLOOR / 2 - 1.2;
      pt.x = Math.max(-lim, Math.min(lim, pt.x));
      pt.z = Math.max(-lim, Math.min(lim, pt.z));
      pt.y = 0; target = pt; openCardSoon = null; hideHint();
    }
  });
  document.getElementById('simplebtn').addEventListener('click', function () { simple.classList.add('show'); });

  // ---------- Loop ----------
  var clock = new THREE.Clock();
  var fpsAcc = 0, fpsN = 0, fpsChecked = false;
  var tmpV = new THREE.Vector3();
  function tick() {
    requestAnimationFrame(tick);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime;

    if (target) {
      var dx = target.x - avatar.position.x, dz = target.z - avatar.position.z;
      var d = Math.hypot(dx, dz);
      if (d < 0.15) {
        target = null;
        avatar.position.y = 0;
        if (openCardSoon) { openCard(openCardSoon); openCardSoon = null; }
      } else {
        var step = Math.min(d, SPEED * dt);
        avatar.position.x += dx / d * step;
        avatar.position.z += dz / d * step;
        avatar.rotation.y = Math.atan2(dx, dz);
        avatar.position.y = Math.abs(Math.sin(t * 10)) * 0.07;
      }
    }

    ZONES.forEach(function (z, i) {
      if (z.ring) { var s = 1 + Math.sin(t * 2.4 + i) * 0.12; z.ring.scale.set(s, s, 1); }
      if (z.label) z.label.position.y = 3.1 + Math.sin(t * 1.6 + i * 1.3) * 0.08;
      if (!visited[z.id] && Math.hypot(avatar.position.x - z.x, avatar.position.z - z.z) < z.r) markVisited(z);
    });

    tmpV.set(avatar.position.x, 0, avatar.position.z);
    camFocus.lerp(tmpV, 0.06);
    placeCamera();
    renderer.render(scene, cam);

    if (!fpsChecked) {
      fpsAcc += dt; fpsN++;
      if (fpsN >= 90) {
        fpsChecked = true;
        if (fpsN / fpsAcc < 38) { renderer.shadowMap.enabled = false; renderer.setPixelRatio(1); }
      }
    }
  }

  resize();
  applyTheme();
  placeCamera();
  tick();

  setTimeout(function () {
    document.getElementById('loader').classList.add('fadeout');
    if (!/[?&]nocard/.test(location.search)) openCard(ZONES[0]);
  }, 350);
})();
