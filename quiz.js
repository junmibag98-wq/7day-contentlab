// 우리 학원 블로그 유형 테스트 — 문항·유형 데이터와 점수 계산.
// 화면(app.js)과 떼어 둔 이유: 점수 규칙을 브라우저 없이 node --test 로 잴 수 있게.

// 축 4개 → 글자 4개 → 16유형. 동점이면 그 축의 첫 번째로 기운 답을 따르고, 그것도 없으면 tie 글자.
export const AXES = [
  { id: 'target', left: 'H', right: 'A', leftName: '취미', rightName: '입시·대회', tie: 'H' },
  { id: 'trust', left: 'P', right: 'S', leftName: '선생님', rightName: '체계', tie: 'P' },
  { id: 'reach', left: 'L', right: 'W', leftName: '동네', rightName: '넓게', tie: 'L' },
  { id: 'material', left: 'V', right: 'K', leftName: '사진·영상', rightName: '설명', tie: 'K' },
];

// toward = "그래요"라고 답하면 기우는 글자. 축마다 양쪽 2문항씩.
export const QUESTIONS = [
  { id: 'q1', axis: 'target', toward: 'H', text: '취미로 배우는 원생이 더 많아요.' },
  { id: 'q2', axis: 'trust', toward: 'P', text: '상담할 때 선생님 경력을 먼저 말해요.' },
  { id: 'q3', axis: 'reach', toward: 'L', text: '원생 대부분이 학원 근처에 살아요.' },
  { id: 'q4', axis: 'material', toward: 'V', text: '수업 사진이나 영상을 자주 찍을 수 있어요.' },
  { id: 'q5', axis: 'target', toward: 'A', text: '상담 오면 입시나 대회 얘기를 먼저 물어봐요.' },
  { id: 'q6', axis: 'trust', toward: 'S', text: '단계별 수업 과정이 정해져 있어요.' },
  { id: 'q7', axis: 'reach', toward: 'W', text: '다른 동네에서 일부러 오는 원생이 있어요.' },
  { id: 'q8', axis: 'material', toward: 'K', text: '사진 올리는 건 원생 동의 받기가 어려워요.' },
  { id: 'q9', axis: 'target', toward: 'H', text: '성인이나 직장인 원생이 늘고 있어요.' },
  { id: 'q10', axis: 'trust', toward: 'P', text: '"그 선생님한테 배우고 싶어서 왔다"는 말을 자주 들어요.' },
  { id: 'q11', axis: 'reach', toward: 'L', text: '근처에 비슷한 학원이 많아요.' },
  { id: 'q12', axis: 'material', toward: 'V', text: '발표회나 공연 같은 행사가 1년에 몇 번 있어요.' },
  { id: 'q13', axis: 'target', toward: 'A', text: '합격이나 수상 소식이 우리 학원 자랑이에요.' },
  { id: 'q14', axis: 'trust', toward: 'S', text: '시설과 장비는 근처 어느 학원에도 안 져요.' },
  { id: 'q15', axis: 'reach', toward: 'W', text: '우리 학원에만 있는 수업이 있어요.' },
  { id: 'q16', axis: 'material', toward: 'K', text: '연습 방법을 말로 설명하는 걸 좋아해요.' },
];

// 그래요 = +1 (toward 쪽), 반반 = 0, 아니에요 = -1
export const CHOICES = [
  { value: 1, label: '그래요' },
  { value: 0, label: '반반이에요' },
  { value: -1, label: '아니에요' },
];

// 결과 문구의 {academy}·{subject}·{goal}·{show} 를 분야에 맞게 바꾼다.
// 단어 끝 받침을 맞춰 뒀다: academy·team 은 모두 받침 있음(은/을/이), goal·show 는 모두 받침 없음(는/를/가). place 뒤엔 조사를 안 붙인다.
// 입시·대회 유형 문구에는 '입시'를 박지 않고 {goal}·{team} 을 쓴다 — 태권도장에 '입시 상담'이 나오지 않게.
export const FIELDS = {
  music: { label: '음악', academy: '음악학원', place: '학원', subject: '보컬', goal: '실용음악 입시', team: '입시반', show: '발표회' },
  art: { label: '미술', academy: '미술학원', place: '학원', subject: '드로잉', goal: '미대 입시', team: '입시반', show: '전시회' },
  dance: { label: '무용·댄스', academy: '댄스학원', place: '학원', subject: '댄스', goal: '예고 무용 입시', team: '입시반', show: '쇼케이스' },
  sports: { label: '태권도·체육', academy: '태권도장', place: '도장', subject: '태권도', goal: '품새·겨루기 대회', team: '선수반', show: '승급 심사' },
};
export const DEFAULT_FIELD = 'music';

// 글자마다 블로그 방향 한 줄씩. 결과 화면에 4줄이 뜬다.
export const LETTER_TIPS = {
  H: '처음 배우는 사람의 걱정에 답하세요. "늦게 시작해도 될까?" 같은 글이요.',
  A: '학부모는 시기와 일정을 검색해요. 학년별로 나눠서 정리하세요.',
  P: '선생님이 어디부터 보는지, 선생님 눈으로 쓰세요.',
  S: '"여기 오면 이렇게 배워요"를 단계별로 보여 주세요.',
  L: '동네 이름만 쓰면 검색이 적어요. "{subject}" 같은 넓은 말과 같이 쓰세요.',
  W: '검색이 많은 넓은 질문을 잡고, 글 끝에 위치를 꼭 적으세요.',
  V: '글마다 실제 사진 한 장이면 돼요. 얼굴은 동의받은 것만요.',
  K: '사진 대신 요약 그림을 넣고, 원리와 연습법을 쓰세요.',
};

export const TYPES = {
  HPLV: {
    name: '동네 사랑방형',
    line: '동네 취미 원생이 선생님 보러 오는 곳이에요. 수업 장면을 일기처럼 올리면 그게 홍보예요.',
    titles: ['OO동 {academy}, 이번 주 수업 이야기', '{subject} 처음 배우는 직장인의 첫 달', '{show} 준비하는 취미반, 사진으로 보여 드려요'],
  },
  HPLK: {
    name: '친절한 설명쌤형',
    line: '사진이 없어도 괜찮아요. 동네 사람들이 궁금한 걸 선생님 말투로 답해 주면 돼요.',
    titles: ['OO동 {academy}, 상담 갈 때 물어볼 세 가지', '{subject} 혼자 연습하다 막힐 때, 선생님은 어디부터 볼까?', '늦게 시작해도 될까? 성인 취미 {subject} 석 달'],
  },
  HPWV: {
    name: '찾아오는 팬클럽형',
    line: '선생님 보고 멀리서도 와요. 원생이 달라지는 모습을 꾸준히 보여 주면 팬이 생겨요.',
    titles: ['{subject} 수업 3개월, 처음과 지금 비교', '다른 동네에서 일부러 오는 이유, 원생들에게 물었어요', '{show} 날, 선생님이 마지막에 꼭 하는 말'],
  },
  HPWK: {
    name: '이름난 전문가형',
    line: '선생님 실력이 곧 검색어예요. 넓은 질문에 깊게 답하면 멀리서도 찾아와요.',
    titles: ['{subject} 실력이 안 느는 사람들의 공통점', '하루 30분 {subject} 연습, 무엇부터 할까?', '좋은 {subject} 선생님은 첫 수업에서 무엇을 볼까?'],
  },
  HSLV: {
    name: '동네 놀이터형',
    line: '와서 연습하고 머무는 곳이에요. 시설과 하루 풍경을 보여 주면 동네 사람들이 들러 봐요.',
    titles: ['OO동 {academy} 한 바퀴, 처음 오면 이렇게 둘러봐요', '퇴근길에 들르는 {subject} 취미반의 하루', '{show} 날 {place} 풍경, 사진으로 모았어요'],
  },
  HSLK: {
    name: '동네 길잡이형',
    line: '수업 단계가 잘 짜인 곳이에요. "처음 오면 이렇게 배워요"를 동네에 알려 주세요.',
    titles: ['OO동 {academy}, 첫 달에 배우는 것', '{subject} 단계, 처음부터 끝까지 한눈에', '취미 {subject}, 일주일에 몇 번 와야 늘까?'],
  },
  HSWV: {
    name: '성장 기록장형',
    line: '체계적인 수업과 눈에 보이는 변화가 무기예요. 단계별 기록을 쌓으면 멀리서도 와요.',
    titles: ['{subject} 입문반 6개월, 달마다 남긴 기록', '1단계와 3단계, 같은 과제를 하면 이렇게 달라요', '{show} 준비, 처음부터 끝까지 기록했어요'],
  },
  HSWK: {
    name: '취미 로드맵형',
    line: '어디서 시작해 어디까지 가는지 길을 그려 주는 곳이에요. 검색 많은 넓은 질문에 차근차근 답하세요.',
    titles: ['{subject} 처음 시작한다면, 첫 1년 순서', '{subject} 처음 배울 때 많이 하는 실수 다섯 가지', '취미로 시작해서 어디까지 갈 수 있을까?'],
  },
  APLV: {
    name: '동네 코치형',
    line: '동네에서 {goal} 준비를 맡기는 곳이에요. 연습하는 모습을 보여 주면 학부모가 믿어요.',
    titles: ['OO동 {academy} {team}, 하루 연습은 이렇게', '{goal} 한 달 전, {team} 연습 현장', '모의 평가 날, 무엇을 보고 무엇을 고쳤을까'],
  },
  APLK: {
    name: '동네 상담실형',
    line: '학부모가 먼저 검색하는 질문에 답하는 곳이에요. 시기와 준비할 것을 차분히 정리하세요.',
    titles: ['{goal}, 몇 살부터 준비할까?', 'OO동 {academy} {team} 상담, 꼭 물어볼 것', '{goal} 준비, 학교 공부와 어떻게 나눌까?'],
  },
  APWV: {
    name: '실전 무대형',
    line: '무대가 곧 증거예요. 연습 영상과 무대 기록을 쌓으면 다른 지역에서도 찾아와요.',
    titles: ['{goal} 준비 영상, 이렇게 찍으면 실수가 줄어요', '{show}까지 석 달, {team} 준비 기록', '{goal} 전날, {team}은 무엇을 할까?'],
  },
  APWK: {
    name: '전문 칼럼형',
    line: '깊은 지식이 무기예요. 시기별로 꼼꼼한 글을 쓰면 넓은 지역에서 찾아와요.',
    titles: ['{goal}, 준비 순서 한눈에 보기', '{goal} 준비할 때 많이 하는 실수', '{goal} 1년 계획, 달마다 할 일'],
  },
  ASLV: {
    name: '동네 훈련소형',
    line: '체계적으로 훈련시키는 동네 학원이에요. 훈련 과정을 보여 주면 학부모가 안심해요.',
    titles: ['OO동 {academy} {team} 일주일 시간표', '{team} 월말 평가, 이렇게 해요', '{goal} 대비, 연습하는 하루'],
  },
  ASLK: {
    name: '동네 지도형',
    line: '기준이 분명한 곳이에요. 동네 학부모가 찾는 {goal} 정보를 지도처럼 정리해 주세요.',
    titles: ['OO동 {academy} {team}, 학년별로 준비할 것', '첫 상담부터 {goal}까지, 준비 순서', '{team} 레벨 테스트에서는 무엇을 볼까?'],
  },
  ASWV: {
    name: '평가회 쇼케이스형',
    line: '체계와 무대 경험을 둘 다 가진 곳이에요. 평가회와 {show} 기록으로 실력을 보여 주세요.',
    titles: ['{team} 평가회, 영상으로 다시 보며 고친 것', '{goal}, 실전처럼 연습하는 우리 평가회', '{show} 준비 8주, 주차별 기록'],
  },
  ASWK: {
    name: '전략 연구소형',
    line: '자료와 체계로 승부하는 곳이에요. {goal} 같은 넓은 질문에 전략 글을 쓰면 멀리서도 상담이 와요.',
    titles: ['{goal} 일정, 한 장으로 정리', '{goal}, 학년별로 할 일', '{goal} 준비생이 많이 묻는 질문 10가지'],
  },
};

const VALID_VALUES = new Set(CHOICES.map((c) => c.value));

// Object.hasOwn 은 사파리 15.4 부터라 오래된 아이폰 인앱 브라우저에서 결과가 안 뜬다 → 예전 방식으로
export const has = (obj, key) => typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key);

/** answers: { q1: 1|0|-1, ... } — 16문항 모두 있어야 한다. 아니면 null. */
export function score(answers) {
  if (!answers || typeof answers !== 'object') return null;
  for (const q of QUESTIONS) {
    if (!VALID_VALUES.has(answers[q.id])) return null;
  }
  let code = '';
  const axes = AXES.map((axis) => {
    const qs = QUESTIONS.filter((q) => q.axis === axis.id);
    // 왼쪽 글자 쪽으로 기운 정도. 오른쪽으로 기운 문항은 부호를 뒤집는다.
    const lean = (q) => answers[q.id] * (q.toward === axis.left ? 1 : -1);
    const sum = qs.reduce((s, q) => s + lean(q), 0);
    let letter;
    if (sum > 0) letter = axis.left;
    else if (sum < 0) letter = axis.right;
    else {
      const first = qs.find((q) => lean(q) !== 0);
      letter = first ? (lean(first) > 0 ? axis.left : axis.right) : axis.tie;
    }
    code += letter;
    // 막대 그래프용: 이긴 쪽이 몇 %인지 (50~100). 좌우 대칭이 되게 |합|으로 잰다. 동점이면 50 + tie
    const percent = Math.round(50 + (Math.abs(sum) / qs.length) * 50);
    return { id: axis.id, letter, percent, tie: sum === 0, name: letter === axis.left ? axis.leftName : axis.rightName };
  });
  return { code, axes };
}

export function isTypeCode(code) {
  return has(TYPES, code);
}

export function fieldOf(key) {
  return has(FIELDS, key) ? FIELDS[key] : FIELDS[DEFAULT_FIELD];
}

/** {academy} 같은 자리를 분야 단어로 채운다. 모르는 자리는 그대로 둔다. */
export function fill(template, field) {
  return template.replace(/\{(academy|place|subject|goal|team|show)\}/g, (_, k) => field[k]);
}

/** 결과 화면에 쓸 글 묶음. 화면은 이걸 textContent 로만 넣는다. */
export function describe(code, fieldKey) {
  if (!isTypeCode(code)) return null;
  const field = fieldOf(fieldKey);
  const t = TYPES[code];
  return {
    code,
    name: t.name,
    line: fill(t.line, field),
    tips: [...code].map((letter) => fill(LETTER_TIPS[letter], field)),
    titles: t.titles.map((s) => fill(s, field)),
    field,
  };
}
