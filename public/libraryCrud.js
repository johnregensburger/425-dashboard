const sqlite3 = require("sqlite3").verbose();
const db = require("./database.js");
const users = require("./userCrud.js");
const games = require("./gameCrud.js");

// Creates a library entry based on the user and what game they've wishlisted or now own
async function createEntry(userId, gameId, status) {
    username = readUser(userId).username;
    gameName = readGame(gameId).gameName;
    try {
        db.run(
            `
            INSERT OR IGNORE INTO UserLibrary (userId, username, gameId, gameName, status)
            VALUES (?, ?, ?, ?, ?)
            `,
            [userId, username, gameId, gameName, status],
            function (e) {
                if (e) {
                    console.log(`ERR: Library entry creation failed. See below:`);
                    console.error(e.message);
                } else {
                    console.log(`Inserted library entry`);
                }
            }
        );
    } catch (e) {
        console.error(e.message);
    }
}

// Reads a library entry based on the entry ID
async function readEntry(id) {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT ownershipId, userId, username, gameId, gameName, status
            FROM Users
            WHERE userId = ?`, [id], (err, row) => {
            if (err) {
                console.log(`ERR: Library entry read failed. See below:`);
                console.error(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
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
    updateEntry,
    deleteEntry
}