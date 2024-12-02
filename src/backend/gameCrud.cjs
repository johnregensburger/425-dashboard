const sqlite3 = require("sqlite3").verbose();
const db = require("./database.cjs");

// Create new game with all necessary information
async function createGame(gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age) {
    await new Promise((resolve, reject) => {
        db.run(
            `
            INSERT OR IGNORE INTO Games (gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age],
            function (e) {
                if (e) {
                    return reject(e);
                }
                console.log("Game " + gameName + " created");
                resolve();
            }
        );
    });    
}

// Return a game with specified ID
async function readGame(id) {
    return new Promise((resolve, reject) => {
        db.get(
            `
            SELECT gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age
            FROM Games
            WHERE gameId = ?
            `,
            [id],
            function (e, row) {
                if (e) {
                    reject(e); // Reject if there's an error
                } else if (row) {
                    resolve(row); // Resolve with the row data if found
                } else {
                    reject(new Error("Game not found")); // Reject if no game is found
                }
            }
        );
    });
}

async function readAll() {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age
            FROM Games
            `,
            function (e, rows) {
                if (e) {
                    reject(e); // Reject if there's an error
                } else if (rows && rows.length > 0) {
                    resolve(rows); // Resolve with all rows if found
                } else {
                    reject(new Error("No games found")); // Reject if no games are found
                }
            }
        );
    });
}

async function filterReadGame(filter) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age
            FROM Games
            WHERE gameName LIKE ? 
            OR description LIKE ? 
            OR leadDesigner LIKE ? 
            OR publisher LIKE ? 
            OR boxArtUrl LIKE ? 
            OR releaseDate LIKE ? 
            OR minPlayers LIKE ? 
            OR maxPlayers LIKE ? 
            OR playTime LIKE ? 
            OR age LIKE ?
            `,
            Array(10).fill(`%${filter}%`),
            function(e, results) {
                if (e) {
                    reject(e);
                } else if (results) {
                    resolve(results);
                } else {
                    reject(new Error("No games found"));
                }
            }
        );
    });
}

async function filterPlayerNumber(min, max) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age
            FROM Games
            WHERE minPlayers >= ? AND maxPlayers <=?
            `,
            [min, max],
            function(e, results) {
                if (e) {
                    reject(e);
                } else if (results) {
                    resolve(results);
                } else {
                    reject(new Error("No games found"));
                }
            }
        );
    });
}

// Update a column of a game at specified ID with a new value
async function updateGame(id, column, newValue) {
    const query = `UPDATE Games SET ${column} = ? WHERE gameId = ?`;
    db.run(query, [newValue, id], function (err) {
        if (err) {
            console.log(`ERR: Game update failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Updated game with id ${id}`);
        }
    });
}

// Delete a game at specified ID
function deleteGame(id) {
    db.run(`
        DELETE FROM Games
        WHERE gameId = ?`, [id], function (err) {
        if (err) {
            console.log(`ERR: Game delete failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Deleted game with id ${id}`);
        }
    });
}

module.exports = {
    createGame,
    readGame,
    readAll,
    filterReadGame,
    filterPlayerNumber,
    updateGame,
    deleteGame
}