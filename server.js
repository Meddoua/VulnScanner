// server.js
const express = require('express');
const app = express();
const port = 3000;

// Import the scanner routes
const scannerRouter = require('./routes/scanner');

// Use the scanner routes
app.use('/api', scannerRouter);

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Vulnerability Scanner');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});