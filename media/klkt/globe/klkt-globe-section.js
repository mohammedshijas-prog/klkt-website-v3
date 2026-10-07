/* KLKT globe section: scroll-driven globe-to-map canvas + live counter. Load after the section markup. */
(function () {
  var root = document.querySelector('.klkt-globe');
  if (!root) return;
  var stage = root.closest('.klkt-stage');
  var canvas = root.querySelector('.klkt-globe__canvas');
  var countEl = root.querySelector('.klkt-globe__count');
  var flags = [].slice.call(root.querySelectorAll('.klkt-flag'));
  var ctx = canvas.getContext('2d');

  var COLS = 360, ROWS = 140, LON0 = -180, LAT0 = 84, STEP = 1, RAD = Math.PI / 180;
  var GRID = 'AAAAAAAAAAAAAAAAAAAAAADg/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/v8/AOD//z8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+///D/////5//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAH/j/+//////8PAAAAgB0AAHgAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAOD//wP8//////8BAACAfx4AAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAA4+I73//n///////8AAAAAfwAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAOAQACDwP4D///////8BAAAAPAQAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAADzAgPP5H8D//////38AAAAAAAAAAAAA4AEAAAD+DwAAAAAAAAAAAAAAAAAAAIC/g7PfBwAA/v////8AAAAAAAAAAADgBwAAwP//PwAA4B8AAAAAAAAAAAAAAAAMAAD8AgAA+P////8AAAAAAAAAAABwAAAA/P//AwAAAAAAAAAAAAAAAAAAAP8Ahvc5OwAA8P///38AAAAAAAAAAAAcAADg////34cHAAcAAAAAAAAAAAAAgN9/xzf8RwAA4P///z8AAAAAAAAAAAAPAB7g//////8fgB8AAAAAAT4AAAAAAO//B3f8/wsA4P///z8AAAAAAAAAAAAPAG////////8f2f8HAAAAAAD4HwAAAAD8H/D4/38A4P///xMAAAAAAPAHAAAAgN//////////////DwAAAAD+///h/4//H+/Bg/8BwP7//w8AAAAAwP8fAAAAj9///////////////88//v//////////////////////////////DwAA/P8cgEEAAAAAAAAAAAAAAAAA8P//////////////////////////////AwAA4AwAAGAAAAAAAAAAAAAAAAAAIP7/////////////////////////////AQBg4AAAABAAAAAAAAAAAAAAAAAAAf//////////////////////////////AByADwAAAAAAAAAAAAAAAAAAAAAAQID4///////////Pw/0DAP8HAMAfAACA//F//v////////////////////8/AAP4///////////BBPAHAP4HAAAAAADg//z///////////////////////9/AID///////////8AQ8ABAPwBAAAAAAD8P/7///////////////////////9fAMD//////////z8AwA8AAPgBAAAAAAD+H/7/////////////////////Of8BAID///z//////z8AwD8AAMABAAAAAAD+P/z///////////////////9/wH8AAAD8MwD//////x8AwH8MAAAAAAAAAAD+P2D///////////////////95cAAAAACAAwD8/////38AwP8eAAAAAAAAgAGcH/D//////////////////wEAOAAAAADADgDA/////38AgP8/AAAAAAAAwANAH/T//////////////////wAAfgAAAAAwAAAA//////8PgP8/AAAAAAAAwAFwD/7/////////////////PwAAfwAAAAAGAAAA//////8/wP//AAAAAAAAwAOwA/7/////////////////DwCAPwAAAIAAAAAA/v//////8///BwAAAAAAOAcgcP//////////////////HwAAHwAAAAAAAACA+P//////4///DwAAAAAAOA74/////////////////////wUADwAAAAAAAAAA8P//////4///DwAAAAAAGD///////////////////////wUAAwAAAAAAAAAA8P//////7///FwAAAAAAAB///////////////////////wUAAgAAAAAAAAAA0P//////////CAAAAAAAgOH//////////////////////w0AAAAAAAAAAAAAYP////////8xLAAAAAAAAPz//////////////////////wwAAAAAAAAAAAAAAP7//////38HfgAAAAAAgP///////////////////////wQAAAAAAAAAAAAAAP3///////8HUAAAAAAAAP7/////////////////////fwQAAAAAAAAAAAAAAP////////+XAAAAAAAAAPz///93/D/+////////////PwwAAAAAAAAAAAAAAP////////9/AAAAAAAAAPj//f9j/g/+////////////HwAAAAAAAAAAAAAAAP////////8MAAAAAAAAAPj/+P8B/Mf/////////////DwQAAAAAAAAAAAAAAP///////z8AAAAAAAAAcPzH8/8A8I//////////////Bx4AAAAAAAAAAAAAAP///////x8AAAAAAAAA+H+Aw/8AwA/+//////////9/AA8AAAAAAAAAAAAAAP///////x8AAAAAAAAA+D8Aj//w4R/8//////////8/AAAAAAAAAAAAAAAAAP///////wMAAAAAAAAA+B8wuE/+/z/+/////////98fAAMAAAAAAAAAAAAAAP///////wMAAAAAAAAA+A8wEMf//x/+/////////0cOAAMAAAAAAAAAAAAAAP7//////wEAAAAAAAAA+A8AAI7//x/8/////////wMOAAEAAAAAAAAAAAAAAP7//////wAAAAAAAAAA+AcABob//z/8/////////zccwAEAAAAAAAAAAAAAAPz//////wAAAAAAAAAAQOB/AAQ2/////////////x8c8AEAAAAAAAAAAAAAAPj//////wAAAAAAAAAAQPx/AAAA/////////////w8Y/gEAAAAAAAAAAAAAAPD/////fwAAAAAAAAAA4P8/AAAA/////////////w+EGwAAAAAAAAAAAAAAAMD/////HwAAAAAAAAAA8P9/AACA/////////////x/AAwAAAAAAAAAAAAAAAID/////DwAAAAAAAAAA+P//BwaA/////////////x/AAAAAAAAAAAAAAAAAAID9////BwAAAAAAAAAA/P//D3+E/////////////z9AAAAAAAAAAAAAAAAAAAD5////BwAAAAAAAAAA/P//f////////////////x8AAAAAAAAAAAAAAAAAAADy/x8GBgAAAAAAAAAA/P/////v/8///////////z8AAAAAAAAAAAAAAAAAAAD0/w8ABgAAAAAAAAAA/v////+//4///////////z8AAAAAAAAAAAAAAAAAAADu/wcADgAAAAAAAACA//////8f/x/+/////////x8AAAAAAAAAAAAAAAAAAACI/wcALAAAAAAAAADA//////8//z/g/////////w8AAAAAAAAAAAAAAAAAAACQ/wcACAAAAAAAAADg//////9//r+A/////////wcAAAAAAAAAAAAAAAAAAAAQ/wMAAAAAAAAAAADg//////9//n8cgP///////ycAAAAAAAAAAAAAAAAAAAAA/gMAAAAAAAAAAADw////////+P9/AP///////xEAAAAAAAAAAAAAAAAAAAAA/AMAHQAAAAAAAADw////////+P//APz/f///fxAAAAAAAAAAAAAAAAAAAAAA+AcAYAAAAAAAAAD4////////+f9/APz/B///BgAAAAAAAAAAAAAAAAAAAAAA/AccgAEAAAAAAADw////////8f9/AOD/B/5/AAAAAAAAAAAAAAAAAQAAAAAA+A8eADgAAAAAAADw////////4f8/AOD/Afw/BgAAAAAAAAAAAAAAAAAAAAAA8J8PAPwCAAAAAADw////////4/8fAOD/APw/AgAAAAAAAAAAAAAAAAAAAAAAgP8PAAAAAAAAAADw////////x/8HAOB/APx/ADAAAAAAAAAAAAAAAAAAAAAAAP4PAAAAAAAAAAD4////////h/8BAOA/APz/ADAAAAAAAAAAAAAAAAAAAAAAAID/AAAAAAAAAAD4////////j/8AAMAPAMD/ATAAAAAAAAAAAAAAAAAAAAAAAAD/AQAAAAAAAAD4////////nx8AAMAPAMD/ATAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAD4////////vwcAAIAPAMD/AcAAAAAAAAAAAAAAAAAAAAAAAADgAQAAAAAAAAD4////////fwAAAIAPAMD8AQABAAAAAAAAAAAAAAAAAAAAAADAAAgAAAAAAADw////////f2AAAAAPAID4AUACAAAAAAAAAAAAAAAAAAAAAADAAe9zAAAAAADg/////////34AAAAPAEBwAAgAAAAAAAAAAAAAAAAAAAAAAAAAE+9/AAAAAADA/////////38AAAAXAEAgAAQCAAAAAAAAAAAAAAAAAAAAAAAAz///AAAAAACA/////////z8AAAASAMAAAIACAAAAAAAAAAAAAAAAAAAAAAAAyP//AQAAAACA/////////z8AAAAwAIAAAEAHAAAAAAAAAAAAAAAAAAAAAAAAgP//AwAAAAAA/v///////x8AAAAwAAADAAMBAAAAAAAAAAAAAAAAAAAAAAAAwP//fwAAAAAA/A/+/////x8AAAAAAAAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAgP///wAAAAAAEAD8/////w8AAAAAADAGwAcAAAAAAAAAAAAAAAAAAAAAAAAAgP///wEAAAAAAADA/////wcAAAAAAGAG4AEAAAAAAAAAAAAAAAAAAAAAAAAA4P///wEAAAAAAADA/////wMAAAAAAMAM+AMAAAAAAAAAAAAAAAAAAAAAAAAA4P///wMAAAAAAADg/////wEAAAAAAIAL/gMQAAAAAAAAAAAAAAAAAAAAAAAA8P///wMAAAAAAADg////fwAAAAAAAIAH/vMQAAAAAAAAAAAAAAAAAAAAAAAA8P///wcAAAAAAADg////PwAAAAAAAAAP/gMAAQAAAAAAAAAAAAAAAAAAAAAA+P///38AAAAAAADg////PwAAAAAAAAAO/DmAAwAAAAAAAAAAAAAAAAAAAAAA+P///38BAAAAAADA////HwAAAAAAAAA+/DkA8gAAAAAAAAAAAAAAAAAAAAAA8P////8fAAAAAACA////DwAAAAAAAAA8wChE/gcAAAAAAAAAAAAAAAAAAAAA+P////8/AAAAAACA////BwAAAAAAAAA4AEAA8B8AAAAAAAAAAAAAAAAAAAAA+P//////AQAAAAAA////BwAAAAAAAAAwAEAAxD8NAAAAAAAAAAAAAAAAAAAA+P//////AQAAAAAA////BwAAAAAAAADAAQAAxP+AAAAAAAAAAAAAAAAAAAAA8P//////AQAAAAAA/v//BwAAAAAAAACAHwAAwH8ABAAAAAAAAAAAAAAAAAAA4P//////AQAAAAAA/v//BwAAAAAAAAAAQFYEAMcAAAAAAAAAAAAAAAAAAAAA4P//////AAAAAAAA/v//DwAAAAAAAAAAAAgBAIABMAAAAAAAAAAAAAAAAAAAwP//////AAAAAAAA/v//DwAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAgP////9/AAAAAAAA/P//DwAAAAAAAAAAAAAAAQQAAAAAAAAAAAAAAAAAAAAAgP////8/AAAAAAAA/v//HyAAAAAAAAAAAACAHwQAAAAAAAAAAAAAAAAAAAAAAP////8fAAAAAAAA/v//HyAAAAAAAAAAAADADwwAAAAAAAAAAAAAAAAAAAAAAP////8fAAAAAAAA////HzAAAAAAAAAAAADsDxwAAAAAAAAAAAAAAAAAAAAAAP7///8fAAAAAAAA////DzgAAAAAAAAAAAD/DxwAAAAA//////////////////////////////////////////////////////////9/AAAAAAAAAAAAAAAAAOD///8fAAAAAAAA////Ax8AAAAAAAAAAMD//z4AAABAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA////AB8AAAAAAAAAAMD//z8AAAAAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA/v9/AB8AAAAAAAAAAOD//38AAAAAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA/v9/AB8AAAAAAAAAAPz///8BAAEAAAAAAAAAAAAAAAAAAMD///8HAAAAAAAA/P9/gA8AAAAAAAAAgP////8BAAIAAAAAAAAAAAAAAAAAAMD///8DAAAAAAAA/P//gA8AAAAAAAAAwP////8DAAAAAAAAAAAAAAAAAAAAAMD//38AAAAAAAAA/P9/AA8AAAAAAAAAwP////8HAAAAAAAAAAAAAAAAAAAAAOD//x8AAAAAAAAA+P9/AAcAAAAAAAAA4P////8PAAAAAAAAAAAAAAAAAAAAAOD//w8AAAAAAAAA+P8fAAIAAAAAAAAAwP////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA+P8fAAAAAAAAAAAA4P////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA+P8fAAAAAAAAAAAAwP////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA8P8PAAAAAAAAAAAAgP////8/AAAAAAAAAAAAAAAAAAAAAOD//wMAAAAAAAAA4P8HAAAAAAAAAAAAgP////8fAAAAAAAAAAAAAAAAAAAAAPD//wMAAAAAAAAA4P8HAAAAAAAAAAAAgP////8fAAAAAAAAAAAAAAAAAAAAAPD//wEAAAAAAAAAwP8DAAAAAAAAAAAAAP////8fAAAAAAAAAAAAAAAAAAAAAOD//wAAAAAAAAAAwP8BAAAAAAAAAAAAAP8D/P8PAAAAAAAAAAAAAAAAAAAAAPD/fwAAAAAAAAAAwH8AAAAAAAAAAAAAgP8A2P8HAAAAAAAAAAAAAAAAAAAAAPD/OwAAAAAAAAAAgAEAAAAAAAAAAAAAAAcA6P8HAAAAAAAAAAAAAAAAAAAAAPj/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwP8DAAACAAAAAAAAAAAAAAAAAPj/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8DAAAEAAAAAAAAAAAAAAAAAPz/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8DAAAIAAAAAAAAAAAAAAAAAPj/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGgAAAA4AAAAAAAAAAAAAAAAAPg/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAPw/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAPwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAALAAAAAAAAAAAAAAAAAPwfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAIADAAAAAAAAAAAAAAAAAPgHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAMABAAAAAAAAAAAAAAAAAPwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAP4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAP4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAP4DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH6AAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

  var bin = atob(GRID), bits = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bits[i] = bin.charCodeAt(i);

  var CITIES = '35.7,139.7;28.6,77.2;31.2,121.5;23.8,90.4;-23.5,-46.6;30.0,31.2;19.4,-99.1;39.9,116.4;19.1,72.9;34.7,135.5;24.9,67.0;29.6,106.5;41.0,28.9;-34.6,-58.4;22.6,88.4;6.5,3.4;-4.3,15.3;14.6,121.0;39.1,117.2;23.1,113.3;-22.9,-43.2;31.5,74.3;13.0,77.6;55.8,37.6;22.5,114.1;-6.2,106.8;13.1,80.3;-12.0,-77.0;13.8,100.5;37.6,127.0;17.4,78.5;51.5,-0.1;35.7,51.4;41.9,-87.6;30.6,104.1;32.1,118.8;30.6,114.3;10.8,106.7;-8.8,13.2;23.0,72.6;3.1,101.7;34.3,108.9;22.3,114.2;30.3,120.2;41.8,123.4;24.7,46.7;33.3,44.4;-33.5,-70.7;21.2,72.8;40.4,-3.7;31.3,120.6;18.5,73.9;45.8,126.6;29.8,-95.4;32.8,-96.8;43.7,-79.4;-6.8,39.3;25.8,-80.2;-19.9,-43.9;1.35,103.8;40.0,-75.1;33.7,-84.4;33.6,130.4;15.5,32.5;41.4,2.2;-26.2,28.0;59.9,30.3;36.1,120.4;5.3,-4.0;16.8,96.2;31.2,29.9;20.7,-103.3;39.9,32.9;22.3,91.8;9.0,38.7;25.7,-100.3;-1.3,36.8;-33.9,151.2;-37.8,145.0;-33.9,18.4;33.6,-7.6;52.5,13.4;41.9,12.5;48.9,2.35;34.1,-118.2;40.7,-74.0;25.2,55.3;25.3,51.5;29.4,48.0;31.9,35.9;5.6,-0.2;0.35,32.6;36.8,3.1;36.8,10.2;10.5,-66.9;4.7,-74.1;-0.2,-78.5;49.3,-123.1;47.6,-122.3;39.7,-105.0;52.2,21.0;50.5,30.5;44.4,26.1;38.0,23.7;38.7,-9.1;53.3,-6.3;59.3,18.1;55.7,12.6;52.4,4.9;50.8,4.4;48.2,16.4;45.5,9.2;-36.8,174.8;-31.95,115.9;-27.5,153.0;41.3,69.3;43.2,76.9;40.4,49.9;6.9,79.9;27.7,85.3;21.0,105.8;25.0,121.6;35.2,129.1;43.1,141.3'
    .split(';').map(function (s) { var p = s.split(','); return [+p[0], +p[1]]; });

  // Per dot: flatX01, flatY01, heat, sinLat, cosLat, sinLon, cosLon
  var S = 7, tmp = [];
  for (var r0 = 0; r0 < ROWS; r0++) {
    var lat = LAT0 - (r0 + 0.5) * STEP;
    for (var c0 = 0; c0 < COLS; c0++) {
      var idx = r0 * COLS + c0;
      if (!((bits[idx >> 3] >> (idx & 7)) & 1)) continue;
      var lon = LON0 + (c0 + 0.5) * STEP, heat = 0;
      for (var k = 0; k < CITIES.length; k++) {
        var dla = lat - CITIES[k][0], dlo = (lon - CITIES[k][1]) * Math.cos(lat * RAD);
        var d2 = dla * dla + dlo * dlo;
        if (d2 < 90) heat += Math.exp(-d2 / 14);
      }
      tmp.push((lon - LON0) / 360, (LAT0 - lat) / (ROWS * STEP), Math.min(1, heat),
               Math.sin(lat * RAD), Math.cos(lat * RAD), Math.sin(lon * RAD), Math.cos(lon * RAD));
    }
  }
  var D = new Float32Array(tmp), N = D.length / S;
  tmp = null;

  flags.forEach(function (el) {
    var ll = el.getAttribute('data-ll').split(',');
    var la = +ll[0] * RAD, lo = +ll[1] * RAD;
    el._p = [(+ll[1] - LON0) / 360, (LAT0 - +ll[0]) / (ROWS * STEP),
             Math.sin(la), Math.cos(la), Math.sin(lo), Math.cos(lo)];
  });

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, dpr = 1, mapX = 0, mapY = 0, mapW = 0, mapH = 0, cx = 0, cy = 0, Rg = 0;
  var t = still ? 1 : 0, rot = 0, lastTs = 0, rafId = 0, onScreen = false;
  var flatLayer = document.createElement('canvas'), flatReady = false;

  var BUCKETS = 10, paths = new Array(BUCKETS);

  function tone(b) { // b = 0..BUCKETS-1
    var v = b / (BUCKETS - 1);
    return [Math.round(116 + 139 * v), Math.round(86 + 166 * v), Math.round(190 + 65 * v), 0.4 + 0.6 * v];
  }

  // Pretty, glow-bearing version of the flat map - only drawn once it settles.
  function buildFlat() {
    flatLayer.width = Math.round(W * dpr); flatLayer.height = Math.round(H * dpr);
    var g = flatLayer.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    var cell = mapW / COLS, rad = Math.max(0.65, cell * 0.3);
    g.globalCompositeOperation = 'lighter';
    g.fillStyle = 'rgba(156, 99, 255, 0.085)';
    for (var i = 0; i < N; i++) {
      var h = D[i * S + 2]; if (h < 0.45) continue;
      g.beginPath();
      g.arc(mapX + D[i * S] * mapW, mapY + D[i * S + 1] * mapH, rad * (3 + h * 3), 0, 6.2832);
      g.fill();
    }
    g.globalCompositeOperation = 'source-over';
    for (var j = 0; j < N; j++) {
      var hh = D[j * S + 2], col = tone(Math.round(hh * (BUCKETS - 1)));
      g.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + col[3].toFixed(3) + ')';
      g.beginPath();
      g.arc(mapX + D[j * S] * mapW, mapY + D[j * S + 1] * mapH, rad * (1 + hh * 0.5), 0, 6.2832);
      g.fill();
    }
    flatReady = true;
  }

  function layout() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width) return false;
    W = rect.width; H = rect.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    mapW = W; mapH = W * ROWS / COLS; mapX = 0; mapY = (H - mapH) * 0.40;
    cx = W / 2; cy = H / 2; Rg = Math.min(W * 0.34, H * 0.40);
    flatReady = false;
    return true;
  }

  function render(dt) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (t > 0.995) {                       // settled flat - use the cached pretty layer
      if (!flatReady) buildFlat();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(flatLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      placeFlags(1);
      return;
    }

    if (!still) rot += dt * 0.00022 * (1 - t) * (1 - t);
    var sr = Math.sin(rot), cr = Math.cos(rot);

    // sphere body, fading out as it flattens
    if (t < 0.92) {
      var grd = ctx.createRadialGradient(cx - Rg * 0.35, cy - Rg * 0.4, Rg * 0.1, cx, cy, Rg);
      grd.addColorStop(0, 'rgba(92, 56, 168, ' + (0.55 * (1 - t)).toFixed(3) + ')');
      grd.addColorStop(1, 'rgba(32, 14, 78, ' + (0.5 * (1 - t)).toFixed(3) + ')');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, Rg * (1 + t * 0.4), 0, 6.2832); ctx.fill();
    }

    var backFade = t < 0.15 ? 0 : Math.min(1, (t - 0.15) / 0.6);
    var size = Math.max(1, (mapW / COLS) * (0.55 + 0.45 * t));
    for (var b = 0; b < BUCKETS; b++) paths[b] = null;

    for (var i = 0; i < N; i++) {
      var o = i * S;
      var sinLat = D[o + 3], cosLat = D[o + 4], sinLon = D[o + 5], cosLon = D[o + 6];
      var sd = sinLon * cr - cosLon * sr, cd = cosLon * cr + sinLon * sr;
      var gx = cx + Rg * cosLat * sd, gy = cy - Rg * sinLat;
      var fx = mapX + D[o] * mapW, fy = mapY + D[o + 1] * mapH;
      var x = gx + (fx - gx) * t, y = gy + (fy - gy) * t;
      var vis = cd > 0 ? 1 : backFade;
      if (vis <= 0.02) continue;
      var b2 = Math.round(D[o + 2] * vis * (BUCKETS - 1));
      var p = paths[b2] || (paths[b2] = new Path2D());
      p.rect(x, y, size, size);
    }
    for (var b3 = 0; b3 < BUCKETS; b3++) {
      if (!paths[b3]) continue;
      var col = tone(b3);
      ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + col[3].toFixed(3) + ')';
      ctx.fill(paths[b3]);
    }
    placeFlags(t, sr, cr);
  }

  function placeFlags(tt, sr, cr) {
    if (sr === undefined) { sr = Math.sin(rot); cr = Math.cos(rot); }
    var show = tt < 0.30 ? 0 : Math.min(1, (tt - 0.30) / 0.45);
    for (var i = 0; i < flags.length; i++) {
      var el = flags[i], p = el._p;
      var sd = p[4] * cr - p[5] * sr, cd = p[5] * cr + p[4] * sr;
      var gx = cx + Rg * p[3] * sd, gy = cy - Rg * p[2];
      var fx = mapX + p[0] * mapW, fy = mapY + p[1] * mapH;
      var x = gx + (fx - gx) * tt, y = gy + (fy - gy) * tt;
      var a = show * (cd > 0 ? 1 : tt > 0.8 ? 1 : 0);
      el.style.transform = 'translate3d(' + (x | 0) + 'px,' + (y | 0) + 'px,0) translate(-50%,-50%) scale(' + (0.7 + 0.3 * tt).toFixed(3) + ')';
      el.style.opacity = a.toFixed(3);
    }
  }

  function progress() {
    if (still || !stage) return 1;
    var r = stage.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    if (span <= 0) return 1;
    var p = Math.min(1, Math.max(0, -r.top / span));
    p = Math.min(1, Math.max(0, (p - 0.10) / 0.50));
    return p * p * (3 - 2 * p);               // smoothstep
  }

  function frame(ts) {
    var dt = lastTs ? Math.min(64, ts - lastTs) : 16; lastTs = ts;
    var nt = progress();
    if (Math.abs(nt - t) > 0.0005 || t < 0.995 || !flatReady) { t = nt; root.style.setProperty('--t', t.toFixed(4)); render(dt); }
    rafId = requestAnimationFrame(frame);
  }
  function start() { if (rafId || !onScreen || document.hidden) return; lastTs = 0; rafId = requestAnimationFrame(frame); }
  function stop() { if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  // 100,000 contributors x 4 hours = 24,000,000 minutes; +1 each second, from page load.
  var BASE = 60 * 4 * 100000, t0 = Date.now(), fmt = new Intl.NumberFormat('en-US');
  var plusEl = root.querySelector('.klkt-plus');
  var digitBox = countEl.firstElementChild || countEl;
  var prev = '';

  function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  function tick(first) {
    var str = fmt.format(BASE + Math.floor((Date.now() - t0) / 1000));
    if (str === prev) return;
    if (digitBox.childElementCount !== str.length) {
      digitBox.textContent = '';
      for (var i = 0; i < str.length; i++) {
        var sp = document.createElement('span');
        sp.className = 'klkt-digit';
        sp.textContent = str.charAt(i);
        digitBox.appendChild(sp);
      }
    } else {
      for (var j = 0; j < str.length; j++) {
        var d = digitBox.children[j];
        if (d.textContent === str.charAt(j)) continue;   // only roll digits that changed
        d.textContent = str.charAt(j);
        if (!still && !first) replay(d, 'is-tick');
      }
    }
    if (!still && !first && plusEl) replay(plusEl, 'is-on');
    prev = str;
  }
  tick(true);
  setInterval(function () { tick(false); }, 1000);   // browsers already suspend CSS animation while hidden

  function boot() { if (layout()) { t = progress(); root.style.setProperty('--t', t.toFixed(4)); render(16); } }
  boot();
  window.addEventListener('resize', function () { boot(); });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; onScreen ? start() : stop(); },
      { rootMargin: '200px' }).observe(stage || root);
  } else { onScreen = true; start(); }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
})();
