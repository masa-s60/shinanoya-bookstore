// 投稿 or 削除ボタンクリック時、表示モーダル ----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const openModalButton = document.getElementById("open-confirm-modal");
  const deleteButtons = document.querySelectorAll(".js-open-delete-modal");
  const modal = document.getElementById("confirm-modal");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  const uploadForm = document.getElementById("upload-form");
  const confirmMessage = document.getElementById("confirm-message");

  let mode = ""; // 'upload' or 'delete'
  let deletePostId = ""; // 削除対象のID

  // 投稿用：モーダル表示
  if (openModalButton && modal && confirmYes && confirmNo && uploadForm && confirmMessage) {
    openModalButton.addEventListener("click", () => {
      mode = "upload";
      confirmMessage.textContent = "この内容を投稿しますか？";
      modal.classList.add("is-active");
    });

    // 削除用：各削除ボタンにイベントを付ける（.js-open-delete-modal はあとでHTMLにつける）
    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        const form = e.currentTarget.closest(".p-current-post__delete");
        const postId = form.querySelector("input[name='post_id']").value;
        deletePostId = postId;
        mode = "delete";
        confirmMessage.textContent = "この投稿を削除しますか？";
        modal.classList.add("is-active");
      });
    });

    // はい → 投稿 or 削除を分岐
    confirmYes.addEventListener("click", () => {
      if (mode === "upload") {
        if (uploadForm.checkValidity()) {
          uploadForm.submit();
        } else {
          uploadForm.reportValidity();
        }
      } else if (mode === "delete") {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "../src/delete_post.php";
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "post_id";
        input.value = deletePostId;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      }
    });

    // いいえ
    confirmNo.addEventListener("click", () => {
      modal.classList.remove("is-active");
    });

    // モーダル背景クリックで閉じる
    modal.addEventListener("click", (e) => {
      if(e.target === modal) {
        modal.classList.remove("is-active");
      }
    });
  }
});
  
const params = new URLSearchParams(window.location.search);
const resultStatus = params.get('status');

if (['success', 'error', 'deleted'].includes(resultStatus)) {
  const modal = document.getElementById('status-modal');
  const message = document.getElementById('status-message');

  if (resultStatus === 'success') {
    message.textContent = 'アップロードが完了しました！';
  } else if (resultStatus === 'error') {
    message.textContent = '処理に失敗しました';
  } else if (resultStatus === 'deleted') {
    message.textContent = '投稿を削除しました！';
  }

  modal.classList.add('is-active');

  setTimeout(() => {
    window.location.href = 'upload_form.php';
  }, 1500);
}

document.querySelectorAll('.p-info__item-image').forEach(img => {
  img.addEventListener('click', () => {
    const infoItem = img.closest('.p-info__item');
    const modal = infoItem?.querySelector('.c-image-modal');
    const modalImg = modal?.querySelector('.c-image-modal__image');

    if (!modal || !modalImg) return;

    modalImg.src = img.src;
    modal.classList.add('is-active');
  });
});

document.querySelectorAll('.c-image-modal').forEach(modal => {
  modal.addEventListener('click', () => {
    modal.classList.remove('is-active');
  });
});