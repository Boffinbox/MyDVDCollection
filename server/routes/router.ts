export { };

const express = require("express")
const router = express.Router({ mergeParams: true });

const disccollectionRoutes = require("./disccollections");
const referenceDVDRoutes = require("./referencedvds");
const userDVDRoutes = require("./userdvds");
const userRoutes = require("./users");

router.use("/users", userRoutes)
router.use("/referencedvds", referenceDVDRoutes)
router.use("/disccollections", disccollectionRoutes)
router.use("/disccollections/:collectionId/userdvds", userDVDRoutes)

module.exports = router;