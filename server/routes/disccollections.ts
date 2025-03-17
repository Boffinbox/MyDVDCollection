export { };

const express = require("express")
const router = express.Router();

const { verifyUser } = require("../auth/authenticate");
const TryCatchAsync = require("../helpers/TryCatchAsync")
const validateNewCollection = require("../validators/newCollection");
const validateCollectionId = require("../validators/collectionId");
const disccollections = require("../controllers/disccollections");

// disc collection restful routing
// index a list of all a user's disc collections
router.get("/", verifyUser, TryCatchAsync(disccollections.index))

// return all unknown discs of a user
router.get("/unknowns", verifyUser, TryCatchAsync(disccollections.unknowns))

// show individual disc collection
router.get("/:collectionId", verifyUser, validateCollectionId, TryCatchAsync(disccollections.showCollection))

// create new disc collection
router.post("/", verifyUser, validateNewCollection, TryCatchAsync(disccollections.newCollection));

// update disc collection name
router.patch("/:collectionId", verifyUser, validateNewCollection, validateCollectionId, TryCatchAsync(disccollections.updateCollection));

// delete route, to nuke a collection from orbit
router.delete("/:collectionId", verifyUser, validateCollectionId, TryCatchAsync(disccollections.deleteCollection));

module.exports = router;