const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/login", loginController.renderLoginPage);
router.post("/login", loginController.loginUser);
router.get("/logout", authMiddleware, loginController.logoutUser);

module.exports = router;