// routes/scanner.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Ensure this is correctly imported

// Define a route for basic vulnerability scanning
router.get('/scan', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(url);

        // Log response status and headers for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.raw());

        const body = await response.text();

        // Log the response body for debugging purposes
        console.log('Response body:', body);

        // Basic checks for vulnerabilities
        const vulnerabilities = [];

        // Improved check for potential XSS vulnerabilities
        // Using a regular expression to detect inline scripts or suspicious script tags
        const xssPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        const matches = body.match(xssPattern);
        if (matches) {
            matches.forEach(match => {
                if (match.includes('alert(') || match.includes('eval(') || match.includes('onerror=')) {
                    vulnerabilities.push('Potential XSS vulnerability detected.');
                }
            });
        }

        // Check for potential SQL Injection vulnerabilities (example check)
        if (body.includes('sql syntax') || body.includes('mysql_fetch')) {
            vulnerabilities.push('Potential SQL Injection vulnerability detected.');
        }

        res.json({
            url,
            vulnerabilities: vulnerabilities.length ? vulnerabilities : ['No obvious vulnerabilities detected.'],
        });
    } catch (error) {
        console.error('Error scanning the URL:', error);
        res.status(500).send('Error scanning the URL');
    }
});

module.exports = router;