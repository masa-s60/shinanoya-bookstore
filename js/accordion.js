document.querySelectorAll('.c-read-more__button').forEach(button => {
  button.addEventListener('click', () => {
    const parentDiv = button.closest('div'); // クリックされたボタンの親 div を取得
    const grandParentDiv = parentDiv?.parentElement; // さらにその上の div に移動
    const textDetail = grandParentDiv?.querySelector('div.p-info__item-text'); // その中から対象のテキスト部分を取得

    if (button.classList.contains('open')) {
      button.classList.remove('open');
      textDetail.style.maxHeight = 'calc(1.3em * 3)'; 
      button.textContent = '続きを読む';
    } else {
      button.classList.add('open');
      textDetail.style.maxHeight = '500px';
      button.textContent = '閉じる';
    }
  });
});
