//dependencies
const express = require("express");
const mongoose = require("mongoose");

//bring in api files for routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//initialize app to express
const app = express();

//DB config
const db = require("./config/keys").mongoURI;

//connect to mongodb through mongoose
mongoose
  .connect(db)
  .then(() => console.log("Your MongoDB is Connected")) //upon success show connected successfully
  .catch(err => console.log(err));

//route to hompage
app.get("/", (req, res) => res.send("What Up Doe!"));

// use routes after you've brought them into the server.js file
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server running on port " + port + "!"));
