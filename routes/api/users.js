const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require("../../models/User");

//@route   GET request for api/users/test
//@desc    Tests for  post route
//@acess   Public
router.get("/test", (req, res) => res.json({
  msg: "Users Works"
}));

//@route   GET request for api/users/register
//@desc    Register user
//@acess   Public --> can't be logged in to register so it has to be public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check Validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
    email: req.body.email
  }) //search db for same email --> make sure we require body parser to use req.body
    .then(user => {
      if (user) {
        errors.email = 'Email already exists'
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // Size
          r: "r", // Rating
          d: "mm" // Default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  //check Validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({
    email
  }).then(user => {
    // Check for user
    if (!user) { // if user is not found
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        } // Create JWT Payload

        // sign token --> utilizes JWT algorithm to digitally sign a token and basically makes the token unique to that user
        jwt.sign(
          payload,
          keys.secretOrKey, {
            expiresIn: 3600
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token //bearer is a certain type of protcol for JWT
            });
          });
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/login
// @desc    Return the current user
// @access  Private
router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;