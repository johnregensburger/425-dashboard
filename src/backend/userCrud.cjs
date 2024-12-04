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

// Read user at specified ID
async function readUser(id) {
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

// Update attribute of user at specified ID with newValue
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

// Delete user at specified ID
async function deleteUser(id) {
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

// Verifies username and password during login
async function verifyLogin(username, password) {
    try{
    const user = await new Promise((resolve, reject) => {
        db.get(
            `
            SELECT username, password FROM Users
            WHERE username = ?
            `,
            [username],
            (e, row) => {
                if (e) {
                    reject(e); // Reject if there's an error
                }
                if (!row) {
                    return reject(new Error("User not found")); // Reject if user is not found
                }
                resolve(row);
            }
        );
    });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Match: " + isMatch);
    return isMatch; // Return whether the password matches
    } 
        catch(e) {
        console.error(e.message);
        throw e;
    }
}

// Wrapper function for verifyLogin that returns userID rather than true/false
async function getUserId(username, password) {
    const loggedIn = await verifyLogin(username, password);
    if (loggedIn) {
        const id = await new Promise((resolve, reject) => {
            db.get(
                `
                SELECT userId FROM Users
                WHERE username = ?
                `,
                [username],
                (e, row) => {
                    if (e) {
                        return reject(-1); // Reject if there's an error
                    }
                    if (!row) {
                        return reject(-1); // Reject if user is not found
                    }
                    resolve(row.userId); // Return userId
                }
            );
        });
        return id;
    } else {
        return -1; // If no user found
    }
}

module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    verifyLogin,
    getUserId
};