const sqlite3 = require("sqlite3").verbose();
const db = require("./database.js");

        // TODO: Create hash function to pass passwords through
function encryptPassword(password) {
    const encryptedPassword = "";
    return encryptedPassword;
}

// Creates a new user with specified username and password
        // TODO: Implement encryption
function createUser(username, password) {
    db.run(
        `
        INSERT OR IGNORE INTO Users (username, password)
        VALUES (?, ?)
        `,
        [username, password],
        function (e) {
            if (e) {
                console.log(`ERR: User creation failed. See below:`);
                console.error(e.message);
            } else {
                console.log(`Inserted user`);
            }
        }
    );
}

// Reads user by searching for ID
        // TODO: Implement decryption
function readUser(id) {
    db.get(`
        SELECT userId, username, password
        FROM Users
        WHERE userId = ?`, [id], (err, row) => {
        if (err) {
            console.log(`ERR: User read failed. See below:`);
            console.error(err.message);
        } else {
            console.log(row);
        }
    });
}


// Updates column of user with newValue
        // TODO: Implement encryption and decryption
function updateUser(id, column, newValue) {
    const query = `UPDATE Users SET ${column} = ? WHERE userId = ?`;
    db.run(query, [newValue, id], function (err) {
        if (err) {
            console.log(`ERR: User update failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Updated user with id ${id}`);
        }
    });
}

// Deletes user at specified ID
function deleteUser(id) {
    db.run(`
        DELETE FROM Users
        WHERE userId = ?`, [id], function (err) {
        if (err) {
            console.log(`ERR: User delete failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Deleted user with id ${id}`);
        }
    });
}

//console.log("-=-=-=-=-=-=-=-=-=-=-=-=- TESTING BEGIN -=-=-=-=-=-=-=-=-=-=-=-=-");
//createUser("johnr", "msu");
//updateUser(1, "password", "csc");
//deleteUser(1);
//readUser(1);