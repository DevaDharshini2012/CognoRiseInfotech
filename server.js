const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// MongoDB connection
const connectDB = require('./db'); // Import the connectDB function

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB

        // Routes
        const resultsRoutes = require('./routes/results');
        app.use('/api/results', resultsRoutes);

        // Serve index.html for root URL
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error Message:', err.message);
            console.error('Stack Trace:', err.stack);
            res.status(err.status || 500).send(err.message || 'Something broke!');
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Error starting server:', err);
    }
};

startServer();
