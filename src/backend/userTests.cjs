const users = require("./userCrud.cjs");

console.log("-=-=-=-=-=-=-=-=-=-=-=-=- USER TESTING BEGIN -=-=-=-=-=-=-=-=-=-=-=-=-");
users.createUser("john", "msu");
users.updateUser(1, "password", "csc");
users.deleteUser(1);


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