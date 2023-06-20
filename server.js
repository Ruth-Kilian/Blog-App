// server.js -> responsible for creating and strating the server

const app = require("./app");
const port = process.env.PORT || 8080;
const express = require("express");
const path = require('path');

// this code sets up a static file server that serves the frontend files from the "build" directroy
app.use(express.static(path.join(__dirname, 'frontend/build')));

// it ensures all that all requests to the backend are redirected to the index.html file in the frontend folder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});

app.listen(port, () => console.log("Server started on port 8080"));
