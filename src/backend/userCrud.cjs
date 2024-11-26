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

// TODO: Fix
async function readUser(id) {
    // Should run the following SQLite query with the corresponding parameters
    // Should return the userId, username, and (hashed) password of a user
    await new Promise((resolve, reject) => {
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
                    reject(new Error('User not found')); // Reject if no user is found
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
    db.get(
        `
        SELECT password FROM Users
        WHERE username = ?
        `,
        [username]
    );
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
}

// Creates a new user with specified username and password
async function createUser(username, password) {
    try {
        const hashedPassword = await encryptPassword(password);
        return new Promise((resolve, reject) => {
            db.run(
                `
                INSERT OR IGNORE INTO Users (username, password)
                VALUES (?, ?)
                `,
                [username, hashedPassword],
                function (e) {
                    if (e) {
                        console.log(`ERR: User creation failed. See below:`);
                        console.error(e.message);
                        reject(e);
                    } else {
                        console.log(`Inserted user`);
                        resolve(this.lastID);
                    }
                }
            );
        }) 
        
    } catch (e) {
        console.error(e.message);
    }
}

// Reads user by searching for ID
async function readUser(id) {
    try {
        const user = await dbGet(
            `SELECT userId, username, password
             FROM Users
             WHERE userId = ?`,
            [id]
        );
        return user; // Return the fetched user
    } catch (e) {
        console.error('Error fetching user:', e);
        throw error; // Re-throw the error to handle it further up if necessary
    }
}


// Updates column of user with newValue
async function updateUser(id, column, newValue) {
    if (column == "password") {
        newValue = await encryptPassword(newValue);
    }
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

module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    verifyLogin
};

/*console.log("-=-=-=-=-=-=-=-=-=-=-=-=- TESTING BEGIN -=-=-=-=-=-=-=-=-=-=-=-=-");
createUser("johnr", "msu");
console.log(verifyLogin("johnr", "msu"));
updateUser(1, "password", "csc");
console.log(readUser(1));
console.log(verifyLogin("johnr", "msu"));
deleteUser(1);
console.log(readUser(1));*/