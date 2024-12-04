//============ Populates the database: dashboard.db. runs on node populateDatabase.cjs =================
const xml2js = require("xml2js");
const db = require("./database.cjs");

const apiUrl = "https://boardgamegeek.com/xmlapi/boardgame/"; // Final slash proceeded by ID and ?

async function iterate() {
    const gameSize = 100;
    for (let i = 1; i < gameSize; i++) {
        const data = await fetchData(i); // Fetch data of game with ID = i
        const xmlData = await data.text(); // Readable API data as it would show up at the URL
            
        xml2js.parseString(xmlData, async (e, result) => { //uses xml2js to parse data into readable JS
            if (e) {
                throw e;
            } else {
                await populateTable(result); //the above parameters e(error) and result are whats returned from the parse
            }
        });
    }
}

async function fetchData(id) {
    let url = apiUrl.concat(id).concat("?"); // URL to fetch data from is base apiUrl above with id and ? at end
    try {
        return fetch(url); // Gets data found at url at ID = i
    } catch (e) {
        console.error("XML fetch error: " + e);
    }
}

async function populateTable(result) {
    try {
        const game = result.boardgames.boardgame[0];
        // the object ID of the boardgame at index 0 (which is the only one called)
        const gameId = game.$.objectid; // $ represents the boardgame itself, 
        const gameName = game.name[0]._; // ._ represents primary name of board game
        const description = game.description[0];
        const leadDesigner = game.boardgamedesigner[0]._;
        const publisher = game.boardgamepublisher[0]._;
        const boxArtUrl = game.image[0];
        const releaseDate = game.yearpublished[0];
        const minPlayers = game.minplayers[0];
        const maxPlayers = game.maxplayers[0];
        const playTime = game.playingtime[0];
        const age = game.age[0];

        db.run(`
            INSERT OR IGNORE INTO Games (gameId, gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [gameId, gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age],
            function (e) {
                if (e) {
                    console.error(e.message);
                }
                console.log(`Inserted game with ID ${gameId}`);
            }
        );
    } catch (e) {
        console.error(e);
    }
}

(async () => { //this method will be the first thing that runs.
    await iterate();
})();