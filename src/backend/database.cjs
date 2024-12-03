// JH 10.24 - Handles SQLite3 database operations
const sqlite3 = require("sqlite3").verbose();

// Create and connect database
let db = new sqlite3.Database("src/backend/dashboard.db", (e) => {
    if (e) {
        console.error(e.message);
    } else {
        console.log("Database connected");
    }
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

    db.run(
        `
        CREATE TABLE IF NOT EXISTS Users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
        `
    );

    db.run(
        `
        CREATE TABLE IF NOT EXISTS UserLibrary (
            ownershipId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            gameId INTEGER,
            gameName TEXT,
            boxArtUrl TEXT,
            status TEXT CHECK(status IN ('owned', 'wishlisted')),
            FOREIGN KEY(userId) REFERENCES Users(userId),
            FOREIGN KEY(gameId) REFERENCES Games(gameId)
        )
        ` // ^^^ status should be either "owned" or "wishlisted"
    );
});

module.exports = db;