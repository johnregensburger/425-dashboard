const users = require("./userCrud.cjs");

console.log("-=-=-=-=-=-=-=-=-=-=-=-=- USER TESTING BEGIN -=-=-=-=-=-=-=-=-=-=-=-=-");
//users.createUser("john", "msu");
users.updateUser(1, "password", "csc");

(async () => {
    try {
        const user = await users.readUser(1); // Await the result from readUser
        console.log(user); // Log the returned user data
    } catch (err) {
        console.error(err.message); // Log any errors
    }
})();

users.deleteUser(1);

(async () => {
    try {
        const user = await users.readUser(1); // Await the result from readUser
        console.log(user); // Log the returned user data
    } catch (err) {
        console.error(err.message); // Log any errors
    }
})();

/*users.createUser("john", "msu");
users.updateUser(1, "password", "csc");
users.deleteUser(1);*/
/* (async () => {
    users.createUser("john", "msu");
    console.log(getUser(1));
    users.updateUser(1, "password", "csc");
    console.log(getUser(1));
    users.deleteUser(1);
    console.log(getUser(1));
})(); */

/*users.createUser("johnr", "msu");
(async () => {
    try {
        const user = await users.readUser(1); // Pass the desired user ID
        console.log(user);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
//console.log(users.verifyLogin("johnr", "msu"));
//users.updateUser(1, "password", "csc");
//console.log(users.readUser(1));
//console.log(users.verifyLogin("johnr", "msu"));
//users.deleteUser(1);
//console.log(users.readUser(1));*/