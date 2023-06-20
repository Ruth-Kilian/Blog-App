/* Authentication middleware */

// import the dependency
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get the JWT token from the Authorization header -> split to remove the Bearer prefix
  const token = req.headers.authorization?.split(" ")[1];

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  try {
    // takes the tokena and secret key as parameters
    const decodedToken = jwt.verify(token, "my_secret_key");
    // the decoded token is obtained and the userId property is assigned
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    // catch and send the error as a response
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
