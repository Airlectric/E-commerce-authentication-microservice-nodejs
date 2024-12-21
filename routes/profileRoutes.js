const express = require("express");
const { editProfile } = require("../controllers/profileController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/edit", isAuthenticated, editProfile);

module.exports = router;
