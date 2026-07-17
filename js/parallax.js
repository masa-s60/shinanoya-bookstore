const layer = document.querySelector('.p-page-background');

// スクロールイベント
window.addEventListener('scroll', function() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  // 背景の移動速度を遅くする
  layer.style.transform = `translateY(${-scrollTop * 0.3}px)`;
});
