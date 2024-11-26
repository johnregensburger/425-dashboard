const sqlite3 = require("sqlite3").verbose();
const db = require("./database.cjs");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Encrypts password
async function encryptPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

// Create new user with specified username and password
async function createUser(username, password) {
    const hashedPassword = await encryptPassword(password);
    await new Promise((resolve, reject) => {
        db.run(
            `
            INSERT OR IGNORE INTO Users (username, password)
            VALUES (?, ?)
            `,
            [username, hashedPassword],
            function (e) {
                if (e) {
                    return reject(e);
                }
                console.log("User " + username + " created");
                resolve();
            }
        );
    });    
}

async function readUser(id) {
    // Should run the following SQLite query with the corresponding parameters
    // Should return the userId, username, and (hashed) password of a user
    return new Promise((resolve, reject) => {
        db.get(
            `
            SELECT userId, username, password
            FROM Users
            WHERE userId = ?
            `,
            [id],
            function (e, row) {
                if (e) {
                    reject(e); // Reject if there's an error
                } else if (row) {
                    resolve(row); // Resolve with the row data if found
                } else {
                    reject(new Error("User not found")); // Reject if no user is found
                }
            }
        );
    });
}

async function updateUser(id, column, newValue) {
    if (column == "password") {
        newValue = await encryptPassword(newValue);
    }
    await new Promise((resolve, reject) => {
        db.run(
            `
            UPDATE Users SET ${column} = ? WHERE userId = ?
            `,
            [newValue, id],
            function (e) {
                if (e) {
                    return reject(e);
                }
                console.log(column + " of user at ID " + id + " updated to " + newValue);
                resolve();
            }
        );
    });
}

async function deleteUser(id) {
    // Should run the following SQLite query with the corresponding parameters
    await new Promise((resolve, reject) => {
        db.run(
            `
            DELETE FROM Users
            WHERE userId = ?
            `,
            [id],
            function (e) {
                if (e) {
                    reject(e);
                }
                console.log("Deleted user at ID " + id);
                resolve();
            }
        );
    });
}

// TODO: Fix
async function verifyLogin(username, password) {
    const hashedPassword = await encryptPassword(password);

    // Should run the following SQLite query with the corresponding parameters
    // Should compare the results of the query to the login attempt
    const user = await new Promise((resolve, reject) => {
        db.get(
            `
            SELECT password FROM Users
            WHERE username = ?
            `,
            [username],
            function (e, row) {
                if (e) {
                    reject(e); // Reject if there's an error
                } else if (row) {
                    resolve(row); // Resolve with the row data if found
                } else {
                    reject(new Error("User not found")); // Reject if no user is found
                }
            }
        );
    });
    // Compare the provided password with the hashed password
    bcrypt.compare(password, row.password)
        .then(isMatch => resolve(isMatch))
        .catch(compareErr => {
            console.error(compareErr.message);
            reject(compareErr);
        });
}

module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    verifyLogin
};












/*
// Encrypts password
async function encryptPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

// Verifies user login
async function verifyLogin(username, password) {
    return await new Promise((resolve, reject) => {
        dbGet(
            `
            SELECT password FROM Users
            WHERE username = ?
            `,
            [username],
            (err, row) => {
                if (err) {
                    console.log(`ERR: User verification failed. See below:`);
                    console.error(err.message);
                    reject(err);
                } else if (!row) {
                    resolve(false); // User not found
                } else {
                    // Compare the provided password with the hashed password
                    bcrypt.compare(password, row.password)
                        .then(isMatch => resolve(isMatch))
                        .catch(compareErr => {
                            console.error(compareErr.message);
                            reject(compareErr);
                        });
                }
            }
        );
    });
}*/