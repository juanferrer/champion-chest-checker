<?php

$apiKey = 'RGAPI-3e2297c4-8707-45d2-9842-3696b147fbd6';

header('Access-Control-Allow-Origin: *');

if (isset($_REQUEST['query'])){
    $query = $_REQUEST['query'];
    $result = file_get_contents($query . $apiKey);
    echo $result;
} else {
    header('HTTP/1.1 500 Internal Server Error');
    die(json_encode(array('message' => 'Invalid query', 'code' => 100)));
}

?>