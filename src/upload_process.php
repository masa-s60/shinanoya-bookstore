<?php
  //==================================================
  // 設定ファイルの読み込み
  //==================================================

  // 設定ファイルの存在確認
  $configPath = __DIR__ . '/../../config/config.php';

  if (!file_exists($configPath)) {
    error_log('設定ファイルが見つかりません: ' . $configPath);
    header('Location: ../page/upload_form.php?status=config_not_found');
    exit;
  }

  // 設定ファイルの読み込み
  $config = include($configPath);

  if (!is_array($config)) {
    error_log('設定ファイルの読み込みに失敗しました: ' . $configPath);
    header('Location: ../page/upload_form.php?status=config_error');
    exit;
  }


  //==================================================
  // FTP接続・ログイン認証
  //==================================================

  $ftp_server = $config['ftp_server'];
  $ftp_username = $config['ftp_user'];
  $ftp_password = $config['ftp_pass'];

  // FTP接続確立
  $conn_id = ftp_connect($ftp_server);

  // 接続確立
  if (!$conn_id) {
    error_log('FTP接続に失敗しました。サーバー: ' . $ftp_server);
    header('Location: ../page/upload_form.php?status=ftp_connect_error');
    exit;
  }

  // ログイン認証
  $login_result = ftp_login($conn_id, $ftp_username, $ftp_password);

  // ログインの確認
  if (!$login_result) {
    ftp_close($conn_id);
    error_log('FTPログインに失敗しました。ユーザー: ' . $ftp_username);
    header('Location: ../page/upload_form.php?status=ftp_login_error');
    exit;
  }


  //==================================================
  // 既存投稿データの取得
  //==================================================

  $dataFile = '../data/data-books.json';

  // JSONファイルを読み込む
  if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);

    if ($json === false) {
      error_log('JSONファイルの読み込みに失敗しました: ' . $dataFile);
      header('Location: ../page/upload_form.php?status=data_read_error');
      exit;
    }
      
    $books = json_decode($json, true);

    if (!is_array($books)) {
      error_log('JSONデータの解析に失敗しました: ' . $dataFile);
      header('Location: ../page/upload_form.php?status=data_read_error');
      exit;
    }
  } else {
    $books = [];
  }

  
  //==================================================
  // フォームデータの取得
  //==================================================

  // フォームから受け取ったデータ
  $title = trim($_POST['title'] ?? '');
  $text = trim($_POST['text'] ?? '');

  if ($title === '' || $text === '') {
    header('Location: ../page/upload_form.php?status=validation_error');
    exit;
  }


  //==================================================
  // アップロード画像ファイルの保存
  //==================================================

  // imgフォルダがない場合は作成
  $uploadDir = '../img/';
  
  if (!is_dir($uploadDir)) {
    $result = mkdir($uploadDir, 0777, true);

    if ($result === false) {
      error_log('imgフォルダの作成に失敗しました');
      header('Location: ../page/upload_form.php?status=img_directory_error');
      exit;
    }
  }

  $imgPath = '';

  // 画像が送信され、アップロードエラーがない場合に保存処理
  if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['image']['tmp_name'];
    $originalName = $_FILES['image']['name'];

    // 拡張子を取得（小文字）
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    // 対応拡張子の判定
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($extension, $allowedExtensions)) {
      header('Location: ../page/upload_form.php?status=unsupported_extension');
      exit;
    }

    // 保存用の新しい画像ファイル名を生成（ユニーク）
    $newImageFileName = uniqid('', true) . '.' . $extension;
    $savePath = $uploadDir . $newImageFileName;

    // imgフォルダへの画像保存
    if (move_uploaded_file($tmpName, $savePath)) {
      $imgPath = '/img/' . $newImageFileName; // JSONへ保存する画像パスを作成
    } else {
      header('Location: ../page/upload_form.php?status=img_upload_error');
      exit;
    }
  }

  //==================================================
  // 新しい投稿データの生成とJSONデータの更新
  //==================================================

  // 新しい投稿IDを生成
  $ids = array_column($books, 'id');
  
  if (empty($ids)) {
    $newId = 1;
  } else {
    $newId = max($ids) + 1;
  }

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

  // 投稿データをJSON形式へ変換
  $encodedBooks = json_encode($books, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

  if ($encodedBooks === false) {
    error_log('投稿データのJSON変換に失敗しました');
    header('Location: ../page/upload_form.php?status=data_write_error');
    exit;
  }

  // JSONファイルへ保存
  $writeResult = file_put_contents($dataFile, $encodedBooks);

  if ($writeResult === false) {
    error_log('投稿データの保存に失敗しました: ' . $dataFile);
    header('Location: ../page/upload_form.php?status=data_write_error');
    exit;
  }

  header('Location: ../page/upload_form.php?status=success');
  exit;
?>