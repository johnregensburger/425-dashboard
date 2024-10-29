const sqlite3 = require("sqlite3").verbose();
const db = require("./database.js");

// Creates a new user with specified username and password
function createUser(username, password) {
    try {
        db.run(
            `
            INSERT OR IGNORE INTO Users (username, password)
            VALUES (?, ?)
            `,
            [username, password],
            function (e) {
                if (e) {
                    console.error(e.message);
                } else {
                    console.log(`Inserted user`);
                }
            }
        );
    } catch (e) {
        console.error(e.message);
    }
}

/*// Reads user by searching for ID
// TODO: MAKE WORK
function readUser(id) {
    db.run(`
        SELECT userId, username password
        FROM Users
        WHERE userId IS ${id}`
    );
}*/

// Updates column of user with newValue
function updateUser(id, column, newValue) {
    try {
        db.run(`
            UPDATE Users
            SET ${column} = ${newValue}
            WHERE userId IS ${id}`
        );
    } catch (e) {
        console.error(e.message);
    }
}

// Deletes user at specified ID
function deleteUser(id) {
    db.run(`
        DELETE FROM Users
        WHERE userId IS ${id}`
    );
}

createUser("johnr", "msu");
readUser(1);
updateUser("password", "csc");
deleteUser(1);