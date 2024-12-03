// Express server that defines HTTP routes or endpoints for all CRUD operations
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('./userCrud.cjs');
const games = require('./gameCrud.cjs');
const libraries = require('./libraryCrud.cjs');

const exp = express();
const port = 3000;

// Use the Body-parser middleware to parse incoming HTTP requests
exp.use(bodyParser.json());
const authorizeUser = (req, res, next) => {
    const sessionUserId = req.session.user?.id;
    const resourceUserId = req.params.id || req.body.userId;

    if (!sessionUserId) {
        return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    if (sessionUserId !== parseInt(resourceUserId, 10)) {
        return res.status(403).json({ message: 'Forbidden: Access to this resource is not allowed' });
    }

    next(); // User is authorized to access this resource
};

// Use CORS as well
exp.use(cors());

// LOGIN =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

exp.use(session({
    secret: '3n@4#zC^d8F!q9J4^w@U9tP*lZ$eT0z',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,        // Helps prevent XSS
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 1000 * 60 * 60 // 1-hour session
    }
}));

exp.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
  });

exp.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Validate credentials (e.g., check database)
    const userId = users.getUserId(username, password);
    if (userId != -1) {
      req.session.user = { id: userId, username }; // Save user info in session
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
});

exp.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    });
});

// USER ENDPOINTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

// Create user
exp.post('/users', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        await users.createUser(username, password);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read or fetch user (by ID)
exp.get('/users/:id', async (req, res) => {
    try {
        const user = await users.readUser(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update user
exp.put('/users/:id', async (req, res) => {
    const { column, newValue } = req.body;

    if (!column || !newValue) {
        return res.status(400).json({ error: 'Column and newValue are required' });
    }

    try {
        await users.updateUser(req.params.id, column, newValue);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
exp.delete('/users/:id', async (req, res) => {
    try {
        await users.deleteUser(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validate user
exp.post('/users/verify-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const isValid = await users.verifyLogin(username, password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // If valid, respond with success
        res.json({ message: 'Login successful', username });

    } catch (error) {
        if (error.message === "User not found") {
            return res.status(401).json({ error: 'Invalid username or password' });
        }   
        // For other errors, send a 500 response
        console.error("Error validating login:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Assign token


// GAME ENDPOINTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

// Create game
exp.post('/games', async (req, res) => {
    const { gameName, description, leadDesigner, publisher, boxArtUrl, 
        releaseDate, minPlayers, maxPlayers, playTime, age } = req.body;
    
    if (!gameName || !description || !leadDesigner || !publisher || 
        !boxArtUrl || !releaseDate || !minPlayers || !maxPlayers || 
        !playTime || !age) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await games.createGame(gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age);
        res.status(201).json({ message: 'Game created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read or fetch all games
exp.get('/games', async (req, res) => {
    try {
        const allGames = await games.readAll();
        res.json(allGames);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read or fetch all games in the filter parameters
exp.get('/games/filter', async (req, res) => {
    try {
        const minPlayers = parseInt(req.query.minPlayers, 10);
        const maxPlayers = parseInt(req.query.maxPlayers, 10);

        const filtGames = await games.filterPlayerNumber(minPlayers,maxPlayers);
        res.json(filtGames);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read or fetch game
exp.get('/games/:id', async (req, res) => {
    try {
        const game = await games.readGame(req.params.id);
        if (game) {
            res.json(game);
        } else {
            res.status(404).send('Game not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update game
exp.put('/games/:id', async (req, res) => {
    const { column, newValue } = req.body;

    if (!column || !newValue) {
        return res.status(400).json({ error: 'Column and newValue are required' });
    }

    try {
        await games.updateGame(req.params.id, column, newValue);
        res.status(200).json({ message: 'Game updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete game
exp.delete('/games/:id', async (req, res) => {
    try {
        await games.deleteGame(req.params.id);
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LIBRARY ENDPOINTS -=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=--=-=- //

// Create library entry
exp.post('/libraries', async (req, res) => {
    const { userId, gameId, status } = req.body;

    if (!userId || !gameId || !status) {
        return res.status(400).json({ error: 'UserId, gameId, and status are required' });
    }

    try {
        await libraries.createEntry(userId, gameId, status);
        res.status(201).json({ message: 'Library entry created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read or fetch all games
exp.get('/libraries', async (req, res) => {
    try {
        const allGames = await libraries.readAll();
        res.json(allGames);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read or fetch all games of a specific user
exp.get('/userlibrary/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const entries = await libraries.readUserLibrary(userId);
        if (entries) {
            res.json(entries);
        } else {
            res.status(404).send('Library entries not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read or fetch all user games of a specific user with the filter parameters
exp.get('/libraries/:id/filter', async (req, res) => {
    const { userId, filter } = req.body;
    try {
        const entries = await libraries.filterReadLibrary(userId, filter);
        if (entries) {
            res.json(entries);
        } else {
            res.status(404).send('Library entries not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read or fetch all user games of a specific user with the set player count
exp.get('/libraries/:id/filter', async (req, res) => {
    const userId = req.params.id;
    const minPlayers = parseInt(req.query.min, 10);
    const maxPlayers = parseInt(req.query.max, 10);
    try {
        const filtLibraries = await libraries.filterPlayerNumber(userId,minPlayers,maxPlayers);
        res.json(filtLibraries);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read or fetch library entry (by ID)
exp.get('/libraries/:id', async (req, res) => {
    try {
        const entry = await libraries.readEntry(req.params.id);
        if (entry) {
            res.json(entry);
        } else {
            res.status(404).send('Library entry not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update library entry
exp.put('/libraries/:id', async (req, res) => {
    const { column, newValue } = req.body;

    if (!column || !newValue) {
        return res.status(400).json({ error: 'Column and newValue are required' });
    }

    try {
        await libraries.updateEntry(req.params.id, column, newValue);
        res.status(200).json({ message: 'Library entry updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete library entry
exp.delete('/libraries/:id', async (req, res) => {
    try {
        await libraries.deleteEntry(req.params.id);
        res.status(200).json({ message: 'Library entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

// Start the server
exp.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

module.exports = exp;