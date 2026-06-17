const updateImage = () => {
  const img = document.querySelector('.p-hero__image');
  if (window.innerWidth <= 450) {
    img.src = './img/hero-image-responsive.png';
  } else {
    img.src = './img/hero-image.png';
  }
}

// 初回とリサイズ時に実行
window.addEventListener('DOMContentLoaded', updateImage);
window.addEventListener('resize', updateImage);