// 어느 화면을 그릴지 정하는 규칙 — 주소로 처음 들어올 때와 뒤로·앞으로 갈 때.
// 화면(app.js)과 떼어 둔 이유: history 가 꼬였을 때(새로고침·다시 하기 뒤 뒤로) 마지막 문항에서 멈추던 걸
// 브라우저 없이 node --test 로 잡으려고.
import { QUESTIONS, FIELDS, DEFAULT_FIELD, has, isTypeCode } from './quiz.js';

/** #r=HPLK&f=music → 결과 / 그 밖 → 시작 화면. 모르는 분야는 기본 분야로. */
export function parseHash(hash) {
  const params = new URLSearchParams(String(hash ?? '').replace(/^#/, ''));
  const code = params.get('r');
  const field = params.get('f');
  if (!isTypeCode(code)) return { view: 'intro' };
  return { view: 'result', code, field: has(FIELDS, field) ? field : DEFAULT_FIELD, axes: null };
}

/** 0번부터 n-1번 문항까지 답이 다 있나 */
export function answeredUpTo(answers, n) {
  return QUESTIONS.slice(0, n).every((q) => has(answers, q.id));
}

/** 답이 빠진 첫 문항 번호. 다 있으면 -1 */
export function firstMissing(answers) {
  return QUESTIONS.findIndex((q) => !has(answers, q.id));
}

/**
 * 뒤로·앞으로 갔을 때.
 * - 이번 회차(run)의 문항 칸이고 그 앞 문항 답이 다 메모리에 있을 때만 그 문항으로
 * - 이 탭에서 낸 결과 칸이면 그때 결과(막대 포함)로
 * - 나머지(새로고침 전 칸, 지난 회차, 주소를 손으로 바꿈)는 주소만 보고 정한다
 */
export function routeFor({ entry, run, answers, results, hash }) {
  const e = entry && typeof entry === 'object' ? entry : null;
  if (e && e.run === run && Number.isInteger(e.q) && e.q >= 0 && e.q < QUESTIONS.length && answeredUpTo(answers, e.q)) {
    return { view: 'question', index: e.q };
  }
  if (e && e.result === true && Number.isInteger(e.run) && results && has(results, String(e.run))) {
    return { view: 'result', ...results[String(e.run)] };
  }
  return parseHash(hash);
}
