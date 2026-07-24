<?php
  $postsJsonText = file_get_contents('../data/data-books.json');
  $postList = json_decode($postsJsonText, true);

  $dataReadError = false;

  if (!is_array($postList)) {
    $postList = [];
    $dataReadError = true;
  }

  usort($postList, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
  });
?>

<!DOCTYPE html>

<html lang="ja">
  <head>
    <meta name="robots" content="noindex, nofollow">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>最新情報の投稿</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/upload_form.css?v=3">
    <link rel="stylesheet" href="../css/modal.css?v=3">
  </head>

  <body>
    <div class="p-post">
    <!-- 投稿フォーム -->
      <div class="p-upload">
        <h1 class="p-post__title">投稿</h1>
        <form action="../src/upload_process.php" method="POST" enctype="multipart/form-data" id="upload-form" class="p-form">
          <!-- 画像 -->
          <label for="image" class="p-form__label">【画像】</label>
          <div class="p-form__file">
            <input 
              type="file"
              id="image" 
              name="image" 
              class="p-form__image"
              accept="image/*">
          </div>
          <!-- タイトル入力 -->
          <label for="title" class="p-form__label">【タイトル】*</label>
          <input 
            type="text"
            id="title" 
            name="title" 
            class="p-form__title" 
            maxlength="150" 
            required>
          <!-- 文章入力 -->
          <label for="text" class="p-form__label">【内容】*</label>
          <textarea 
            id="text" 
            name="text" 
            class="p-form__content" 
            maxlength="1000" 
            required></textarea>
          <!-- 送信ボタン -->
          <div class="p-form__submit">
            <button type="button" id="open-confirm-modal" class="p-form__submit-button">アップロード</button>
          </div>
        </form>
      </div>

      <!-- 現在の投稿一覧 -->
      <div class="p-current-post">
        <h2 class="p-post__title">現在の投稿</h2>
        <div class="p-current-post__list">
          <?php foreach ($postList as $post): ?>
            <div class="p-current-post__item">
              <p class="p-current-post__title"><?= htmlspecialchars($post['title']) ?></p>
              <p class="p-current-post__date">投稿日：<?= htmlspecialchars($post['date']) ?></p>
              <div class="p-current-post__body">
                <?php if (!empty($post['img'])): ?>
                  <img src="<?= htmlspecialchars($post['img']) ?>" alt="投稿画像" class="p-current-post__body-image">
                  <div class="c-image-modal">
                    <img src="" alt="投稿画像の拡大" class="c-image-modal__image">
                  </div>
                <?php endif; ?>
                <p class="p-current-post__body-text">
                  <?= htmlspecialchars(mb_strlen($post['text']) > 100 ? mb_substr($post['text'], 0, 100) . '...' : $post['text']) ?>
                </p>
              </div>

              <form action="../src/delete_post.php" method="POST" class="p-current-post__delete">
                <input type="hidden" name="post_id" value="<?= $post['id'] ?>">
                <button type="button" class="p-current-post__delete-button js-open-delete-modal">削除</button>
              </form>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <!-- モーダルウィンドウ -->
    <div id="confirm-modal" class="c-modal">
      <div class="c-modal__dialog c-modal__dialog--confirm">
        <p id="confirm-message" class="c-modal__message c-modal__message--confirm">この内容を投稿しますか？</p>
        <div class="c-modal__buttons">
          <button id="confirm-yes" class="c-modal__button c-modal__button--yes">はい</button>
          <button id="confirm-no" class="c-modal__button c-modal__button--no">いいえ</button>
        </div>
      </div>
    </div>

    <div id="status-modal" class="c-modal">
      <div class="c-modal__dialog c-modal__dialog--result">
        <p id="status-message" class="c-modal__message"></p>
      </div>
    </div>

    <script>const dataReadError = <?= $dataReadError ? 'true' : 'false' ?>;</script>
    <script src="../js/modal.js"></script>
  </body>
</html>