// Populate region-selector with options from JSON
/** Comes from the JSON file */
let regionalEndpoints = {};
let regionalEndpoint = summonerName = summonerId = championName = championLvl = championId = '';
let hasChest = false;

const url = 'https://diabolic-straps.000webhostapp.com/api.php';

/** List of ChampionDto */
let championList = [];
populateChampionList();

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
function getSummonerIdFromName() {
    const query = `https://${regionalEndpoint}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=`;

    makeAjaxCall(query, function (response) {
        summonerId = JSON.parse(response).id;
        getMasteryFromIds();
    });
}

/**
 * Get the ID of a champion from the name
 * @return {string}
 */
function getChampionIdFromName(name) {
    return championList[name].key;
}

function makeAjaxCall(query, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        success: callback,
        data: {
            'query': query
        }
    });
}

function getMasteryFromIds() {
    const query = `https://${regionalEndpoint}.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}?api_key=`;
    makeAjaxCall(query, function (response) {
        const result = JSON.parse(response);
        hasChest = result.chestGranted;
        championLevel = result.championLevel;
        alert(hasChest);
    });
}

/**
 * Core function. Check if the specified summoner has unlocked a chest with the
 * specified champion.
 */
function checkChampionChest() {
    let urlRequest = '';

    // populateChampionList();
    regionalEndpoint = $('#region-selector').val();
    summonerName = $('#summoner-name-textbox').val();
    championName = $('#champion-name-textbox').val();
    championId = getChampionIdFromName(championName);
    getSummonerIdFromName();
}