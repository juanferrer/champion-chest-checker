# Champion Chest Checker

League of Legends web app. Find out whether or not you have a chest with the specified champion. View [here](https://juanferrer.dev/champion-chest-checker)

Steps taken to acomplish:

1. Get `regionalEndpoint`: user selection
0. Get `summonerName`: user input
0. Get `summonerId`: `{regionalEndpoint}/lol/summoner/v4/summoners/by-name/{summonerName}?api_key={apiKey}`
0. Get `championList`: if no current championList is cached, `{regionalEndpoint}/lol/static-data/v4/champions?api_key={apiKey}`
0. Get `championName`: user input
0. Get `championId`: search `championList`
0. Get `championMastery`: `{regionalEndpoint}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{summonerId}/by-champion/{championId}?api_key={apiKey}`
0. Get `chestGranted`: search `chestGranted` in `championMastery`
