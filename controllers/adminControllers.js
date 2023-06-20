const Blog = require("../models/Blog");
const User = require("../models/User");
const path = require("path");
const fs = require("fs").promises;

// Delete a user account
exports.deleteUserAccount = async (req, res) => {
  try {
    // Get userId as a parameter
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not in the database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the blog posts of the user
    const userBlogs = await Blog.find({ user: userId });

    // Delete the blog images
    for (const blog of userBlogs) {
      const imagePath = path.join(__dirname, "../uploads", blog.image);
      await fs.unlink(imagePath);
    }

    // Delete user's blog posts
    await Blog.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Delete the profile picture file
    if (user.profilePicture) {
      const profilePicturePath = path.join(
        __dirname,
        "../profilePics",
        user.profilePicture
      );
      await fs.unlink(profilePicturePath);
    }

    // Send success message
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    // Send error message
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user account" });
  }
};

// Handle the deletion of a user's blog post
exports.deleteUserBlog = async (req, res) => {
  try {
    // Expects the blogId as a parameter
    const blogId = req.params.id;

    // Find the blog by the provided blogId
    const blog = await Blog.findById(blogId);

    // If the blog is not in the database
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, "../uploads", blog.image);
    await fs.unlink(imagePath);

    // Delete the blog post
    await Blog.findByIdAndDelete(blogId);

    // Send success message
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("ADMIN DELETE BLOG ERROR: ", error);
    // Send error message
    res.status(500).json({ message: "Internal server error" });
  }
};

/*
The modifications include:

Importing fs.promises instead of fs to use the promise-based API for file operations.
Using await with fs.unlink to ensure the file is deleted before proceeding.
Using path.join to construct the file paths, ensuring compatibility across different operating systems.

*/
