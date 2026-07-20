document.querySelectorAll('.c-read-more').forEach(button => {
  button.addEventListener('click', () => {
    const infoItem = button.closest('.p-info__item');
    const textDetail = infoItem?.querySelector('.p-info__item-text');

    if (!textDetail) return;

    if (button.classList.contains('is-open')) {
      button.classList.remove('is-open');
      textDetail.style.maxHeight = 'calc(1.3em * 3)';
      button.textContent = '続きを読む';
    } else {
      button.classList.add('is-open');
      textDetail.style.maxHeight = '500px';
      button.textContent = '閉じる';
    }
  });
});