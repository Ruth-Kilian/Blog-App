/* Mongoose schema for a blog post*/

// import dependencies
const mongoose = require("mongoose");
const User = require("../models/User");

// define the schema
const blogSchema = new mongoose.Schema({
  // references the User model and represents the user who created the blog
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
    // stores the title of the blog post
  },
  title: {
    type: String,
    required: true,
  },
  // stores the content of the blog post
  content: {
    type: String,
    required: true,
  },
  // Stores the binary data of the blog image
  image: {
    type: Buffer,
  },
  // represents the users who liked the blog post
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
  // stores the total count of likes
  likesCount: {
    type: Number,
    default: 0,
  },
  // stores the creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // stores the last edited date
  updatedAt: {
    type: Date,
    default: null,
  },
});

// pre-save middleware - executed before saving the blog document
blogSchema.pre("save", function (next) {
  // a check to see if the likes field has been modified
  if (this.isModified("likes")) {
    // If only the 'likes' field is modified, skip updating 'updatedAt'
    return next();
  }
  // updates the field with the current date and time
  this.updatedAt = new Date();
  next();
});

// export the model
module.exports = mongoose.model("Blog", blogSchema);
