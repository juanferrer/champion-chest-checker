
/**
 * TODO:
 * - Add update limit (to avoid hitting rate limit)
 *       - Add loading bar on button cooldown (makes it look cooler)
 */



/** Comes from the JSON file */
let regionalEndpoints = {};
let regionalEndpoint = "",
    summonerName = "",
    summonerId = "",
    championName = "",
    championLvl = "",
    championId = "";
let hasChest = false;

/** Contains the index of the image buffer that is currently on the bottom */
let currentBottomBuffer = 0;

/** Time allowed between conversions */
const timeout = 5000;

const url = "https://diabolic-straps.000webhostapp.com/api.php";

/** List of ChampionDto */
let championList = [];

// Populate region-selector with options from JSON
$.getJSON("regionalEndpoint.json", function (json) {
    regionalEndpoints = json;
    let regionSelector = $("#region-selector");
    $.each(regionalEndpoints, function (k, v) {
        regionSelector
            .append($("<option></option>")
                .attr("value", v)
                .text(k.toUpperCase()));
    });
});

$(".name-input").on("change", function () {
    $(this).removeClass("invalid");
})

/**
 * Generic AJAX call
 * @param {string} query URL for request without the API key
 * @param {function} callback Function to be called on success
 */
function makeAjaxCall(dataJSON, request, callback) {
    $.ajax({
        url: url,
        type: "GET",
        success: callback,
        error: function (xhr, ajaxOptions, error) {
            console.log("Error occured: " + xhr.responseText);
        },
        data: {
            "request": request,
            "data": JSON.stringify(dataJSON)
        }
    });
}

/**
 * Return the name without non-word chars and the right case
 * @param {string} name Name to be converted
 * @return {string} Name validated 
 */
function validateName(name) {
    // Is champion
    name = name.toLowerCase();
    if (!name.match(" ")) {
        name = name[0].toUpperCase() + name.slice(1, name.length);
    } else {
        name = toTitleCase(name);
    }
    return name.replace(/\W/, "");
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
        = `url("https://ddragon.leagueoflegends.com/cdn/img/champion/${(window.screen.availWidth / window.screen.availHeight < 1) ? "loading" : "splash"}/${championName}_0.jpg")`;

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
 * Core function. Check if the specified summoner has unlocked a chest with the
 * specified champion.
 */
function checkChampionChest() {
    regionalEndpoint = $("#region-selector").val();
    summonerName = $("#summoner-name-textbox").val();
    if (!isValidSummoner(summonerName)) {
        $("#summoner-name-textbox").addClass("invalid");
        return;
    }
    championName = validateName($("#champion-name-textbox").val());
    populateChampionList();
}

/**
 * Retrieve a list with details of all champions. should be called once per day
 */
function populateChampionList() {
    const data = { "regionalEndpoint": regionalEndpoint };

    makeAjaxCall(data, "championList", function (response) {
        championList = JSON.parse(response).data;
        console.log("List populated");
        championId = getChampionIdFromName(championName);

        if (championId) {
            getSummonerIdFromName();
        }
    });
}

/**
 * Get the ID of a champion from the name
 * @return {string}
 */
function getChampionIdFromName(name) {
    const tempId = championList[name] ? championList[name].id : null;
    if (tempId) {
        return tempId;
    } else {
        $("#champion-name-textbox").addClass("invalid");
    }
}

/**
 * Get the ID of a summoner from the name
 */
function getSummonerIdFromName() {
    const data = { "regionalEndpoint": regionalEndpoint, "summonerName": encodeURIComponent(summonerName) }

    makeAjaxCall(data, "summonerId", function (response) {
        console.log("ID received");
        try {
            summonerId = JSON.parse(response).id;
            getMasteryFromIds();
        } catch (e) {
            $("#summoner-name-textbox").addClass("invalid");
        }
    });
}

/**
 * Get the mastery information from IDs
 */
function getMasteryFromIds() {
    changeBackground();

    const data = { "regionalEndpoint": regionalEndpoint, "summonerId": summonerId, "championId": championId };
    makeAjaxCall(data, "championMastery", function (response) {
        const result = JSON.parse(response);
        console.log("Mastery received");
        hasChest = result.chestGranted;
        championLevel = result.championLevel;
        $("#chest-unlocked-icon").attr("src", `./img/${hasChest ? "un" : ""}lock.svg`)
    });
}