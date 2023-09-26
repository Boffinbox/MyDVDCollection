const express = require("express");
const app = express();

app.get("/api", (req, res) =>
{
    res.json({ "dvds": ["indiana jones", "oppenheimer", "teletubbies", "die hard"] })
})

const port = 5000;
app.listen(port, () => { console.log(`Server started on port ${port}`) })