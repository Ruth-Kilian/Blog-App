/* Route configuration for handling routes related to user-related operations*/

// import dependencies
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminControllers");
const authMiddleware = require("../middleware/authMiddleware");

// route for admin to delete a user
router.delete("/:userId", authMiddleware, AdminController.deleteUserAccount);

// route for admin to delete a user's blog
router.delete("/delete/:id", authMiddleware, AdminController.deleteUserBlog);

// export routes
module.exports = router;
