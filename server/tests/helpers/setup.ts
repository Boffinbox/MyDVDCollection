export { }

const mongoose = require("mongoose");
const path = require("path");
const fn = path.basename(__filename, ".test.ts");
const fileString = fn.charAt(0).toUpperCase() + fn.slice(1);
const dbUrl = `mongodb://127.0.0.1:27017/mDVDcBasicTestDB`

beforeAll(async () =>
{
    await mongoose.connect(dbUrl)
        .then(() =>
        {
            console.log(`MongoDB Test Connection Open :)`);
        })
        .catch((err) =>
        {
            console.log("Oh no! MongoDB Test Connection Error :(");
            console.log(err);
        });
    await mongoose.connection.dropDatabase();
});

afterAll(async () =>
{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});