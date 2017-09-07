
/**
 * TODO:
 * - Add update limit (to avoid hitting rate limit)
 *       - Add loading bar on button cooldown (makes it look cooler)
 * - Add images from here: https://developer.riotgames.com/static-data.html
 *      - Phones should use http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg
 *      - PCs and tablets should use http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg
 */



/** Comes from the JSON file */
let regionalEndpoints = {};
let regionalEndpoint = summonerName = summonerId = championName = championLvl = championId = '';
let hasChest = false;

/** Contains the index of the image buffer that is currently on the bottom */
let currentBottomBuffer = 0;

/** Time allowed between conversions */
const timeout = 5000;

const url = 'https://diabolic-straps.000webhostapp.com/api.php';

/** List of ChampionDto */
let championList = [];

// Populate region-selector with options from JSON
$.getJSON('regionalEndpoint.json', function (json) {
    regionalEndpoints = json;
    let regionSelector = $('#region-selector');
    $.each(regionalEndpoints, function (k, v) {
        regionSelector
            .append($('<option></option>')
                .attr('value', v)
                .text(k.toUpperCase()));
    });
    // $('#region-selector option[value="euw1"]').attr('selected', true);
});

/**
 * Retrieve a list with details of all champions. should be called once per day
 */
function populateChampionList() {

    const query = `https://ru.api.riotgames.com/lol/static-data/v3/champions?api_key=`;
    makeAjaxCall(query, "championList", function (response) {
        try {
            //console.log(response);
            championList = JSON.parse(response).data;
            championId = getChampionIdFromName(championName);
            console.log("List populated");
            getSummonerIdFromName();
        } catch (e) {
            console.log(e);
            alert("Unable to get champion list");
        }
    });
}

/**
 * Get the ID of a summoner from the name
 */
function getSummonerIdFromName() {
    const query = `https://${regionalEndpoint}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=`;

    makeAjaxCall(query, "summonerId", function (response) {
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
    const tempId = championList[name].id;
    if (tempId) {
        return tempId;
    } else {
        alert('Champion not found. Make sure you wrote the name correctly');
    }
}

/**
 * Return the name without non-word chars and the right case
 * @param {string} name Name to be converted
 * @return {string} Name validated 
 */
function validateName(name) {
        // Is champion
        name = name.toLowerCase();
        if (!name.match(' ')) {
            name = name[0].toUpperCase() + name.slice(1, name.length);
        } else {
            name = toTitleCase(name);
        }
        return name.replace(/\W/, '');
}

/**
 * Check if the name given is valid
 * @param {string} name Summoner name to check
 * @return {boolean} 
 */
function isValidSummoner(name) {
    let regex = XRegExp("^(\\p{L}|[ _.]|\d)+$");
    //return name.match(/^(\p{L}|[ _.])+$/);
    return regex.test(name);
}

/**
 * Capitalise the first letter of each word
 * @param {string} str String to convert 
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

/**
 * Change the image from the bottom buffer, change opacity from the top buffer and swap buffers
 */
function changeBackground() {
    document.getElementById(`background-${currentBottomBuffer}`).style.backgroundImage
        = `url('https://ddragon.leagueoflegends.com/cdn/img/champion/${(window.screen.availWidth / window.screen.availHeight < 1) ? 'loading' : 'splash'}/${championName}_0.jpg')`;

    // Make the top buffer transition to invisible
    document.getElementById(`background-${(currentBottomBuffer + 1) % 2}`).style.opacity = 0;

    setTimeout(function () {
        document.getElementById(`background-${currentBottomBuffer}`).style.zIndex = 0;
        document.getElementById(`background-${(currentBottomBuffer + 1) % 2}`).style.zIndex = -2;
        // Change the other one to be the one on the bottom now
        document.getElementById(`background-${currentBottomBuffer}`).style.zIndex = -1;
        setTimeout(function (indexToChange) {
            document.getElementById(`background-${indexToChange}`).style.opacity = 1;
        }, 2000, (currentBottomBuffer + 1) % 2);
        currentBottomBuffer = currentBottomBuffer == 1 ? 0 : 1;
    }, timeout);
}

/**
 * Generic AJAX call
 * @param {string} query URL for request without the API key
 * @param {function} callback Function to be called on success
 */
function makeAjaxCall(query, request, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        success: callback,
        error: function (xhr, ajaxOptions, error) {
            console.log('Error occured: ' + xhr.responseText);
        },
        data: {
            'request': request,
            'query': query
        }
    });
}

/**
 * Get the mastery information from IDs
 */
function getMasteryFromIds() {
    changeBackground();

    const query = `https://${regionalEndpoint}.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}?api_key=`;
    makeAjaxCall(query, "championMastery", function (response) {
        console.log("Mastery received");
        const result = JSON.parse(response);
        hasChest = result.chestGranted;
        championLevel = result.championLevel;
        $('#chest-unlocked-icon').attr('src', `./img/${hasChest ? 'un' : ''}lock.svg`)
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
    if (!isValidSummoner(summonerName)) {
        alert("That is not a valid summoner name");
        return;
    }
    championName = validateName($('#champion-name-textbox').val());
    populateChampionList();
}