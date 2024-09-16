/*
This is the basis for running node on Windows, 
if you are referencing this and on a linux based os, 
there will be minor changes that may be needed.
*/

const https = require("https");

// Reading and finding files 
const fs = require("fs");
const path = require("path");

/*
Running external files
exec is good for running shorter lived scripts.

spawn is better suited for streams of data or large amounts of it.
*/
const { exec } = require("child_process"); 

const { spawn } = require("child_process");

// getting other js files for local project
const <REFERENCE> = require("./<FILE_NAME.js>");

// SSL selfsigning

const sslOptions = {
    key: fs.readFileSync("PATH/TO/PRIVATEKEY.pem"),
    cert: fs.readFileSync("PATH/TO/CERTIFICATE.pem")
};

// Other security
// Setting up HTTPS server

/*
Put any custom local functions here.
forexapmle, for logging we have a function that pulls the ip of whoever connects to the server.
*/

function getClientIp(req) {
    let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.substring(7);
    }
    return ipAddress;
}

// Sanitize file paths to prevent path traversal attacks and other injections in the url or uri
function sanitizePath(requestPath) {
    const sanitized = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[\/\\])+/, '').replace(/[<>:"/\\|?*%]/g, '');
    return sanitized;
}

// static pathing and sanitization 
const express = require('express');
app.get('*', (req, res) => {
    const ip = getClientIp(req);
    console.log('/-----------|new_connection|-----------/');
    console.log(`Client connected from IP: ${ip}`);

    // Sanitize requested path
    let requestedPath = sanitizePath(req.url === '/' ? 'index.html' : req.url);
    const filePath = path.join(publicDirectory, requestedPath);

    // Validate file extensions
    const allowedExtensions = ['.html'];
    const ext = path.extname(filePath).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        res.writeHead(403);
        res.end('Forbidden: Invalid file type.');
        return;
    }

    // Serve the file if it exists
    fs.readFile(filePath, (err, data) => {
        if (err || !fs.existsSync(filePath)) {
            res.writeHead(404);
            res.end('404 Not Found');
        } else {
            res.writeHead(200);
            res.end(data);
        }
    });
    
});

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
// Start the server
const server = https.createServer(sslOptions, app).listen(443, () => {
    consol.log("HTTPS Server running ");
});
