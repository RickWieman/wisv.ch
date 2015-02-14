<?php
error_reporting(E_ALL);
ini_set('display_errors','1');

include(dirname(__FILE__)."/config.php");
include(dirname(__FILE__)."/mysqlidb.php");

$db = new MysqliDb(SERVER, USERNAME, PASSWORD, DATABASE);

if(isset($_POST['method'])) {
  $method = $_POST['method'];
  if($method == 'add') {
    if(isset($_POST['key']) && isset($_POST['redirect'])) {
      $data = array(
        'key' => $_POST['key'],
        'redirect' => $_POST['redirect']
      );
      $id = $db->insert(TABLE, $data);
      if($id) {
        echo 'success:'.$id;
      } else {
        echo $db->getLastError();
      }
    }
  } else if ($method == 'update') {
    if(isset($_POST['id']) && isset($_POST['key']) && isset($_POST['redirect'])) {
      $data = array(
        'key' => $_POST['key'],
        'redirect' => $_POST['redirect']
      );
      $db->where('id', $_POST['id']);
      if($db->update(TABLE, $data)){
        echo 'success';
      } else {
        echo $db->getLastError();
      }
    }
  } else if ($method == 'remove') {
    if(isset($_POST['id'])) {
      if($db->where('id', $_POST['id'])->delete(TABLE)) {
        echo 'success';
      } else {
        echo $db->getLastError();
      }
    }
  } else {
    echo 'Method not supported.';
  }
} else {
  echo 'No method supplied.';
}
