<?php
  // FTPログイン --------------------------------------------------------
  
  $config = include(__DIR__ . '/../../config/config.php'); // ローカルデバッグ時はディレクトリ変更必須(/../config/config.php)

  $ftp_server = $config['ftp_server'];
  $ftp_username = $config['ftp_user'];
  $ftp_password = $config['ftp_pass'];

  // FTP接続の確立
  $conn_id = ftp_connect($ftp_server);

  // 接続の確認
  if (!$conn_id) {
    die("FTP接続に失敗しました。");
  }

  // ログイン認証
  $login_result = ftp_login($conn_id, $ftp_username, $ftp_password);

  // ログインの確認
  if (!$login_result) {
    ftp_close($conn_id);
    die("FTPログインに失敗しました。");
  }

  // 既存JSONファイル取得 --------------------------------------------------------

  $dataFile = '../data/data-books.json';

  // JSONファイルを読み込む
  if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);
    $books = json_decode($json, true);
  } else {
    $books = [];
  }

  // ID割り振り
  $newId = count($books) + 1;

  // フォームから受け取ったデータ
  $title = trim($_POST['title'] ?? '');
  $text = trim($_POST['text'] ?? '');

  if ($title === '' || $text === '') {
    header('Location: ../page/upload_form.php?status=invalid');
    exit;
  }

  // imgフォルダがない場合は作成
  $uploadDir = '../img/';
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
  }

  // 画像データの保存 ---------------------------------------------------------------

  $imgPath = '';

  if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['image']['tmp_name'];
    $originalName = $_FILES['image']['name'];

    // 拡張子を取得（小文字）
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    // 拡張子のバリデーション（任意）
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($extension, $allowedExtensions)) {
      header('Location: ../page/upload_form.php?status=invalid');
      exit;
    }

    // ユニークなファイル名を生成（拡張子のみ使用）
    $uniqueName = uniqid('', true) . '.' . $extension;
    $savePath = $uploadDir . $uniqueName;

    // 画像を保存
    if (move_uploaded_file($tmpName, $savePath)) {
      $imgPath = '/img/' . $uniqueName; // Webから見たパス
    } else {
      header('Location: ../page/upload_form.php?status=error');
      exit;
    }
  }
  
  elseif (isset($_POST['base64image']) && !empty($_POST['base64image'])) {
    $base64 = $_POST['base64image'];

    // データURLの形式: data:image/png;base64,xxxxxx
    if (preg_match('/^data:image\/(\w+);base64,/', $base64, $matches)) {
        $extension = strtolower($matches[1]); // 拡張子を取得（png, jpeg など）
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($extension, $allowedExtensions)) {
            header('Location: ../page/upload_form.php?status=invalid');
            exit;
        }

        $base64 = substr($base64, strpos($base64, ',') + 1);
        $imageData = base64_decode($base64);

        if ($imageData === false) {
            header('Location: ../page/upload_form.php?status=invalid');
            exit;
        }

        $uniqueName = uniqid('', true) . '.' . $extension;
        $savePath = $uploadDir . $uniqueName;

        if (file_put_contents($savePath, $imageData)) {
            $imgPath = '/img/' . $uniqueName;
        } else {
            header('Location: ../page/upload_form.php?status=error');
            exit;
        }
    } else {
        header('Location: ../page/upload_form.php?status=invalid');
        exit;
    }
}
  // JSONデータの生成 -----------------------------------------------------------

  // データ形成
  $newData = [
    'id' => $newId,
    'img' => $imgPath,
    'title' => $title,
    'date' => date('Y年n月j日'),
    'created_at' => date('Y-m-d H:i:s'),
    'text' => $text,
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
  ];

  // 既存のデータ配列に追加
  $books[] = $newData;

  // JSONにして保存
  if (file_put_contents($dataFile, json_encode($books, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
    // 保存成功
    header('Location: ../page/upload_form.php?status=success');
  } else {
    // 保存失敗
    header('Location: ../page/upload_form.php?status=error');
  }

  exit;
?>