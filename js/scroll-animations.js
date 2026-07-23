// ============================================================
// セクションタイトルの文字出現アニメーション
// ============================================================

// セクションタイトルを取得
const sectionTitles = document.querySelectorAll('.p-section__title');

// セクションタイトルを一文字ずつ表示
const animateSectionTitle = (sectionTitle, windowHeight) => {
  if (!sectionTitle || sectionTitle.classList.contains('is-animated')) return;

  const rectTop = sectionTitle.getBoundingClientRect().top;

  if (rectTop - windowHeight > -100) return;

  const characters = sectionTitle.querySelectorAll('span:not(:first-child)');

  if (!characters.length) return;

  sectionTitle.classList.add('is-animated');

  characters.forEach((character, index) => {
    setTimeout(() => {
      character.classList.add('is-active__first-char');
    }, 150 * index);
  });
};


// ============================================================
// マップ説明文の下線アニメーション
// ============================================================

// マップ説明文を取得
const mapTextWalk = document.getElementById('map-text-walk');
const mapTextPlace = document.getElementById('map-text-place');

// 下線アニメーション
const activateMapText = (element, windowHeight, offset) => {
  if (!element || element.classList.contains('active')) return;

  const rectTop = element.getBoundingClientRect().top;

  if (rectTop - windowHeight <= offset) {
    element.classList.add('active');
  }
};


// ============================================================
// スクロール監視
// ============================================================

window.addEventListener('scroll', () => {
  const windowHeight = window.innerHeight;

  // セクションタイトル
  sectionTitles.forEach((sectionTitle) => {
    animateSectionTitle(sectionTitle, windowHeight);
  });

  // マップ説明文
  activateMapText(mapTextWalk, windowHeight, -120);
  activateMapText(mapTextPlace, windowHeight, -150);
});