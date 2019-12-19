/* globals $, XRegExp */

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
    // eslint-disable-next-line no-unused-vars
    championLevel = "",
    championSkinsAmount = 0,
    championId = "";
let hasChest = false;

/** Contains the index of the image buffer that is currently on the bottom */
let currentBottomBuffer = 0;

/** Time allowed between conversions */
const timeout = 5000;

const serverURL = "https://server.juanferrer.dev/riot/api.php";

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

$("#check-button").click(checkChampionChest);

$(".name-input").on("change", function () {
    $(this).removeClass("invalid");
});

function log(toLog) {
    // eslint-disable-next-line no-console
    console.log(toLog);
}

/**
 * Generic AJAX call
 * @param {string} url URL to make the call to
 * @param {Object} dataJSON Object with necessary data in JSON format
 * @param {string} request Request type
 * @param {function} callback Function to be called on success
 */
function makeAjaxCall(url, dataJSON, request, callback) {
    $.ajax({
        url: url,
        type: "GET",
        success: callback,
        error: function (xhr) {
            log("Error occured: " + xhr.responseText);
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
    if (name === "Wukong") return "MonkeyKing";
    else if (!name.match(" ")) {
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
    // eslint-disable-next-line no-useless-escape
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
 * Return a random integet between min (inclusive) and max (inclusive)
 * @param {number} min Lower bound in the form of an int
 * @param {number} max Upper bound in the form of an int
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Change the image from the bottom buffer, change opacity from the top buffer and swap buffers
 */
function changeBackground() {
    document.getElementById(`background-${currentBottomBuffer}`).style.backgroundImage
		= `url("https://ddragon.leagueoflegends.com/cdn/img/champion/${(window.screen.availWidth / window.screen.availHeight < 1) ? "loading" : "splash"}/${championName}_${/*getRandomInt(0, championSkinsAmount - 1)*/0}.jpg")`;

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
    $("#progress")[0].style.opacity = 1;
    regionalEndpoint = $("#region-selector").val();
    summonerName = $("#summoner-name-textbox").val();
    if (!isValidSummoner(summonerName)) {
        $("#summoner-name-textbox").addClass("invalid");
        return;
    }
    championName = validateName($("#champion-name-textbox").val());
    setProgress(10);
    populateChampionList();
}

/**
 * Set the value of the progress bar
 * @param {number} value
 */
function setProgress(value) {
    $("#progress").css("width", `${value}%`);
    if (value === 100) {
        setTimeout(function () {
            $("#progress")[0].style.opacity = 0;
            setTimeout(function () {
                setProgress(0);
            }, 1000);
        }, 1000);
    }
}

/**
 * Retrieve a list with details of all champions. should be called once per day
 */
function populateChampionList() {
    setProgress(15);
    const data = {};
    const versionURL = `https://ddragon.leagueoflegends.com/realms/${regionalEndpoint.replace(/\d+?/g, "")}.json`;

    makeAjaxCall(versionURL, data, undefined, function (response) {
        setProgress(25);
        const version = response.n.champion;

        const championURL = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/championFull.json`;

        makeAjaxCall(championURL, data, "championList", function (response) {
            setProgress(30);
            championList = response.data;
            log("List populated");
            championId = getChampionIdFromName(championName);
            championSkinsAmount = getSkinsAmountFromName(championName);
            setProgress(40);
            if (championId) {
                getSummonerIdFromName();
            }
        });
    });
}

/**
 * Get the ID of a champion from the name
 * @param {string} name
 */
function getChampionIdFromName(name) {
    const tempId = championList[name] ? championList[name].key : null;
    if (tempId) {
        return tempId;
    } else {
        $("#champion-name-textbox").addClass("invalid");
    }
}

/**
 * Get the amount of skins of a champion from the name
 * @param {string} name
 */
function getSkinsAmountFromName(name) {
    return championList[name] ? championList[name].skins.length : 2;
}

/**
 * Get the ID of a summoner from the name
 */
function getSummonerIdFromName() {
    let cachedSummonerNamesString = "",
        cachedSummonerNames = {};

    // First, check if the desired summonerName is on the cache
    cachedSummonerNamesString = window.localStorage.getItem("summonerNames");
    setProgress(45);
    if (cachedSummonerNamesString) {
        cachedSummonerNames = JSON.parse(cachedSummonerNamesString);
        if (cachedSummonerNames[summonerName]) {
            // Use that ID instead
            summonerId = cachedSummonerNames[summonerName];
            getMasteryFromIds();
            return;
        }
    }
    // Get the ID from the name and cache it
    const data = { "regionalEndpoint": regionalEndpoint, "summonerName": encodeURIComponent(summonerName) };

    setProgress(50);
    makeAjaxCall(serverURL, data, "summonerId", function (response) {
        try {
            log("ID received");
            if (response === "Summoner not found") { throw "invalid"; }
            summonerId = JSON.parse(response).id;
            cachedSummonerNames[summonerName] = summonerId;
            window.localStorage.setItem("summonerNames", JSON.stringify(cachedSummonerNames));
            setProgress(60);
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
    setProgress(70);
    const data = { "regionalEndpoint": regionalEndpoint, "summonerId": summonerId, "championId": championId };
    makeAjaxCall(serverURL, data, "championMastery", function (response) {
        setProgress(85);
        log("Mastery received");
        if (response === "Champion never played") {
            hasChest = false;
            championLevel = 0;
        } else {
            const result = JSON.parse(response);
            hasChest = result.chestGranted;
            championLevel = result.championLevel;
        }
        $("#chest-unlocked-icon").attr("src", `./img/${hasChest ? "un" : ""}lock.svg`);
        setProgress(100);
    });
}
