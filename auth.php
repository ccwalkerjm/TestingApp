<?php
header('Content-Type: application/json');
$_POST['username'] = $u;
$_POST['password'] = $p;

$json = json_encode(http://www.fitnesstime-lb.com/phonegaprest/post/user/login?username=test1&password=bb147bb147);

$status = $json->status;
$username = $json->username;

print_r ($status);

?>