<?php

function isCurrentFile($file) {
    $filedate = date("Ymd", filemtime($file));
    $todaydate  = date("Ymd");
    return $filedate == $todaydate;
}

$apiKey = 'RGAPI-KEY';

header('Access-Control-Allow-Origin: *');

if (isset($_REQUEST['query'])){
    if (null !== $_REQUEST['request'] and $_REQUEST['request'] == 'championList' and
    isCurrentFile('./championList.json')) {
        // If we have a championList from today, we might as well use that one
        $result = file_get_contents('./championList.json');
    } else {
        // But if we don't (or it's old), request it again
        $query = $_REQUEST['query'];
        $result = file_get_contents($query . $apiKey);
        
        if (null !== $_REQUEST['request'] and $_REQUEST['request'] == 'championList') {
            // Now, cache it. We'll use this for next request
            file_put_contents('./championList.json', $result);
        }
    }
    echo $result;
} else {
    header('HTTP/1.1 500 Internal Server Error');
    die(json_encode(array('message' => 'Invalid query', 'code' => 100)));
}

?>