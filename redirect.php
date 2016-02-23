<?php
/**
 * @author Hylke Visser (@htdvisser)
 **/

include "admin/config.php";

$mysqli = new mysqli(SERVER, USERNAME, PASSWORD, DATABASE);

/* check connection */
if ($mysqli->connect_errno) {
    printf("Server Connection Failed");
    exit();
}

$query = $mysqli->prepare("SELECT `redirect` FROM `redirects` WHERE `key`=?");
$key = $_REQUEST['url'];

if ($query) {
    $query->bind_param("s", $key);
    $query->execute();
    $query->bind_result($redirect);
    $query->fetch();
    $query->close();
}

$mysqli->close();

if (empty($redirect)) {
    header('HTTP/1.1 404 Not Found');
    include('index.html');
}
else {
    header('HTTP/1.1 302 Found');
    header('Location: ' .  $redirect);
}
