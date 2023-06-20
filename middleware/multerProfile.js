/* Configure file upload with multer library */

// import library
const multer = require("multer");

// Configure the multer storage and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profilePics/"); // Specify the destination folder where the files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique file name
  },
});

// Create a multer instance with the configured storage
const upload = multer({ storage: storage });

module.exports = upload;
