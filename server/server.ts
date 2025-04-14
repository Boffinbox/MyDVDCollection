export { };

const app = require("./app.ts")
const https = require("https");
const fs = require("fs");
const path = require("path");
const options = {
    key: fs.readFileSync(path.join(__dirname, "certs/localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs/localhost.pem"))
}
const appHTTPS = https.createServer(options, app)
const port = process.env.PORT || 5000;

// Lastly, serve the app
if (process.env.NODE_ENV == "production")
{
    app.listen(port, () =>
    {
        console.log(`Server started on port ${port}`)
    })
}
else
{
    appHTTPS.listen(port, () =>
    {
        console.log(`Local server started on port ${port}`)
    })
}