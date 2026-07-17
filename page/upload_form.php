<?php
  $postsJsonText = file_get_contents('../data/data-books.json');
  $postList = json_decode($postsJsonText, true);

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
    <link rel="stylesheet" href="../css/upload_form.css">
    <link rel="stylesheet" href="../css/modal.css">
  </head>

  <body>
    <div class="l-container">

    <!-- 投稿フォーム -->
      <div class="l-left">
        <h2 class="c-title">投稿</h2>

        <form action="../src/upload_process.php" method="POST" enctype="multipart/form-data" id="uploadForm" class="c-form">
          <!-- 画像 -->
          <label for="image" class="c-form-label">【画像】<br></label>
          <div class="p-img-group">
            <input type="file" name="image" id="image" accept="image/*" class="p-form-img u-form-input">
          </div>

          <!-- タイトル入力 -->
          <label for="title" class="c-form-label">【タイトル】*<br></label>
          <textarea type="text" name="title" id="title" class="c-form-title u-form-input" maxlength="150" required></textarea>

          <!-- 文章入力 -->
          <label for="text" class="c-form-label">【内容】*<br></label>
          <textarea name="text" id="text" class="c-form-textarea" maxlength="1000" required></textarea>
          
          <!-- 送信ボタン -->
          <div class="p-submit">
            <button type="button" id="openConfirmModal" class="p-form-button">アップロード</button>
          </div>
        </form>
      </div>

      <!-- 現在の投稿一覧 -->
      <div class="l-right">
        <h2 class="c-title">現在の投稿</h2>
        <div class="c-info">
          <?php foreach ($postList as $post):?>
            <div class="c-info-item">
              <p class="c-info-title"><?= htmlspecialchars($post['title']) ?></p>
              <p class="c-info-date">投稿日：<?= htmlspecialchars($post['date']) ?></p>
              <div class="c-info-item__flex">
                <?php if (!empty($post['img'])): ?>
                  <img src="<?= htmlspecialchars($post['img']) ?>" alt="投稿画像" class="c-info-image">
                  <div class="c-modal-img">
                    <img src="" class="c-modal-targetImg-for-upload_form">
                  </div>
                <?php endif; ?>
                <p class="c-info-text">
                  <?= htmlspecialchars(mb_strlen($post['text']) > 100 ? mb_substr($post['text'], 0, 100) . '...' : $post['text']) ?>
                </p>
              </div>

              <form action="../src/delete_post.php" method="POST" class="p-delete-form">
                <input type="hidden" name="post_id" value="<?= $post['id'] ?>">
                <button type="button" class="c-delete-button js-open-delete-modal">削除</button>
              </form>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <!-- モーダルウィンドウ -->
    <div id="confirmModal" class="c-confirm-modal">
      <div class="c-confirm-modal__content">
        <p id="confirmMessage">この内容で送信してもよろしいですか？</p>
        <button id="confirmYes" class="c-modal__button c-modal__button--yes">はい</button>
        <button id="confirmNo" class="c-modal__button c-modal__button--no">いいえ</button>
      </div>
    </div>

    <div id="statusModal" class="c-status-modal" style="display: none;">
      <div class="c-status-modal__content">
        <p id="statusMessage"></p>
      </div>
    </div>

    <script src="../js/modal.js"></script>
  </body>
</html>