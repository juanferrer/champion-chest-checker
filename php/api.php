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

$apiKey = 'RGAPI-7c7b8eea-9094-40f7-9d66-68bdf79c1031';

header('Access-Control-Allow-Origin: *');

$query = $_REQUEST['query'];
if ($query == ''){
    $result = 'ERROR: No query found';
} else {
    $result = file_get_contents($query . $apiKey);
}

echo $result;

?>