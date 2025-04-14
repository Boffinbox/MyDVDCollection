// start up mongoose
const mongoose = require("mongoose")
let dbUrl = "mongodb://127.0.0.1:27017/myDVDCollectionDB"
if (process.env.NODE_ENV == "production")
{
    dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/myDVDCollectionDB"
}
// break glass to manually override
// dbUrl = "mongodb://127.0.0.1:27017/myDVDCollectionDB"
mongoose.connect(dbUrl)
    .then(() =>
    {
        console.log(`${dbUrl == "mongodb://127.0.0.1:27017/myDVDCollectionDB" ? "Local " : ""}MongoDB Connection Open :)`);
    })
    .catch((err) =>
    {
        console.log(`Oh no! ${dbUrl == "mongodb://127.0.0.1:27017/myDVDCollectionDB" ? "Local " : ""}MongoDB Connection Error :(`);
        console.log(err);
    });
// end mongoose