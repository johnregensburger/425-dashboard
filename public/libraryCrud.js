const sqlite3 = require("sqlite3").verbose();
const db = require("./database.js");

/* TODO:
    CRUD functions for library entries
*/

// Creates a library entry based on the user and what game they've wishlisted or now own
async function createEntry(userId, gameId, status) {

}

// Reads a library entry based on the entry ID
async function readEntry(id) {

}

// Updates an attribute of a library entry
async function updateEntry(id, column, newValue) {

}

// Deletes a library entry
async function deleteEntry(id) {

}