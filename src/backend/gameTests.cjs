const games = require("./gameCrud.cjs");

console.log("-=-=-=-=-=-=-=-=-=-=-=-=- USER TESTING BEGIN -=-=-=-=-=-=-=-=-=-=-=-=-");
//games.createGame("gameName", "description", "leadDesigner", "publisher", "boxArtUrl", 1, 2, 3, 4, 5);
(async () => {
    const game = await games.readGame(95);
    console.log(game);
})();