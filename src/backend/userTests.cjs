const users = require("./userCrud.cjs");

console.log("-=-=-=-=-=-=-=-=-=-=-=-=- USER TESTING BEGIN -=-=-=-=-=-=-=-=-=-=-=-=-");
users.createUser("johnr", "msu");
console.log(users.readUser(1));
console.log(users.verifyLogin("johnr", "msu"));
users.updateUser(1, "password", "csc");
console.log(users.readUser(1));
console.log(users.verifyLogin("johnr", "msu"));
users.deleteUser(1);
console.log(users.readUser(1));