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
    updateGame,
    deleteGame
}