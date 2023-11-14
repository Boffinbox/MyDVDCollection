export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")
const userFunctions = require("./helpers/users")
const referenceDVDFunctions = require("./helpers/referencedvds")

test.todo(`add a reference dvd, and then add that dvd to a user`) //, async () =>
// {
//     const refDVDDetails = referenceDVDFunctions.generateReferenceDVDDetails({ title: "test one", barcode: "5678" });
//     referenceDVDFunctions.addAReferenceDVD(refDVDDetails)

//     const userDetails = userFunctions.generateUserDetails({ username: "steve", email: "steverules@gmail.com", pass: "hunter2" });
//     const registerRes = userFunctions.registerAUser(userDetails);
//     const token = registerRes.body.token;
// })