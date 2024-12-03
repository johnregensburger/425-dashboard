const sqlite3 = require("sqlite3").verbose();
const db = require("./database.cjs");
const users = require("./userCrud.cjs");
const games = require("./gameCrud.cjs");

// Creates a library entry based on the user and what game they've wishlisted or now own
async function createEntry(userId, gameId, status) {
    let user = await users.readUser(userId);
    let username = user.username;
    let game = await games.readGame(gameId);
    let gameName = game.gameName;
    let boxArtUrl = games.boxArtUrl;
    await new Promise((resolve, reject) => {
        try {
            db.run(
                `
                INSERT OR IGNORE INTO UserLibrary (userId, gameId, gameName, boxArtUrl, status)
                VALUES (?, ?, ?, ?, ?)
                `,
                [userId, gameId, gameName, boxArtUrl, status],
                function (e) {
                    if (e) {
                        console.error(`ERR: Library entry creation failed. See below:`);
                        console.error(e.message);
                        return reject(e);
                    } else {
                        console.log(`Inserted library entry`);
                        resolve();
                    }
                }
            );
        } catch (e) {
            console.error(e.message);
        }
    });
}

// Reads a library entry based on the entry ID
async function readEntry(id) {
    return new Promise((resolve, reject) => {
        db.get(
            `
            SELECT ownershipId, userId, gameId, gameName, boxArtUrl, status
            FROM UserLibrary
            WHERE ownershipId = ?
            `,
            [id], (err, row) => {
            if (err) {
                console.error(`ERR: Library entry read failed. See below:`);
                console.error(err.message);
                reject(err);
            } else if (row) {
                resolve(row);
            } else {
                reject(new Error("Library entry not found"));
            }
        });
    });
}

// Reads the library of all users
async function readAllLibrary() {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT ownershipId, userId, gameId, gameName, boxArtUrl, status
            FROM UserLibrary
            `,
            function (e, rows) {
                if (e) {
                    reject(e); // Reject if there's an error
                } else if (rows && rows.length > 0) {
                    console.log("Library entries found");
                    resolve(rows); // Resolve with all rows if found
                } else {
                    reject(new Error("No library entries found")); // Reject if no games are found
                }
            }
        );
    });
}

// Reads the library of a specific user
async function readUserLibrary(id) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT ownershipId, userId, gameId, gameName, boxArtUrl, status
            FROM UserLibrary
            WHERE userId = ?
            `,
            [id],
            function (e, rows) {
                if (e) {
                    reject(e); // Reject if there's an error
                } else if (rows && rows.length > 0) {
                    console.log("Library entries found");
                    resolve(rows); // Resolve with all rows if found
                } else {
                    reject(new Error("No library entries found")); // Reject if no games are found
                }
            }
        );
    });
}

// Reads and filters the library of a specific user
async function filterReadLibrary(id, filter) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT ownershipId, userId, gameId, gameName, boxArtUrl, status
            FROM UserLibrary
            WHERE userId LIKE ?
            AND (gameName LIKE ?
            OR status LIKE ?)
            `,
            [id, filter, filter],
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

// Reads the library of a specific user and filters by player count
async function filterPlayerNumber(id, min, max) {
    if (min > max) {
        console.error("Minimum players is greater than maximum players. Please adjust and try again.");
    } else {
        return new Promise((resolve, reject) => {
            db.all(
                `
                SELECT gameId, gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age
                FROM Games
                WHERE userId = ?
                AND minPlayers >= ? AND maxPlayers <=?
                `,
                [id, min, max],
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
}

// Updates an attribute of a library entry
async function updateEntry(id, column, newValue) {
    const query = `UPDATE UserLibrary SET ${column} = ? WHERE ownershipId = ?`;
    db.run(query, [newValue, id], function (err) {
        if (err) {
            console.log(`ERR: Library entry update failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Updated library entry with id ${id}`);
        }
    });
}

// Deletes a library entry
async function deleteEntry(id) {
    db.run(`
        DELETE FROM UserLibrary
        WHERE ownershipId = ?`, [id], function (err) {
        if (err) {
            console.log(`ERR: Library entry delete failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Deleted library entry with id ${id}`);
        }
    });
}

module.exports = {
    createEntry,
    readEntry,
    readAllLibrary,
    readUserLibrary,
    filterReadLibrary,
    filterPlayerNumber,
    updateEntry,
    deleteEntry
}