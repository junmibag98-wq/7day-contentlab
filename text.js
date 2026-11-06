// 화면 문구 사전 — CLAUDE.md 「UI 문구는 하드코딩하지 않고 사전 키로」.
// 문항·유형 글은 quiz.js 에 있다. 여기는 버튼·안내처럼 화면 틀에 쓰는 말.
// index.html 에 남은 문구(로딩 안내·noscript·메타)는 JS 없이도 보여야 해서 예외로 둔다.
export const T = {
  brand: '7day.contentlab',
  dmUrl: 'https://ig.me/m/7day.contentlab',
  igUrl: 'https://www.instagram.com/7day.contentlab/',

  introKicker: '학원 대표님을 위한',
  introTitle: '우리 학원 블로그 유형 테스트',
  introSub1: '질문 16개 · 2분이면 끝나요',
  introSub2: '16가지 유형 중 우리 학원은 어디일까요?',
  fieldLabel: '어떤 학원인가요?',
  start: '시작하기',

  progressLabel: (n, total) => `${total}개 중 ${n}번째 질문`,
  count: (n, total) => `${n} / ${total}`,
  back: '← 이전',
  missing: '빠진 질문이 있어요. 여기부터 답해 주세요.',

  resultKicker: (fieldLabel) => `${fieldLabel} · 우리 학원 블로그 유형`,
  half: '반반',
  percent: (p) => `${p}%`,
  tipsTitle: '이렇게 쓰면 좋아요',
  titlesTitle: '첫 글 제목, 이렇게 시작해 보세요',
  titlesNote: 'OO동 자리에 학원이 있는 동네 이름(동·읍·역)을 넣으세요.',

  ctaTitle: '우리 학원 키워드, 무료로 봐 드려요',
  ctaBody: '이 화면을 캡처해서 인스타 DM으로 "진단"이라고 보내 주세요. 동네·과목 키워드가 한 달에 몇 번 검색되는지 정리해 드려요.',
  ctaDm: '@7day.contentlab DM 보내기',
  copy: '결과 링크 복사',
  retry: '다시 하기',
  copied: '링크를 복사했어요.',
  copyFallback: '복사가 안 되는 화면이에요. 아래 주소를 길게 눌러 복사하세요.',

  error: '화면을 여는 중에 문제가 생겼어요. 새로고침해 주세요.',
  footer: '답은 이 사이트 어디에도 저장하지 않아요',
};
