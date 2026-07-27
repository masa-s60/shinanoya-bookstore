<?php
  $dataFile = '../data/data-books.json'; 
  
  if (!file_exists($dataFile)) {
    error_log('JSONファイルが見つかりません: ' . $dataFile);
    header('Location: ../page/upload_form.php?status=data_not_found');
    exit;
  }

  $json = file_get_contents($dataFile);

  if ($json === false) {
    error_log('JSONファイルの読み込みに失敗しました: ' . $dataFile);
    header('Location: ../page/upload_form.php?status=data_read_error');
    exit;
  }

  $books = json_decode($json, true);

  if (!is_array($books)) {
    header('Location: ../page/upload_form.php?status=data_read_error');
    exit;
  }

  if (!isset($_POST['post_id'])) {
    error_log('削除対象の投稿IDが送信されていません');
    header('Location: ../page/upload_form.php?status=post_id_error');
    exit;
  }
  
  $postId = (int)$_POST['post_id'];
    
  foreach ($books as $key => $book) {
    if ($book['id'] === $postId) {
      // 画像パスがあれば削除
      if (!empty($book['img'])) {
        $imagePath = __DIR__ . '/../' . $book['img'];

        if (file_exists($imagePath)) {
          if (!unlink($imagePath)) {
            error_log('画像の削除に失敗しました: ' . $imagePath);
          }
        }
      }
      unset($books[$key]);
      break;
    }
  }

  $result = file_put_contents(
    $dataFile,
    json_encode(array_values($books), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
  );

  if ($result === false) {
    header('Location: ../page/upload_form.php?status=data_write_error');
    exit;
  }
      
  header('Location: ../page/upload_form.php?status=deleted');
  exit;
?>