export { };

const express = require("express")
const router = express.Router({ mergeParams: true });

const { verifyUser } = require("../auth/authenticate");
const TryCatchAsync = require("../helpers/TryCatchAsync")

const validateDiscId = require("../validators/discId");
const validateNewDVD = require("../validators/newDVD");
const validatePatchDVD = require("../validators/patchDVD");

const userdvds = require("../controllers/userdvds");

// dvd logic
router.get("/:discId", verifyUser, validateDiscId, TryCatchAsync(userdvds.getDVD))

// add a dvd to an existing collection by dvd barcode
router.post("/", verifyUser, validateNewDVD, TryCatchAsync(userdvds.addDVD));

// update a dvd in a collection by discId
router.patch("/:discId", verifyUser, validateDiscId, validatePatchDVD, TryCatchAsync(userdvds.updateDVD));

// remove a dvd from an existing collection by discId
router.delete("/:discId", verifyUser, validateDiscId, TryCatchAsync(userdvds.deleteDVD));

module.exports = router;