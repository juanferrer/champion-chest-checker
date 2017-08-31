// Populate region-selector with options from JSON
/** Comes from the JSON file */
const apiKey = 'RGAPI-006456f5-9fc1-45d2-baa8-d61858fc6638';
let regionalEndpoints = {};
let regionalEndpoint = summonerName = summonerId = championName = championId = '';

/** List of ChampionDto */
let championList = [];

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
function populateChampionList() {

    // Should change to the static data at some point
    //let url = `https://euw1.api.riotgames.com/lol/static-data/v3/champions?api_key=${apiKey}`;
    const url = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json';
    $.ajax({
        url: url,
        success: function (result) {
            //return result.data;
            championList = result.data;
        }
    });
}

/**
 * Get the ID of a summoner from the name
 * @return {string}
 */
function getSummonerIdFromName(name) {
    const url = `https://${regionalEndpoint}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?api_key=${apiKey}`
    $.ajax({
        url: url,
        success: function (result) {
            return result.id;
        }
    });
}

/**
 * Get the ID of a champion from the name
 * @return {string}
 */
function getChampionIdFromName(name) {
    return championList[name].key;
}

/**
 * Core function. Check if the specified summoner has unlocked a chest with the
 * specified champion.
 */
function checkChampionChest() {
    let urlRequest = '';

    let hasChest = '';

    populateChampionList();
    regionalEndpoint = $('#region-selector').val();
    summonerName = $('#summoner-name-textbox').val();
    summonerId = getSummonerIdFromName(summonerName);
}