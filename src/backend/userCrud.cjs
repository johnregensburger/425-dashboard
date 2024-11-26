const sqlite3 = require("sqlite3").verbose();
const db = require("./database.cjs");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Encrypts password
async function encryptPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

// Verifies user login
async function verifyLogin(username, password) {
    return await new Promise((resolve, reject) => {
        db.get(
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
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT userId, username, password
            FROM Users
            WHERE userId = ?`, [id], (err, row) => {
            if (err) {
                console.log(`ERR: User read failed. See below:`);
                console.error(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
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