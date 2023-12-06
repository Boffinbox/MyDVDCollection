export { };

const express = require("express")
const router = express.Router({ mergeParams: true });

const { verifyUser } = require("../auth/authenticate");
const TryCatchAsync = require("../helpers/TryCatchAsync")

const validateDiscId = require("../validators/discId");

const userdvds = require("../controllers/userdvds");

// dvd logic
// add a dvd to an existing collection by dvd barcode
router.post("/", verifyUser, TryCatchAsync(userdvds.addDVD));

// update a dvd in a collection by discId
router.patch("/:discId", verifyUser, validateDiscId, TryCatchAsync(userdvds.updateDVD));

// remove a dvd from an existing collection by discId
router.delete("/:discId", verifyUser, validateDiscId, TryCatchAsync(userdvds.deleteDVD));

module.exports = router;