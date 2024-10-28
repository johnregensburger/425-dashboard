const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const xml2js = require("xml2js");

const apiUrl = "https://boardgamegeek.com/xmlapi2/search?type=boardgame&id=";

// Create and connect database
let db = new sqlite3.Database("dashboard.db", (e) => {
    if (e) {
        console.error(e.message);
    }
    console.log("Database connected");
});

// Create table of games and table of users
db.serialize(() => {
    db.run(
        `
        CREATE TABLE IF NOT EXISTS Games (
            gameId INTEGER PRIMARY KEY,
            gameName TEXT,
            designer TEXT,
            publisher TEXT,
            description TEXT,
            boxArtUrl TEXT,
            releaseDate INTEGER,
            ranking INTEGER,
            minPlayers INTEGER,
            maxPlayers INTEGER
        )
        `
    );

    db.run(
        `
        CREATE TABLE IF NOT EXISTS Users (
            userId INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT
        )
        ` // ^^^ Passwords should be hashed and salted, but that's a later problem
    );
});

// Iterate through boardgames up to 150,000
async function iterateData() {
    for (let firstIndex = 1; firstIndex < 150000; firstIndex += 20) { // 20 is the most ids the API can search for at once
        suffix = "";
        for (let i = 0; i < 20; i++) {
            suffix = suffix.concat((i + firstIndex).toString(), ",");
        }
        searchUrl = apiUrl.concat(suffix.slice(0, -1));
        
        const xmlData = await fetchData(searchUrl);
        if (xmlData) {
            await parseAndInsertXML(xmlData)
        };
    }

    //Close database
    db.close((e) => {
        if (e) {
            console.error(e.message);
        }
        console.log("Database closed");
    });
}

// Fetch BGG API data
async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        console.error("Error fetching data: ", e);
    }    
}

// Parse XML to insert data into database
async function parseAndInsertXML(xmlData) {
    const parser = new xml2js.Parser();

    parser.parseString(xmlData, (e, result) => {
        if (e) {
            throw e;
        }

        // Retrieve relevant data from XML and populate table
        const games = result.items.item;
        games.forEach(async (game) => {
            const gameId = parseInt(game.$.id);
            const name = game.name ? game.name[0].$.value : "Unknown";
            const designer = game.link
                .filter(link => link.$.type === 'boardgamedesigner')
                .map(link => link.$.value)
                .join(', ');
            const publisher = game.link
                .filter(link => link.$.type === 'boardgamepublisher')
                .map(link => link.$.value)
                .join(', ');
            const description = game.description ? game.description[0] : "No description";
            const boxArtUrl = game.image ? game.image[0] : null;
            const releaseDate = game.yearpublished ? game.yearpublished[0].$.value : null;
            const popularityRanking = game.statistics && game.statistics[0].ratings[0].ranks[0].rank
                .filter(rank => rank.$.name === 'boardgame')
                .map(rank => parseInt(rank.$.value))[0];
            const minPlayers = game.minplayers ? parseInt(game.minplayers[0].$.value) : null;
            const maxPlayers = game.maxplayers ? parseInt(game.maxplayers[0].$.value) : null;

            // Insert data into database
            await new Promise((resolve, reject) => {
                db.run(`
                    INSERT INTO Games (gameId, gameName, designer, publisher, description, boxArtUrl, releaseDate, ranking, minPlayers, maxPlayers)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [gameId, name, designer, publisher, description, boxArtUrl, releaseDate, popularityRanking, minPlayers, maxPlayers],
                    function (e) {
                        if (e) {
                            console.error(e.message);
                            reject(e.message);
                        }
                        console.log(`Inserted game with ID ${gameId}`);
                        resolve();
                    }
                );
            });
        });
    });
}

(async () => {
    await iterateData();
    //await parseAndInsertXML(xmlData);
})();