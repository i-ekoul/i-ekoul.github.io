/* Portfolio page logic: board, replay, carousel and tab bar. */
var OPERA = ['e4','e5','Nf3','d6','d4','Bg4','dxe5','Bxf3','Qxf3','dxe5','Bc4','Nf6','Qb3','Qe7','Nc3','c6','Bg5','b5','Nxb5','cxb5','Bxb5+','Nbd7','O-O-O','Rd8','Rxd7','Rxd7','Rd1','Qe6','Bxd7+','Nxd7','Qb8+','Nxb8','Rd8#'];
var SRC = {
wk: '/assets/pieces/wk.svg', wq: '/assets/pieces/wq.svg', wr: '/assets/pieces/wr.svg',
wb: '/assets/pieces/wb.svg', wn: '/assets/pieces/wn.svg', wp: '/assets/pieces/wp.svg',
bk: '/assets/pieces/bk.svg', bq: '/assets/pieces/bq.svg', br: '/assets/pieces/br.svg',
bb: '/assets/pieces/bb.svg', bn: '/assets/pieces/bn.svg', bp: '/assets/pieces/bp.svg'
};
var NAMES = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
var VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
var LIGHT = '#E6DCC3', DARK = '#4F7D63', LIGHT_HI = '#E8D98A', DARK_HI = '#8FA85A', SEL = '#C9A95A';
var BARS = [38, 52, 44, 61, 57, 70, 64, 76, 69, 82, 74, 88, 80, 92];
var TAB_ON = 'position:relative;z-index:1;min-height:40px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:#0D1117;font:500 13px/1 Geist,system-ui,sans-serif;cursor:pointer;white-space:nowrap;transition:color .25s ease';
var TAB_OFF = 'position:relative;z-index:1;min-height:40px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:#AEB6C1;font:500 13px/1 Geist,system-ui,sans-serif;cursor:pointer;white-space:nowrap;transition:color .25s ease';
// A modern tartan: navy ground, forest-green bands, a thin red and ivory overcheck.
var SETT = 'background-color:#1B2B44;background-size:auto,auto,64px 64px,64px 64px;background-image:' +
'linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,0) 40%, rgba(0,0,0,.28)),' +
'repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px),' +
'linear-gradient(90deg, transparent 0 6px, rgba(32,79,60,.9) 6px 22px, transparent 22px 27px, rgba(32,79,60,.9) 27px 31px, transparent 31px 41px, rgba(160,55,47,.8) 41px 43px, transparent 43px 52px, rgba(232,222,198,.4) 52px 53px, transparent 53px 64px),' +
'linear-gradient(0deg, transparent 0 6px, rgba(32,79,60,.55) 6px 22px, transparent 22px 27px, rgba(32,79,60,.55) 27px 31px, transparent 31px 41px, rgba(160,55,47,.5) 41px 43px, transparent 43px 52px, rgba(232,222,198,.25) 52px 53px, transparent 53px 64px)';

var TABS = [
{ id: 'top', label: 'Home', icon: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' },
{ id: 'work', label: 'Work', icon: 'M4 7h16v12H4zM9 7V5h6v2' },
{ id: 'play', label: 'Play', icon: 'M12 3a2.6 2.6 0 0 1 1.7 4.6L15 13H9l1.3-5.4A2.6 2.6 0 0 1 12 3zM8.5 13h7M7 21h10l-1.2-4.5H8.2z' },
{ id: 'experience', label: 'Career', icon: 'M4 6h16M4 12h16M4 18h10' },
{ id: 'contact', label: 'Contact', icon: 'M4 6h16v12H4zM4 7l8 6 8-6' }
];

function newGame() { return window.EGChess ? new window.EGChess() : null; }

// Simple bot: mate if it can, else the best capture (net of an immediate recapture), else a developing move.
function botMove(g) {
var moves = g.moves({ verbose: true });
if (!moves.length) return null;
var best = null, bestScore = -1e9;
moves.forEach(function (m) {
var s = Math.random() * 0.6;
g.move(m);
if (g.isCheckmate()) s += 1000;
else {
if (g.inCheck()) s += 0.4;
var worst = 0;
g.moves({ verbose: true }).forEach(function (r) { if (r.captured) worst = Math.max(worst, VALUE[r.captured]); });
s -= worst * 0.9;
}
g.undo();
if (m.captured) s += VALUE[m.captured];
if (m.promotion) s += 8;
if ((m.piece === 'n' || m.piece === 'b') && (m.from[1] === '8')) s += 0.3;
if (s > bestScore) { bestScore = s; best = m; }
});
return best;
}

class Component extends DCLogic {
constructor(props) {
super(props);
this.game = newGame();
this.state = { mode: 'play', tick: 0, selected: null, last: null, ply: 0, playing: true, thinking: false, isMobile: false, active: 'top', slide: 0, kn: 0, kg: 0 };
}
componentDidMount() {
this.mq = window.matchMedia('(max-width: 700px)');
this.onMq = () => this.setState({ isMobile: this.mq.matches });
this.onMq();
if (this.mq.addEventListener) this.mq.addEventListener('change', this.onMq);
this.onScroll = () => {
var ids = ['top', 'work', 'play', 'experience', 'contact'], cur = 'top';
ids.forEach(function (id) { var el = document.getElementById(id); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) cur = id; });
if (cur !== this.state.active) this.setState({ active: cur });
};
window.addEventListener('scroll', this.onScroll, { passive: true });
this.onScroll();
this.wl = document.getElementById('worklist');
this.onSlide = () => {
var el = this.wl; if (!el) return;
var kids = el.querySelectorAll('article'); var mid = el.scrollLeft + el.clientWidth / 2, best = 0, bd = 1e9;
kids.forEach(function (k, i) { var c = k.offsetLeft + k.offsetWidth / 2; var d = Math.abs(c - mid); if (d < bd) { bd = d; best = i; } });
if (best !== this.state.slide) this.setState({ slide: best });
};
if (this.wl) this.wl.addEventListener('scroll', this.onSlide, { passive: true });
if (!this.game) { this.retry = setInterval(() => { if (window.EGChess) { clearInterval(this.retry); this.game = newGame(); this.bump(); } }, 200); }
this.timer = setInterval(() => {
if (this.state.mode !== 'replay' || !this.state.playing) return;
this.setPly(this.state.ply >= OPERA.length ? 0 : this.state.ply + 1);
}, 1500);
}
componentWillUnmount() { clearInterval(this.timer); clearInterval(this.retry); clearTimeout(this.botTimer); window.removeEventListener('scroll', this.onScroll); if (this.wl) this.wl.removeEventListener('scroll', this.onSlide); if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.onMq); }
bump(extra) { this.setState(Object.assign({ tick: this.state.tick + 1 }, extra || {})); }
setPly(ply) {
var g = newGame(); var last = null;
for (var i = 0; i < ply; i++) { var m = g.move(OPERA[i]); last = [m.from, m.to]; }
this.game = g; this.bump({ ply: ply, last: last, selected: null });
}
setMode(mode) {
clearTimeout(this.botTimer);
if (mode === 'replay') { this.setPly(0); this.setState({ mode: 'replay', playing: true }); }
else { this.game = newGame(); this.bump({ mode: 'play', last: null, selected: null, thinking: false }); }
}
reply() {
var g = this.game; if (!g || g.isGameOver()) return;
this.setState({ thinking: true });
this.botTimer = setTimeout(() => {
var m = botMove(g); if (m) g.move(m);
this.bump({ thinking: false, last: m ? [m.from, m.to] : this.state.last });
}, 450);
}
clickSquare(sq) {
var g = this.game;
if (!g || this.state.mode !== 'play' || this.state.thinking || g.isGameOver() || g.turn() !== 'w') return;
var sel = this.state.selected;
if (sel) {
var mv = g.moves({ square: sel, verbose: true }).filter(function (m) { return m.to === sq; })[0];
if (mv) {
g.move({ from: sel, to: sq, promotion: 'q' });
this.bump({ selected: null, last: [sel, sq] });
this.reply();
return;
}
}
var p = g.get(sq);
this.bump({ selected: p && p.color === 'w' && sel !== sq ? sq : null });
}
caption() {
var g = this.game;
if (this.state.mode === 'replay') {
var ply = this.state.ply;
return [ply === 0 ? 'The Opera Game' : Math.ceil(ply / 2) + (ply % 2 ? '. ' : '... ') + OPERA[ply - 1] + (ply === OPERA.length ? ' · checkmate' : ''), 'Morphy vs. Duke & Count · Paris, 1858'];
}
if (!g) return ['Loading board', ''];
if (g.isCheckmate()) return [g.turn() === 'w' ? 'Checkmate. The bot wins this one.' : 'Checkmate. Nicely played.', 'Start a new game to go again'];
if (g.isDraw() || g.isStalemate()) return ['Draw', 'Start a new game to go again'];
if (this.state.thinking) return ['Bot is thinking…', 'You play white'];
return [g.inCheck() ? 'Check — your move' : 'Your move', this.state.selected ? 'Tap a highlighted square' : 'You play white · tap a piece to move it'];
}
renderVals() {
var g = this.game;
var board = g ? g.board() : [];
var sel = this.state.selected;
var targets = {};
if (g && sel) g.moves({ square: sel, verbose: true }).forEach(function (m) { targets[m.to] = true; });
var last = this.state.last || [];
var squares = [];
for (var row = 0; row < 8; row++) for (var col = 0; col < 8; col++) {
var sq = String.fromCharCode(97 + col) + (8 - row);
var p = board[row] ? board[row][col] : null;
var light = ((row + col) % 2) === 0;
var bg = light ? LIGHT : DARK;
if (last.indexOf(sq) >= 0) bg = light ? LIGHT_HI : DARK_HI;
if (sq === sel) bg = SEL;
var coord = light ? DARK : LIGHT;
squares.push({
src: p ? SRC[p.color + p.type] : '',
dot: !!(targets[sq] && !p),
ring: !!(targets[sq] && p),
label: sq + (p ? ', ' + (p.color === 'w' ? 'white ' : 'black ') + NAMES[p.type] : ', empty'),
click: ((s) => () => this.clickSquare(s))(sq),
style: 'position:relative;display:block;min-width:0;min-height:0;width:100%;height:100%;padding:0;margin:0;border:0;border-radius:0;background:' + bg + ';cursor:' + (this.state.mode === 'play' ? 'pointer' : 'default'),
file: row === 7 ? String.fromCharCode(97 + col) : '',
fileStyle: 'position:absolute;right:3px;bottom:1px;font:600 10px/1 Geist,system-ui,sans-serif;color:' + coord + ';pointer-events:none',
rank: col === 0 ? String(8 - row) : '',
rankStyle: 'position:absolute;left:3px;top:2px;font:600 10px/1 Geist,system-ui,sans-serif;color:' + coord + ';pointer-events:none'
});
}
var cap = this.caption();
var isPlay = this.state.mode === 'play';
return {
tartanBand: SETT + ';height:10px;box-shadow:0 1px 0 rgba(255,255,255,.06)',
tapKnight: () => this.setState({ kn: this.state.kn + 1 }),
tapKing: () => this.setState({ kg: this.state.kg + 1 }),
knightAnim: 'display:inline-block;transform-origin:50% 92%;animation:' + (this.state.kn ? ['pc-lmove .7s cubic-bezier(.3,.7,.2,1)', 'pc-spin .7s cubic-bezier(.4,.1,.2,1)', 'pc-hop .6s ease-out'][(this.state.kn - 1) % 3] : 'none'),
kingAnim: 'display:inline-block;transform-origin:50% 92%;animation:' + (this.state.kg ? ['pc-hop .6s ease-out', 'pc-wobble .7s ease-in-out', 'pc-bow .9s ease-in-out'][(this.state.kg - 1) % 3] : 'none'),
tabs: TABS.map((t) => {
var on = this.state.active === t.id;
return { href: '#' + t.id, label: t.label, icon: t.icon, current: on ? 'page' : 'false',
style: 'flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:52px;border-radius:16px;text-decoration:none;transition:background-color .2s ease,color .2s ease;color:' + (on ? '#0D1117' : '#AEB6C1') + ';background:' + (on ? '#ECE6DA' : 'transparent') };
}),
dots: [0, 1, 2, 3].map((i) => 'display:block;height:6px;border-radius:3px;transition:width .25s ease,background-color .25s ease;width:' + (i === this.state.slide ? '18px' : '6px') + ';background:' + (i === this.state.slide ? '#ECE6DA' : '#3A4554')),
tartanSide: SETT + ';position:absolute;left:14px;top:14px;bottom:14px;width:14px;border-radius:7px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)',
facts: [
{ big: 'Engineering lead', small: 'Leading a distributed team' },
{ big: 'iOS + Android', small: 'Endgame AI, live in both stores' },
{ big: 'Full stack', small: 'Flutter · TypeScript · C# · Python' },
{ big: 'AWS + GCP', small: 'Event-driven services, real-time APIs' }
],
squares: squares,
caption1: cap[0], caption2: cap[1],
isPlay: isPlay, isReplay: !isPlay,
playTabStyle: isPlay ? TAB_ON : TAB_OFF,
thumbStyle: 'position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:999px;background:linear-gradient(180deg,#F5F0E6 0%,#E4DCCD 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.85),inset 0 -1px 0 rgba(23,19,15,.10),0 1px 2px rgba(0,0,0,.45),0 4px 10px -2px rgba(0,0,0,.4);transition:transform .3s cubic-bezier(.3,.7,.2,1);transform:translateX(' + (isPlay ? '0' : '100%') + ')',
statusDot: 'flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:' + (this.state.thinking ? '#E3D27E' : (isPlay ? '#6FBF8E' : '#8FB4F2')) + ';box-shadow:0 0 0 4px ' + (this.state.thinking ? 'rgba(227,210,126,.15)' : (isPlay ? 'rgba(111,191,142,.15)' : 'rgba(143,180,242,.15)')),
playing: this.state.playing, paused: !this.state.playing,
progressStyle: 'height:100%;width:' + Math.round(this.state.ply / OPERA.length * 100) + '%;background:#8FB4F2;border-radius:2px;transition:width .3s ease',
progressText: 'Move ' + Math.ceil(this.state.ply / 2) + ' of ' + Math.ceil(OPERA.length / 2),
replayTabStyle: isPlay ? TAB_OFF : TAB_ON,
toPlay: () => this.setMode('play'),
toReplay: () => this.setMode('replay'),
undo: () => { var g2 = this.game; if (!g2 || this.state.thinking) return; g2.undo(); if (g2.turn() === 'b') g2.undo(); var h = g2.history({ verbose: true }); var l = h[h.length - 1]; this.bump({ selected: null, last: l ? [l.from, l.to] : null }); },
reset: () => this.setMode('play'),
kpis: ['height:14px;width:45%;border-radius:4px;background:#8FB4F2', 'height:14px;width:55%;border-radius:4px;background:#3A4A63', 'height:14px;width:40%;border-radius:4px;background:#3A4A63'],
bars: BARS.map(function (h, i) { return 'flex:1 1 0;height:' + h + '%;border-radius:3px 3px 0 0;background:' + (i === BARS.length - 1 ? '#8FB4F2' : '#2C3A50'); }),
playText: this.state.playing ? 'II' : '▶',
playLabel: this.state.playing ? 'Pause' : 'Play',
toggle: () => this.setState({ playing: !this.state.playing }),
prev: () => { this.setState({ playing: false }); this.setPly(Math.max(0, this.state.ply - 1)); },
next: () => { this.setState({ playing: false }); this.setPly(Math.min(OPERA.length, this.state.ply + 1)); },
roles: [
{ open: !this.state.isMobile || true, when: '2026 – now', title: 'Senior Software Engineer & Engineering Lead', org: 'Endgame AI', note: 'Lead a distributed engineering team and the mobile app; real-time broadcasting, event-driven services, internal tooling and growth-team measurement across a 40+ service platform.' },
{ open: !this.state.isMobile, when: '2025 – now', title: 'Founder', org: 'knead.it', note: 'A cooking project in development, built in my own time.' },
{ open: !this.state.isMobile, when: '2025', title: 'Full-Stack Software Engineer Intern', org: 'SmallChess', note: 'Chess training features in React, TypeScript and Supabase, including a Stockfish-based analysis engine.' },
{ open: !this.state.isMobile, when: '2022 – 2025', title: 'Writer and Editor', org: 'Freelance', note: 'Editing and technical documentation across legal, medical, financial and optics subjects.' }
]
};
}
}
mountPortfolio(Component);
