/* Collectin of controllers to handle blog operations */

const Blog = require("../models/Blog");
const User = require("../models/User");
const fs = require("fs");

// function to create a blog
exports.createBlog = async (req, res) => {
  try {
    // get the title and the content
    const { title, content } = req.body;

    const image = req.file.buffer; // Read the file buffer

    // get the user Id
    const userId = req.userId;

    // Find the user by ID to get the username
    const user = await User.findById(userId);

    // Create a new blog
    const newBlog = new Blog({ title, content, image, user: user });
    // save the blog
    await newBlog.save();

    // Populate the user field with the username
    const populatedBlog = await Blog.findOne({ _id: newBlog._id }).populate({
      path: "user",
      select: "username",
    });

    // send the success message and blog
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: populatedBlog });
  } catch (error) {
    console.error(error);
    // send the error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to get all the blogs
exports.getAllBlogs = async (req, res) => {
  try {
    // Get all blogs and populate the user field with the usernames
    const blogs = await Blog.find().populate("user", "username");

    // send the blogs
    res.json(blogs);
  } catch (error) {
    // send the error messages
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to get the logged in users blogs
exports.getUserBlogs = async (req, res) => {
  try {
    // get the user id
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's blogs and populate the user field with the username
    const blogs = await Blog.find({ user: userId }).populate(
      "user",
      "username"
    );

    // send the blogs
    res.json(blogs);
  } catch (error) {
    // send error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to get the blog that is clicked on
exports.getBlogById = async (req, res) => {
  try {
    // get the blog Id
    const blogId = req.params.id;

    // Get user's blogs and populate the user field with the username and likes
    const blog = await Blog.findById(blogId)
      .populate("user", "username")
      .populate("likes", "username");

    // if the blog is not found
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // send the blog
    res.json(blog);
  } catch (error) {
    // send error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to get the blogs by a user whose name was clicked on
exports.getBlogs = async (req, res) => {
  try {
    // get the username
    const { username } = req.params;

    // Find the user by their username
    const user = await User.findOne({ username });

    // if the user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the user's blogs and populate the user field with the username
    const blogs = await Blog.find({ user: user._id }).populate(
      "user",
      "username"
    );

    // send the blogs
    res.json(blogs);
  } catch (error) {
    console.error(error);
    // send error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    // get the blog id
    const blogId = req.params.id;
    // get the user id
    const userId = req.body.user;

    // Find the blog post by ID and user
    const blog = await Blog.findOne({ _id: blogId, user: userId });

    // if the blog is not in the database
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the image buffer
    if (blog.image && blog.image instanceof Buffer) {
      blog.image = undefined;
    }

    // Delete the blog post
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    // the deleted blog is not deleted
    if (!deletedBlog) {
      return res.status(500).json({ message: "Failed to delete the blog" });
    }

    // send success message
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("DELETE BLOG ERROR: ", error);
    // send error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to edit a blog
exports.editBlog = async (req, res) => {
  try {
    // get the new title, content and image
    const { title, content } = req.body;
    const blogId = req.params.id;
    // get the user id
    const userId = req.userId;

    // Check if the blog exists and belongs to the user
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    // if the blog is not found
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update the blog with the new title and content
    blog.title = title;
    blog.content = content;

    // Only update the image if a new image is provided
    if (req.file) {
      // Delete the previous image buffer
      const previousImage = blog.image;
      if (previousImage && previousImage instanceof Buffer) {
        // Delete the previous image buffer (if it exists)
        blog.image = undefined;
      }

      blog.image = req.file.buffer;
    }

    // save the blog
    await blog.save();

    // send success message
    res.json({ message: "Blog updated successfully" });
  } catch (error) {
    // send error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to like a blog
exports.likeBlog = async (req, res) => {
  try {
    // get blog id
    const blogId = req.params.id;
    // get user id
    const userId = req.userId;

    // Find the blog by ID
    const blog = await Blog.findById(blogId);

    // if the blog is not found
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user has already liked the blog
    if (blog.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this blog" });
    }

    // Add the user's ID to the likes array
    blog.likes.push(userId);

    // Increment the likesCount field by one
    blog.likesCount += 1;

    // save the blog
    await blog.save();

    // send success message
    res.json({ message: "Blog liked successfully" });
  } catch (error) {
    // send error message
    res.status(500).json({ message: "Internal server error" });
  }
};

/*
The modifications include:

By using req.file.buffer instead of req.file.filename,
you can store the image data as binary in the image field of the blog schema.

In the updated code, when deleting a blog, we also check if the image field contains binary data (Buffer)
and set it to undefined to remove the reference to the image buffer.
This ensures that the memory occupied by the image buffer is released.

*/
