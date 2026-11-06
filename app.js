// 화면 흐름: 시작(분야 고르기) → 16문항 → 결과.
// 개인정보는 받지 않고 어디에도 보내지 않는다. 답은 이 탭의 메모리에만 있다.
// 글은 전부 textContent 로 넣는다 — 주소창(#r=…)에서 온 값이 HTML 로 해석되지 않게.
// 문항마다 history 에 한 칸씩 쌓는다 — 인스타 앱에서 뒤로 밀면 앱이 닫히지 않고 이전 문항으로 가게.
// 칸마다 회차(run)를 적는다 — 새로고침·다시 하기 뒤의 옛 칸으로 돌아가도 빈 답으로 문항을 띄우지 않게 (nav.js).
import { AXES, QUESTIONS, CHOICES, FIELDS, DEFAULT_FIELD, score, describe } from './quiz.js';
import { routeFor, parseHash, firstMissing } from './nav.js';
import { T } from './text.js';

const app = document.getElementById('app');
const state = { field: DEFAULT_FIELD, index: 0, answers: {}, run: 0, results: {}, notice: '' };
// 답을 누르면 같은 자리에 다음 문항 버튼이 바로 생긴다 → 손가락이 두 번 닿아 한 문항을 건너뛰지 않게 잠깐 잠근다
const TAP_LOCK_MS = 300;
let lockUntil = 0;

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    // style 은 속성 문자열로 넣으면 CSP(style-src 'self')에 막힌다 → CSSOM 으로
    else if (k === 'style') Object.assign(node.style, v);
    else if (k === 'on') for (const [ev, fn] of Object.entries(v)) node.addEventListener(ev, fn);
    else node.setAttribute(k, v);
  }
  for (const c of children) node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return node;
}

// replaceChildren 은 사파리 14부터라, 더 오래된 인앱 브라우저도 열리게 직접 비운다
function show(...nodes) {
  while (app.firstChild) app.removeChild(app.firstChild);
  app.append(...nodes);
  window.scrollTo(0, 0);
  // 화면이 바뀌면 첫 제목으로 초점을 옮겨 화면 읽기 프로그램도 따라오게
  const h = app.querySelector('h1, h2');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

function renderIntro() {
  // 칩을 눌러도 화면을 다시 그리지 않는다 — 초점이 제목으로 튀지 않게 aria-pressed 만 바꾼다
  const chips = Object.entries(FIELDS).map(([key, f]) =>
    el('button', {
      type: 'button',
      class: 'chip',
      'data-key': key,
      'aria-pressed': String(state.field === key),
      on: { click: () => pickField(key, chips) },
    }, f.label));

  show(el('section', { class: 'card intro' },
    el('p', { class: 'kicker' }, T.introKicker),
    el('h1', {}, T.introTitle),
    el('p', { class: 'sub' }, T.introSub1),
    el('p', { class: 'sub' }, T.introSub2),
    el('div', { class: 'block' },
      el('p', { class: 'label', id: 'field-label' }, T.fieldLabel),
      el('div', { class: 'chips', role: 'group', 'aria-labelledby': 'field-label' }, ...chips)),
    el('button', { type: 'button', class: 'primary', on: { click: start } }, T.start)));
}

function pickField(key, chips) {
  state.field = key;
  for (const c of chips) c.setAttribute('aria-pressed', String(c.dataset.key === key));
}

function start() {
  // 회차 번호는 새로고침해도 옛 칸과 겹치지 않게 시각으로 (같은 ms 에 두 번 눌러도 커지게)
  state.run = Math.max(Date.now(), state.run + 1);
  state.index = 0;
  state.answers = {};
  lockUntil = 0;
  // 주소의 ?쿼리·#결과는 버린다
  history.pushState({ run: state.run, q: 0 }, '', location.pathname);
  renderQuestion();
}

// 1번 문항의 '이전'은 늘 시작 화면 — 공유 링크로 들어왔어도 그 결과로 되돌아가지 않게
function prev() {
  if (state.index > 0) { history.back(); return; }
  history.replaceState(null, '', location.pathname);
  renderIntro();
}

function renderQuestion() {
  const q = QUESTIONS[state.index];
  const n = state.index + 1;
  const total = QUESTIONS.length;
  const choices = CHOICES.map((c) => {
    const picked = state.answers[q.id] === c.value;
    return el('button', {
      type: 'button',
      class: 'choice',
      'aria-pressed': String(picked),
      on: { click: () => answer(q.id, c.value) },
    }, c.label);
  });

  const notice = state.notice;
  state.notice = '';
  show(el('section', { class: 'card' },
    notice ? el('p', { class: 'notice', role: 'status' }, notice) : '',
    el('div', { class: 'progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(n), 'aria-label': T.progressLabel(n, total) },
      el('div', { class: 'bar', style: { width: `${(n / total) * 100}%` } })),
    el('p', { class: 'count' }, T.count(n, total)),
    el('h2', { class: 'question' }, q.text),
    el('div', { class: 'choices' }, ...choices),
    el('button', { type: 'button', class: 'back', on: { click: prev } }, T.back)));
}

function answer(id, value) {
  const now = performance.now();
  if (now < lockUntil) return;
  lockUntil = now + TAP_LOCK_MS;

  state.answers[id] = value;
  if (state.index < QUESTIONS.length - 1) {
    state.index += 1;
    history.pushState({ run: state.run, q: state.index }, '', location.pathname);
    renderQuestion();
    return;
  }
  const result = score(state.answers);
  if (!result) {
    // 빠진 답이 있으면(정상 흐름에선 안 생긴다) 조용히 멈추지 말고 빠진 문항으로 보낸다
    state.index = Math.max(0, firstMissing(state.answers));
    state.notice = T.missing;
    history.replaceState({ run: state.run, q: state.index }, '', location.pathname);
    renderQuestion();
    return;
  }
  state.results[String(state.run)] = { code: result.code, field: state.field, axes: result.axes };
  history.pushState({ run: state.run, result: true }, '', resultHash(result.code, state.field));
  renderResult(result.code, state.field, result.axes);
}

function resultHash(code, field) {
  return `#r=${code}&f=${field}`;
}

function axisRows(axes) {
  return AXES.map((axis, i) => {
    const a = axes[i];
    const leftWin = !a.tie && a.letter === axis.left;
    const rightWin = !a.tie && a.letter === axis.right;
    const label = a.tie ? `${T.half} ${T.percent(50)}` : `${a.name} ${T.percent(a.percent)}`;
    return el('div', { class: 'axis' },
      el('div', { class: 'axis-head' },
        el('span', { class: leftWin ? 'win' : '' }, `${axis.left} ${axis.leftName}${leftWin ? ' ' + T.percent(a.percent) : ''}`),
        el('span', { class: a.tie ? 'tie' : '' }, a.tie ? T.half : ''),
        el('span', { class: rightWin ? 'win' : '' }, `${rightWin ? T.percent(a.percent) + ' ' : ''}${axis.rightName} ${axis.right}`)),
      el('div', { class: 'track', role: 'img', 'aria-label': label },
        el('div', { class: 'fill ' + (a.tie ? 'half' : leftWin ? 'from-left' : 'from-right'), style: { width: `${a.percent}%` } })));
  });
}

// axes 가 없으면(공유 링크로 들어온 경우) 막대 대신 글자 뜻만 보여 준다.
function renderResult(code, fieldKey, axes) {
  const d = describe(code, fieldKey);
  if (!d) { renderIntro(); return; }

  const letterMeaning = [...code].map((letter, i) => {
    const axis = AXES[i];
    return el('li', {}, el('b', {}, letter), ` ${letter === axis.left ? axis.leftName : axis.rightName}`);
  });

  const copyBox = el('div', { class: 'copy-box', role: 'status' });

  show(
    el('section', { class: 'card result' },
      el('p', { class: 'kicker' }, T.resultKicker(d.field.label)),
      el('p', { class: 'code' }, code),
      el('h1', {}, d.name),
      el('ul', { class: 'letters' }, ...letterMeaning),
      el('p', { class: 'line' }, d.line),
      axes ? el('div', { class: 'axes' }, ...axisRows(axes)) : ''),
    el('section', { class: 'card' },
      el('h2', {}, T.tipsTitle),
      el('ul', { class: 'tips' }, ...d.tips.map((t) => el('li', {}, t)))),
    el('section', { class: 'card' },
      el('h2', {}, T.titlesTitle),
      el('ol', { class: 'titles' }, ...d.titles.map((t) => el('li', {}, t))),
      el('p', { class: 'note' }, T.titlesNote)),
    el('section', { class: 'card cta' },
      el('h2', {}, T.ctaTitle),
      el('p', {}, T.ctaBody),
      el('a', { class: 'primary', href: T.dmUrl, target: '_blank', rel: 'noopener noreferrer' }, T.ctaDm),
      el('div', { class: 'row' },
        el('button', { type: 'button', class: 'ghost', on: { click: () => copyLink(code, fieldKey, copyBox) } }, T.copy),
        el('button', { type: 'button', class: 'ghost', on: { click: start } }, T.retry)),
      copyBox));
}

// 복사 주소는 검사를 통과한 값으로 새로 만든다 — 주소창에 붙어 온 쿼리(?fbclid=…)나 덧붙은 글은 따라가지 않게
async function copyLink(code, fieldKey, box) {
  const url = `${location.origin}${location.pathname}${resultHash(code, fieldKey)}`;
  let ok = true;
  try { await navigator.clipboard.writeText(url); } catch { ok = false; }
  // 기다린 뒤에 비운다 — 연달아 눌러도 안내가 두 번 쌓이지 않게
  while (box.firstChild) box.removeChild(box.firstChild);
  if (ok) { box.append(el('p', { class: 'copy-msg' }, T.copied)); return; }
  // 인스타 안 브라우저처럼 클립보드가 막힌 곳: 고를 수 있는 칸에 주소를 넣어 준다
  const input = el('input', { class: 'copy-input', type: 'text', readonly: '', value: url, 'aria-label': T.copy });
  box.append(el('p', { class: 'copy-msg' }, T.copyFallback), input);
  input.focus();
  input.select();
}

// 화면 고르기 규칙은 nav.js. 여기서는 그 답대로 그리기만 한다
function go(route) {
  if (route.view === 'question') {
    state.index = route.index;
    renderQuestion();
  } else if (route.view === 'result') {
    state.field = route.field;
    renderResult(route.code, route.field, route.axes);
  } else {
    renderIntro();
  }
}

function onPopState(e) {
  go(routeFor({ entry: e.state, run: state.run, answers: state.answers, results: state.results, hash: location.hash }));
}

function mountChrome() {
  const brand = document.getElementById('brand');
  if (brand) brand.textContent = T.brand;
  const foot = document.getElementById('foot');
  if (foot) {
    foot.append(T.footer, ' · ', el('a', { href: T.igUrl, target: '_blank', rel: 'noopener noreferrer' }, `@${T.brand}`));
  }
}

try {
  mountChrome();
  window.addEventListener('popstate', onPopState);
  go(parseHash(location.hash));
} catch {
  app.textContent = T.error;
}
