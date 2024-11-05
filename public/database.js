// JH 10.24 - Handles SQLite3 database operations
const sqlite3 = require("sqlite3").verbose();
const xml2js = require("xml2js");

const apiUrl = "https://boardgamegeek.com/xmlapi/boardgame/"; // Final slash proceeded by ID and ?
                                                              // ex: boardgame/1?

// Create and connect database
let db = new sqlite3.Database("public/dashboard.db", (e) => {
    if (e) {
        console.error(e.message);
    }
    console.log("Database connected");
});

// Create table of games, a table of users, and a table of games owned/wishlisted by users
db.serialize(() => {
    db.run(
        `
        CREATE TABLE IF NOT EXISTS Games (
            gameId INTEGER PRIMARY KEY,
            gameName TEXT,
            description TEXT,
            leadDesigner TEXT,
            publisher TEXT,
            boxArtUrl TEXT,
            releaseDate INTEGER,
            minPlayers INTEGER,
            maxPlayers INTEGER,
            playTime INTEGER,
            age INTEGER
        )
        `
    );

    db.run( /*TODO USER DATABASE? */
        `
        CREATE TABLE IF NOT EXISTS Users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
        ` // ^^^ Passwords should be hashed and salted, but that's a later problem
    );      //is it?

    db.run(
        `
        CREATE TABLE IF NOT EXISTS UserLibrary (
            ownershipId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            username TEXT,
            gameId INTEGER,
            gameName TEXT,
            status TEXT,
            FOREIGN KEY(userId) REFERENCES Users(userId),
            FOREIGN KEY(gameId) REFERENCES Games(gameId)
        )
        ` // ^^^ status should be either "owned" or "wishlisted"
    )
});

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

module.exports = db;