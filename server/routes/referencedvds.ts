export { };

const express = require("express")
const router = express.Router();

const validateNewDVD = require("../validators/newDVD");
const TryCatchAsync = require("../helpers/TryCatchAsync")

const referencedvds = require("../controllers/referencedvds");

// reference dvd logic
router.get("/", TryCatchAsync(referencedvds.getAllReferenceDVDs))

router.post("/", validateNewDVD, TryCatchAsync(referencedvds.updateReferenceDVD))

module.exports = router;