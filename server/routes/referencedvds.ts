export { };

const express = require("express")
const router = express.Router();

const TryCatchAsync = require("../helpers/TryCatchAsync")

const referencedvds = require("../controllers/referencedvds");

// reference dvd logic
router.get("/", TryCatchAsync(referencedvds.getAllReferenceDVDs))

router.post("/", TryCatchAsync(referencedvds.updateReferenceDVD))

module.exports = router;