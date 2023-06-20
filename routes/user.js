/* Route configuration for handling routes related to user-related operations*/

// import dependencies
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerProfile");

// route to register a user
router.post(
  "/register",
  upload.single("profilePicture"),
  UserController.register
);

// route to login a user
router.post("/login", UserController.login);

// route to get the logged in user
router.get("/:userId", authMiddleware, UserController.getUser);

// route to get all users
router.get("/", UserController.getUsers);

// route for user to change username
router.post(
  "/:userId/change-username",
  authMiddleware,
  UserController.changeUsername
);

// route for user to change password
router.post(
  "/:userId/change-password",
  authMiddleware,
  UserController.changePassword
);

// route for user to change profile picture
router.post(
  "/:userId/change-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  UserController.changeProfilePicture
);

// route for a user to delete their account
router.delete("/account/:userId", authMiddleware, UserController.deleteAccount);

// export routes
module.exports = router;
