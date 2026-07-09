const nextButton = document.getElementById('next_page_button');
const whiteLayer = document.querySelector('.p-opening-white');
const opening = document.querySelector('.p-opening');
const mainBody = document.querySelector('.l-body');

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// "Since 1922" 手書きアニメーション
const since1922 = new Vivus( 'sample', { // svgに指定するid名
  type: 'oneByOne',
  start: 'manual',
  duration: 400, // アニメーションの長さ
  forceRender: false, //パスが更新で再レンダリングさせない
});

const playAnimation = async () => {
  await wait(1500);
  nextButton.click();
  await wait(1500);
  since1922.play();
  await wait(3000);
  nextButton.click();
  await wait(500);
}

window.addEventListener('load', async () => {
  if (localStorage.getItem('visited')) {
    opening.style.display = 'none';
    mainBody.style.display = 'block';
    whiteLayer.classList.add('is-hide');
    return;
  }

  whiteLayer.classList.add('is-hide');
  await playAnimation();
  whiteLayer.classList.remove('is-hide');
  await wait(1500);
  opening.style.display = 'none';
  mainBody.style.display = 'block';
  localStorage.setItem('visited', 'true');
  whiteLayer.classList.add('is-hide');
});

window.addEventListener('load', () => {
  document.querySelector('.l-hero__image').classList.add('is-active');
  document.querySelector('.p-hero__nav').classList.add('is-active');
  document.querySelector('.p-hero__overlay').classList.add('is-active');
});