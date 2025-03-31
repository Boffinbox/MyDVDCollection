export { };

const express = require("express")
const router = express.Router();

const validateNewDVD = require("../validators/newDVD");
const validateReference = require('../validators/referenceId')
const TryCatchAsync = require("../helpers/TryCatchAsync")

const referencedvds = require("../controllers/referencedvds");

// reference dvd logic
router.get("/", TryCatchAsync(referencedvds.getAllReferenceDVDs))

router.get("/:referenceId", validateReference, TryCatchAsync(referencedvds.getSoloReferenceDVD))

router.post("/", validateNewDVD, TryCatchAsync(referencedvds.updateReferenceDVD))

module.exports = router;