// Import dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Blog = require("../models/Blog");
const fs = require("fs").promises;
const path = require("path");

// Function to register a user
exports.register = async (req, res) => {
  try {
    // Get the username, password, and profile pic
    const { username, password, role } = req.body;
    const profilePicture = req.file.filename;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      profilePicture,
      role,
    });
    // Save the user in the database
    await newUser.save();

    // Send success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    // Send error message
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Function to handle the login of a user
exports.login = async (req, res) => {
  try {
    // Get the username and password
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token using the userId and the secret key
    const token = jwt.sign({ userId: user._id }, "my_secret_key");

    // Send the token, userId, and role to be used in the frontend
    res.json({
      message: "User logged in successfully",
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    // Send the error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get the logged in user's information
exports.getUser = async (req, res) => {
  try {
    // Get the user ID
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    res.json({ user });
  } catch (error) {
    console.error(error);
    // Send the error message
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Function to get all the users' information
exports.getUsers = async (req, res) => {
  try {
    // Find all users
    const users = await User.find();

    // If there are no users in the database
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the users
    res.json({ users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Function to allow the user to change their username
exports.changeUsername = async (req, res) => {
  try {
    // Expect the user ID as a parameter
    const { userId } = req.params;
    // Get the new username
    const { newUsername } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the username
    user.username = newUsername;
    // Save the user
    await user.save();

    // Send success message
    res.json({ message: "Username updated successfully" });
  } catch (error) {
    console.error(error);
    // Send error message
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Function for user to change their password
exports.changePassword = async (req, res) => {
  try {
    // Expect the user ID as a parameter
    const { userId } = req.params;
    // Get the current and new password
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    // If the current password input does not match the password in the database
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    // Save the user
    await user.save();

    // Send success message
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    // Send error message
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Function to change user profile picture
exports.changeProfilePicture = async (req, res) => {
  try {
    // Expect the user ID as a parameter
    const { userId } = req.params;
    // Get the new profile picture file
    const profilePicture = req.file.filename;

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not in the database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the previous profile picture in the folder
    const previousProfilePic = user.profilePicture;
    if (previousProfilePic) {
      const profilePicsPath = path.join(
        __dirname,
        "../profilePics",
        previousProfilePic
      );
      await fs.unlink(profilePicsPath, (err) => {
        if (err) console.log(err);
      });
    }

    // Update the profile picture
    user.profilePicture = profilePicture;
    // Save the user
    await user.save();
    // Send the success message
    res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error(error);
    // Send error message
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Function to delete the user's own account
exports.deleteAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    // Retrieve user's blogs
    const userBlogs = await Blog.find({ user: userId });

    // Delete the blog images
    userBlogs.forEach(async (blog) => {
      const imagePath = path.join(__dirname, "../uploads", blog.image);
      await fs.unlink(imagePath, (err) => {
        if (err) console.log(err);
      });
    });

    // Retrieve user's profile picture
    const user = await User.findById(userId);
    const profilePicturePath = path.join(
      __dirname,
      "../profilePics",
      user.profilePicture
    );
    await fs.unlink(profilePicturePath, (err) => {
      if (err) console.log(err);
    });

    // Delete user's blog posts
    await Blog.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account" });
  }
};

/*
The modifications include:

In the changeProfilePicture function:

Changed fs.unlinkSync to fs.unlink.
Added await before fs.unlink to wait for the file deletion to complete.
Added a callback function to handle errors if they occur during the file deletion.
In the deleteAccount function:

Changed fs.unlinkSync to fs.unlink.
Added await before fs.unlink to wait for the file deletion to complete.
Added a callback function to handle errors if they occur during the file deletion.
*/
