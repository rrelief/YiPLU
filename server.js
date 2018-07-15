// dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport'); // Node.js middleware necessary for the authentication of Json Web Token

//bring in api files for routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//initialize app to express
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB through mongoose
mongoose
  .connect(db)
  .then(() => console.log("Your MongoDB is Connected"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize()); //--> everything else done in passport will be in config strategy for our passport strategy

//Passport
require('./config/passport')(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}!`));