/* Mongoose schema for a user*/

// import the dependency
const mongoose = require("mongoose");

// define the schema
const userSchema = new mongoose.Schema({
  // represents the username of the user
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // stores the user's password
  password: {
    type: String,
    required: true,
  },
  //  Stores the binary data of the user's profile picture
  profilePicture: {
    type: Buffer,
  },
  // represents the role of the user
  role: {
    type: String,
    enum: ["normal", "admin"], // The role can be either "normal" or "admin"
    default: "normal", // Set the default role to "normal" if not specified
  },
});

// export the module
module.exports = mongoose.model("User", userSchema);
