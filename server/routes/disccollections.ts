export { };

const express = require("express")
const router = express.Router();

const { verifyUser } = require("../auth/authenticate");
const TryCatchAsync = require("../helpers/TryCatchAsync")
const validateNewCollection = require("../validators/newCollection");
const disccollections = require("../controllers/disccollections");

// disc collection restful routing
// index a list of all disc collections (in future: only DCs that user is authorized to see)
router.get("/", verifyUser, TryCatchAsync(disccollections.index))

// show individual disc collection
router.get("/:collectionId", verifyUser, TryCatchAsync(disccollections.showCollection))

// create new disc collection
router.post("/", verifyUser, validateNewCollection, TryCatchAsync(disccollections.newCollection));

// delete route, to nuke a collection from orbit
router.delete("/:collectionId", verifyUser, TryCatchAsync(disccollections.deleteCollection));

module.exports = router;