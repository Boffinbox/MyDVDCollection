export { };

const app = require("./app.ts")
const https = require("https");
const fs = require("fs");
const path = require("path");

// Lastly, serve the app
const port = process.env.PORT || 5000;
app.listen(port, () =>
{
    console.log(`Server started on port ${port}`)
})