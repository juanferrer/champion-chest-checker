# Champion Chest Checker

It tells you whether or not you have a chest with the specified champion.

Steps taken to acomplish:

1. Get `regionalEndpoint`: user selection
0. Get `summonerName`: user input
0. Get `summonerId`: `{regionalEndpoint}/lol/summoner/v3/summoners/by-name/{summonerName}?api_key={apiKey}`
0. Get `championList`: `{regionalEndpoint}/lol/static-data/v3/champions?api_key={apiKey}`
0. Get `championMasteryList`: `{regionalEndpoint}.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}/by-champion/{championId}{apiKey}`
0. Get `championName`: user input
0. Get `championId`: search list until `championName` is found
0. Get `chestGranted`: search list until `championId` is found

Stuff that could be added:

- A simple call to `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/{championName}_0.jpg` could return an image to set as background. For example: ![Ornn splash art](http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ornn_0.jpg)
Pretty cool, eh?