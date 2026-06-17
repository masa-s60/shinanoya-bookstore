// 投稿 or 削除ボタンクリック時、表示モーダル ----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const openModalButton = document.getElementById("openConfirmModal");
  const deleteButtons = document.querySelectorAll(".js-open-delete-modal");
  const modal = document.getElementById("confirmModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const uploadForm = document.getElementById("uploadForm");
  const confirmMessage = document.getElementById("confirmMessage");

  let mode = ""; // 'upload' or 'delete'
  let deletePostId = ""; // 削除対象のID

  // 投稿用：モーダル表示
  if (openModalButton && modal && confirmYes && confirmNo && uploadForm && confirmMessage) {
    openModalButton.addEventListener("click", () => {
      mode = "upload";
      confirmMessage.textContent = "この内容で送信してもよろしいですか？";
      modal.classList.add("is-active");
    });

    // 削除用：各削除ボタンにイベントを付ける（.js-open-delete-modal はあとでHTMLにつける）
    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        const form = e.currentTarget.closest(".p-delete-form");
        const postId = form.querySelector("input[name='post_id']").value;
        deletePostId = postId;
        mode = "delete";
        confirmMessage.textContent = "この投稿を削除してもよろしいですか？";
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
  const modal = document.getElementById('statusModal');
  const message = document.getElementById('statusMessage');
  modal.style.display = 'block';

  if (resultStatus === 'success') {
    message.textContent = 'アップロードが完了しました！';
  } else if (resultStatus === 'error') {
    message.textContent = '処理に失敗しました。';
  } else if (resultStatus === 'deleted') {
    message.textContent = '投稿を削除しました。';
  }

  setTimeout( () => {
    window.location.href = 'upload_form.php';
  }, 1500);
}

// 投稿画像クリック時、拡大モーダル -------------------------------------

document.querySelectorAll('.c-info__item-img, .c-info-image').forEach( img => {
  img.addEventListener('click', () => {
    const modal = img.nextElementSibling;
    if(img.classList.contains('c-info__item-img')) {
      const modalImg = modal.querySelector('.c-modal-targetImg-for-index');
      modalImg.src = img.src;
      modal.classList.add('is-active');
    } else if(img.classList.contains('c-info-image')) {
      const modalImg = modal.querySelector('.c-modal-targetImg-for-upload_form');
      modalImg.src = img.src;
      modal.classList.add('is-active');
    }
  });
});

document.querySelectorAll('.c-modal-img').forEach(modal => {
  modal.addEventListener('click', () => {
    modal.classList.remove('is-active');
  });
});