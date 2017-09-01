// Populate region-selector with options from JSON
/** Comes from the JSON file */
let regionalEndpoints = {};
let regionalEndpoint = summonerName = summonerId = championName = championLvl = championId = '';
let hasChest = false;

const url = 'https://diabolic-straps.000webhostapp.com/api.php';

/** List of ChampionDto */
let championList = [];

// Populate region-selector
$.getJSON('regionalEndpoint.json', function (json) {
    regionalEndpoints = json;
    let regionSelector = $('#region-selector');
    $.each(regionalEndpoints, function (k, v) {
        regionSelector
            .append($('<option></option>')
                .attr('value', v)
                .text(k.toUpperCase()));
    });
    $('#region-selector option[value="euw1"').attr('selected', true);
});

/**
 * Retrieve a list with details of all champions. should be called once per day
 * @return {object[]}
 */
function populateChampionList() {

    // Should change to the static data at some point
    const query = `https://ru.api.riotgames.com/lol/static-data/v3/champions?api_key=`;
    //const url = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json';
    makeAjaxCall(query, function (response) {
        console.log("List populated");
        championList = JSON.parse(response).data;
        championId = getChampionIdFromName(championName);
        getSummonerIdFromName();
    });
}

/**
 * Get the ID of a summoner from the name
 * @return {string}
 */
function getSummonerIdFromName() {
    const query = `https://${regionalEndpoint}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=`;

    makeAjaxCall(query, function (response) {
        console.log("ID received");
        summonerId = JSON.parse(response).id;
        getMasteryFromIds();
    });
}

/**
 * Get the ID of a champion from the name
 * @return {string}
 */
function getChampionIdFromName(name) {
    // Remove spaces and special characters and capitalise
    // name = name.replace(' ', '');//.toLowerCase());
    // if (name.match(/\W/)) {
        
    // }
    const tempId = championList[name].id;
    if (tempId) {
        document.getElementsByTagName('body')[0].style.backgroundImage = `url('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg')`;
        return tempId;
    } else {
    }
}

/**
 * Generic AJAX call
 * @param {string} query URL for request without the API key
 * @param {function} callback Function to be called on success
 */
function makeAjaxCall(query, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        success: callback,
        error: function (xhr, ajaxOptions, error) {
          console.log('Error occured: ' + xhr.responseText);  
        },
        data: {
            'query': query
        }
    });
}

/**
 * Get the mastery information from IDs
 */
function getMasteryFromIds() {
    const query = `https://${regionalEndpoint}.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}?api_key=`;
    makeAjaxCall(query, function (response) {
        console.log("Mastery received");
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

    regionalEndpoint = $('#region-selector').val();
    summonerName = $('#summoner-name-textbox').val();
    championName = $('#champion-name-textbox').val();
    populateChampionList();
}