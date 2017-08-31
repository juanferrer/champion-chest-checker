// Populate region-selector with options from JSON
/** Comes from the JSON file */
const apiKey = 'RGAPI-006456f5-9fc1-45d2-baa8-d61858fc6638';
let regionalEndpoints = {};
let regionalEndpoint = summonerName = summonerId = championName = championId = '';

/** List of ChampionDto */
let championList = [];
getChampionList();

$.getJSON('regionalEndpoint.json', function (json) {
    regionalEndpoints = json;
    let regionSelector = $('#region-selector');
    $.each(regionalEndpoints, function (k, v) {
        regionSelector
            .append($('<option></option>')
                .attr('value', v)
                .text(k.toUpperCase()));
    });
    
});

/**
 * Retrieve a list with details of all champions. should be called once per day
 * @return {object[]}
 */
function getChampionList() {
    
    let url = `https://euw1.api.riotgames.com/lol/static-data/v3/champions?api_key=${apiKey}`;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            championList = xmlHttp.responseText;
    }
    // xmlHttp.setRequestHeader("Origin", "https://developer.riotgames.com");
    // xmlHttp.setRequestHeader("Accept-Charset", "application/x-www-form-urlencoded; charset=UTF-8");
    // xmlHttp.setRequestHeader("X-Riot-Token", "RGAPI-006456f5-9fc1-45d2-baa8-d61858fc6638");
    // xmlHttp.setRequestHeader("Accept-Language", "en-GB,en;q=0.8,en-US;q=0.6,es;q=0.4,de;q=0.2");
    // xmlHttp.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36");
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "true");
    xmlHttp.send(null);
}

/**
 * Get the ID of a champion from the name
 * @param {string} name Name of the champion whose ID is required
 * @return {string}
 */
function getChampionIdFromName(name) {
    return '';
}

/**
 * Core function. Check if the specified summoner has unlocked a chest with the
 * specified champion.
 */
function checkChampionChest() {
    let urlRequest = '';

    let hasChest = '';
}