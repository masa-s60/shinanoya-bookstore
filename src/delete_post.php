<?php

  $dataFile = '../data/data-books.json'; 

  if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);
    $books = json_decode($json, true);

    if (isset($_POST['post_id'])) {
      $postId = (int)$_POST['post_id'];

      foreach ($books as $key => $book) {
        if ($book['id'] === $postId) {

        // 画像パスがあれば削除
          if (!empty($book['img'])) {
            $imagePath = __DIR__ . '/../' . $book['img']; // 絶対パスに変換
            echo '削除する画像のパス: ' . $imagePath; // デバッグ用に画像パスを表示

            if (file_exists($imagePath)) {
              unlink($imagePath); // 画像削除
              echo '画像削除成功';
            } else {
              echo '画像が見つかりませんでした。';
            }
          }

          unset($books[$key]);
          break;
        }
      }
      file_put_contents($dataFile, json_encode(array_values($books), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
      header('Location: ../page/upload_form.php?status=deleted');
      exit;
    }
  }

  header('Location: ../page/upload_form.php?status=error');
  exit;
?>