const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.get("/", userController.getUsers);
router.post("/", userController.addUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);

// ✅ Protected route: get profile using token
router.get("/profile", authMiddleware, userController.getProfile);
module.exports = router;
