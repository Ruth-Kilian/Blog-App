// app.js -> contains configurations and middleware setup

// import the dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// get the connection to the database from config folder
const connectDB = require("./config/connect");

// import the routes
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const adminRoutes = require("./routes/admin");

// create Express app
const app = express();

// connect to mongoDB
connectDB();

// parse incoming requests with JSON payloads
app.use(express.json());

// Helmet middleware added for security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "example.com"],
        imgSrc: ["'self'", "example.com", "images.pexels.com"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: true,
    hsts: true,
    hidePoweredBy: true,
    noCache: true,
    XContentOptions: "nosniff",
  })
);

// cors middleware is used to enable Cross-Origin Resource Sharing, allowing the server to handle requests from different domains.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// error catch
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error to the console for debugging purposes
  console.error(err);
  res.status(500).json({ error: "Internal server error" }); // Send a generic error response
});

// Routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
