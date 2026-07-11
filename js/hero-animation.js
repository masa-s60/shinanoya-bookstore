window.addEventListener('load', () => {
  const hero = document.querySelector('.js-hero');

  if (!hero) return;

  setTimeout(() => {
    hero.classList.add('is-active');
  }, 1000);
});