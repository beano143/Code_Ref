/*
This is the basis for running node on Windows, 
if you are referencing this and on a linux based os, 
there may be minor changes that may be needed.
*/

// basic requirements that your page is going to need
const https = require("https");
const express = require("express");

const app = express();

// Reading and finding files 
const fs = require("fs");
const path = require("path");

/*
fs can be utilized with the full direcory path like 
fs.readFileSync(PATH\TO\FILE)

while path can set up local directories see;

const publicDirectory = path.join(__dirname, 'public');
const filePath = path.join(publicDirectory, requestedPath);

this can be used for things like SSL selfsigning
*/
const sslOptions = {
    key: fs.readFileSync("PATH\\TO\\privatekey.pem"),
    cert: fs.readFileSync("PATH\\TO\\certificate.pem")
};

/*
Running external files
exec is good for running shorter lived scripts.

spawn is better suited for streams of data or large amounts of it.

if using both you can use 

const { exec, spawn } = require("child_process");
*/
const { exec } = require("child_process"); 

const { spawn } = require("child_process");

// getting other js files for local project
//const <REFERENCE> = require("./<FILE_NAME.js>");


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
const publicDirectory = path.join(__dirname, 'public');

app.get('/coolpage', (req, res) => {
	const ip = getClientIp(req);
    console.log('/-----------|new_connection|-----------/');
    console.log(`connected from IP: ${ip} at /coolpage`);
	const paged = `<html><body><h1><p>hello, your IP is ${ip} </p></h1></body></html>`;
	//you can also display info using res.send, this can be used to for exaple display data
	res.send(paged)
});

// running scripts with exec 
app.get('/runscriptexec', (req, res) =>{
	const ip = getClientIp(req);
    console.log('---Running local PowerShell script----');
    console.log(`connection from ${ip} `)
    const localScript = path.join(__dirname, 'local-script.ps1');
	
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${localScript}"`, (error, stdout, stderr) => {
	
		res.send(`<html><body>script ran locally</body></html>`)
        if (error) {
            console.error(`Error executing local script: ${error.message}`);
            return;
        }
	if (stderr) {
	    console.stderr(`Error executing local script: ${stderr.message}`);
	    return;
	}
	
	if (stdout) {
	    console.log(`Local script executed successfully. Output: ${stdout}`);
	    return;
	}
    });
});

// running scripts with spawn
app.get('/runscriptspawn', (req, res) =>{
	const ip = getClientIp(req);
    console.log('---Running local PowerShell script----');
	console.log(`connection from ${ip}`)
	const localScript = path.join(__dirname, 'local-script.ps1');
	
	res.send(`<html><body>script ran locally</body></html>`)
	
	//exec can be replaced with spawn
    const script = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass',  '-File', localScript])
	
	script.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`)
	});
	
	script.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`)
	});
	
	script.on('close', (code) => {
		console.log(`script closed with code ${code}`)
	});
});

//this is dynamic pathing, it can be used to pull various directories it should be put after static pages and pathing 
app.get('*', (req, res) => {
    const ip = getClientIp(req);
    console.log('/-----------|new_connection|-----------/');
    console.log(`connected from IP: ${ip} at ${req.url}`);

    // Sanitize requested path
    let requestedPath = sanitizePath(req.url === '/' ? 'index.html' : req.url);
    const filePath = path.join(publicDirectory, requestedPath);

    // Validate file extensions
    const allowedExtensions = ['.html'];
    const ext = path.extname(filePath).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        res.writeHead(403);
        res.end('Forbidden, you may not have access to this page.');
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
    console.log("HTTPS Server running.");
});
