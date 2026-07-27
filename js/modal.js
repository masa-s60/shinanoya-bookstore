// ============================================================
// 確認モーダル（投稿・削除）
// ============================================================

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
      if (e.target === modal) {
        modal.classList.remove("is-active");
      }
    });
  }
});


// ============================================================
// 結果モーダル（投稿完了・削除完了・エラー）
// ============================================================
  
const params = new URLSearchParams(window.location.search);
let resultStatus = params.get('status');

if (typeof dataReadError !== 'undefined' && dataReadError) {
  resultStatus = 'data_read_error';
}

if ([
  'success',
  'deleted',
  'config_not_found',
  'config_error',
  'ftp_connect_error',
  'ftp_login_error',
  'data_not_found',
  'data_read_error',
  'validation_error',
  'post_id_error',
  'img_directory_error',
  'unsupported_extension',
  'img_upload_error',
  'data_write_error'
].includes(resultStatus)) {
  const modal = document.getElementById('status-modal');
  const message = document.getElementById('status-message');

  if (modal && message) {
    if (resultStatus === 'success') {
      message.textContent = 'アップロードが完了しました！';
    } else if (resultStatus === 'deleted') {
      message.textContent = '投稿を削除しました！';
    } else if (resultStatus === 'config_not_found') {
      message.textContent = '設定ファイルが見つかりません';
    } else if (resultStatus === 'config_error') {
      message.textContent = '設定ファイルの読み込みに失敗しました';
    } else if (resultStatus === 'ftp_connect_error') {
      message.textContent = 'FTPサーバーへの接続に失敗しました';
    } else if (resultStatus === 'ftp_login_error') {
      message.textContent = 'FTPログインに失敗しました';
    } else if (resultStatus === 'data_not_found') {
      message.textContent = '投稿データが見つかりません';
    } else if (resultStatus === 'data_read_error') {
      message.textContent = '既存投稿データの読み込みに失敗しました';
    } else if (resultStatus === 'validation_error') {
      message.textContent = '入力内容が正しくありません';
    } else if (resultStatus === 'post_id_error') {
      message.textContent = '削除対象の投稿IDを取得できませんでした';
    } else if (resultStatus === 'img_directory_error') {
      message.textContent = '画像格納フォルダの作成に失敗しました';
    } else if (resultStatus === 'unsupported_extension') {
      message.textContent = '画像のデータ形式が正しくないため、アップロードできません';
    } else if (resultStatus === 'img_upload_error') {
      message.textContent = '画像の保存に失敗しました';
    } else if (resultStatus === 'data_write_error') {
      message.textContent = '既存投稿データの更新に失敗しました';
    }
    
    modal.classList.add('is-active');

    if (resultStatus !== 'success') {
      console.log(location.href);
      history.replaceState(null, '', window.location.pathname);
      console.log(location.href);
    }

    setTimeout(() => {
      if (resultStatus === 'success') {
        window.location.href = 'upload_form.php';
      } else {
        modal.classList.remove('is-active');
      }
    }, 1500);  
  }
}


// ============================================================
// 画像拡大モーダル
// ============================================================

// 画像クリックでモーダルを開く
document.querySelectorAll('.p-info__item-image, .p-current-post__body-image').forEach(img => {
  img.addEventListener('click', () => {
    const item = img.closest('.p-info__item, .p-current-post__item');
    const modal = item?.querySelector('.c-image-modal');
    const modalImg = modal?.querySelector('.c-image-modal__image');

    if (!modal || !modalImg) return;

    modalImg.src = img.src;
    modal.classList.add('is-active');
  });
});

// モーダルクリックで閉じる
document.querySelectorAll('.c-image-modal').forEach(modal => {
  modal.addEventListener('click', () => {
    modal.classList.remove('is-active');
  });
});