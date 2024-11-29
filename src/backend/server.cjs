// Express server that defines HTTP routes or endpoints for all CRUD operations
// 11/29 JH
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('./userCrud.cjs');
const games = require('./gameCrud.cjs');
const library = require('./libraryCrud.cjs');

const app = express();
const port = 3000;

// Use the Body-parser middleware to parse incoming HTTP requests
app.use(bodyParser.json());

// Use CORS as well
app.use(cors());

// USER ENDPOINTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

// Create user
app.post('/users', async (req, res) => {
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
app.get('/users/read/:id', async (req, res) => {
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
app.put('/users/:id', async (req, res) => {
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
app.delete('/users/:id', async (req, res) => {
    try {
        await users.deleteUser(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Validate user
app.post('/users/validate', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Verifying login...");
        const isValid = await verifyLogin(username, password);
        if (!isValid) {
            return res.status(401).send('Invalid username or password');
        }

        // If valid, respond with success
        res.json({ message: 'Login successful' });
    } catch (error) {
        if (error.message === "User not found") {
            // Handle specific error when the user is not found
            return res.status(401).send('Invalid username or password');
        }   
        // For other errors, send a 500 response
        console.error("Error validating login:", error.message);
        res.status(500).send('Internal server error');
    }
});

//Assign token


// GAME ENDPOINTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //


// LIBRARY ENDPOINTS -=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=--=-=- //

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});