<?php

function isCurrentFile($file) {
    if (!file_exists($file)) {
        return FALSE;
    }
    $filedate = date('Ymd', filemtime($file));
    $todaydate  = date('Ymd');
    return $filedate == $todaydate;
}

$apiKey = 'RGAPI-KEY';

header('Access-Control-Allow-Origin: *');

if (isset($_REQUEST['request'])) {
    // Get the data
    $data = json_decode(stripslashes($_REQUEST['data']));

    // And now check what kind of request we're dealing with
    if ($_REQUEST['request'] == 'championList') {
        // Get the championList
        if (isCurrentFile('./championList.json')) {
            // If we have a championList from today, we might as well use that one
            $result = file_get_contents('./championList.json');
        } else {
            // But if we don't (or it's old), request it again
            $query = 'https://'. $data->regionalEndpoint .'.api.riotgames.com/lol/static-data/v3/champions?api_key=' . $apiKey;
            $result = file_get_contents($query);  

            // Now, cache it. We'll use this for next request
            if (!file_exists('./championList.json')) {
                unlink('.championList.json');
            }
            file_put_contents('./championList.json', $result);
        }

    } elseif ($_REQUEST['request'] == 'summonerId') {
        $query = 'https://'. $data->regionalEndpoint . '.api.riotgames.com/lol/summoner/v3/summoners/by-name/'. $data->summonerName .'?api_key=' . $apiKey;
        $result = file_get_contents($query);
    } elseif ($_REQUEST['request'] == 'championMastery') {
        $query = 'https://' . $data->regionalEndpoint . '.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/'. $data->summonerId . '/by-champion/'. $data->championId .'?api_key=' . $apiKey;
        $result = file_get_contents($query);
    } else {
        // Invalid request type
        header('HTTP/1.1 404 Not Found');
        die(json_encode(array('message' => 'Invalid request')));
    }
    echo $result;
} else {
    header('HTTP/1.1 400 Bad Request');
    die(json_encode(array('message' => 'No request found')));
}

// if (isset($_REQUEST['query'])){
//     if (null !== $_REQUEST['request'] and $_REQUEST['request'] == 'championList' and
//     isCurrentFile('./championList.json')) {
//         // If we have a championList from today, we might as well use that one
//         $result = file_get_contents('./championList.json');
//     } else {
//         // But if we don't (or it's old), request it again
//         $query = $_REQUEST['query'];
//         $result = file_get_contents($query . $apiKey);
        
//         if (null !== $_REQUEST['request'] and $_REQUEST['request'] == 'championList') {
//             // Now, cache it. We'll use this for next request
//             unlink('.championList.json');
//             file_put_contents('./championList.json', $result);
//         }
//     }
//     echo $result;
// } else {
//     header('HTTP/1.1 500 Internal Server Error');
//     die(json_encode(array('message' => 'Invalid query', 'code' => 100)));
// }

?>