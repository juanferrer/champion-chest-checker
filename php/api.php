<?php

// $apiKey = "RGAPI-7c7b8eea-9094-40f7-9d66-68bdf79c1031";
// $regionalEndpoint = "euw1";
// $apiCall = "getSummonerId";
// $summonerName = "Freidhelm";
// $summonerId = "";
// $url = "https://" . $regionalEndpoint . ".api.riotgames.com";

// if ($apiCall == "getSummonerId") {
//     $url .= "lol/summoner/v3/summoners/by-name/" . $summonerName . "?api+key=" . $apiKey;
//     $result = json_decode(file_get_contents($url));
//     echo $result;
// } elseif ($apiCall == "") {

// }

$apiKey = 'RGAPI-c4287473-abc3-4656-ae88-3f1613b1fc76';

header('Access-Control-Allow-Origin: *');
//header('Content-Type: application/json; charset=UTF-8');

if (isset($_REQUEST['query'])){
    $query = $_REQUEST['query'];
    $result = file_get_contents($query . $apiKey);
    print json_encode($result);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    die(json_encode(array('message' => 'Invalid query', 'code' => 100)));
}

?>