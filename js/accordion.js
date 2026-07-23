const readMoreItems = document.querySelectorAll('.p-info__item');

const updateReadMoreButtons = () => {
  readMoreItems.forEach(infoItem => {
    const textDetail = infoItem.querySelector('.p-info__item-text');
    const button = infoItem.querySelector('.c-read-more');

    if (!textDetail || !button) return;

    if (textDetail.classList.contains('is-open')) {
      button.hidden = false;
      return;
    }
    const isOverflowing = textDetail.scrollHeight > textDetail.clientHeight + 1;
    button.hidden = !isOverflowing;
  });
};

readMoreItems.forEach(infoItem => {
  const textDetail = infoItem.querySelector('.p-info__item-text');
  const button = infoItem.querySelector('.c-read-more');

  if (!textDetail || !button) return;

  button.addEventListener('click', () => {
    const isOpen = textDetail.classList.toggle('is-open');

    button.classList.toggle('is-open', isOpen);
    button.textContent = isOpen ? '閉じる' : '続きを読む';

    if (!isOpen) {
      updateReadMoreButtons();
    }
  });
});

window.addEventListener('load', updateReadMoreButtons);
window.addEventListener('resize', updateReadMoreButtons);