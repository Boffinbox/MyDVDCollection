export { };

const express = require("express")
const router = express.Router({ mergeParams: true });

const { verifyUser } = require("../auth/authenticate");
const TryCatchAsync = require("../helpers/TryCatchAsync")

const userdvds = require("../controllers/userdvds");

// dvd logic
// add a dvd to an existing collection by dvd barcode
router.post("/:barcode", verifyUser, TryCatchAsync(userdvds.addDVD));

// update a dvd in a collection by discId
router.patch("/:discId", verifyUser, TryCatchAsync(userdvds.updateDVD));

// remove a dvd from an existing collection by discId
router.delete("/:discId", verifyUser, TryCatchAsync(userdvds.deleteDVD));

module.exports = router;