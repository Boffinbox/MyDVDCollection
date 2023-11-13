export { }

const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const dbId = uuid();
const dbUrl = `mongodb://127.0.0.1:27017/${dbId}`

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
    // if for some cosmic coincidence, that the db already exists...
    await mongoose.connection.dropDatabase();
});

afterEach(async () =>
{
    // if you don't put this line in, you will have a
    // buildup of local test dbs.
    await mongoose.connection.dropDatabase();
});

afterAll(async () =>
{
    // if you don't put this line in, you will have a
    // buildup of local test dbs.
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});