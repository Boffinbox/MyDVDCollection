export { };

const app = require("./app.ts")
const https = require("https");
const fs = require("fs");
const path = require("path");

// Lastly, serve the app
const port = 5000;
const options = {
    key: fs.readFileSync(path.join(__dirname, "certs/localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs/localhost.pem"))
}

const appHTTPS = https.createServer(options, app);

appHTTPS.listen(port, () =>
{
    console.log(`Server started on port ${port}`)
})