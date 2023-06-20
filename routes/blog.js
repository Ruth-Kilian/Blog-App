/* Route configuration for handling routes related to a blog post*/

// import dependencies
const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/blogControllers");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerImage");

// route to get all blogs
router.get("/", BlogController.getAllBlogs);

// route to create a blog post
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  BlogController.createBlog
);

// route to get the logged in users' blogs
router.get("/my-blogs/:userId", authMiddleware, BlogController.getUserBlogs);

// route to get the blog that was clicked on
router.get("/:id", BlogController.getBlogById);

// route to get other blogs by the user whose name was clicked on
router.get("/user/:username/blogs", BlogController.getBlogs);

// route to delete a blog
router.delete("/delete/:id", authMiddleware, BlogController.deleteBlog);

// route to edit a blog
router.put(
  "/edit/:id",
  authMiddleware,
  upload.single("image"),
  BlogController.editBlog
);

// route to like a post
router.put("/like/:id", authMiddleware, BlogController.likeBlog);

// export routes
module.exports = router;
