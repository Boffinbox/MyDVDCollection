export { };

const express = require("express")
const router = express.Router({ mergeParams: true });

const disccollectionRoutes = require("./disccollections");
const referenceDVDRoutes = require("./referencedvds");
const userDVDRoutes = require("./userdvds");
const userRoutes = require("./users");

const validateCollectionId = require("../validators/collectionId");

router.use("/users", userRoutes)
router.use("/referencedvds", referenceDVDRoutes)
router.use("/disccollections", disccollectionRoutes)
router.use("/disccollections/:collectionId/userdvds", validateCollectionId, userDVDRoutes)

module.exports = router;