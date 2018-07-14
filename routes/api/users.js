const express = require("express");
const router = express.Router();

//@route   GET request for api/users/test
//@desc    Tests for  post route
//@acess   Public
router.get("/test", (req, res) => res.json({ msg: "User Works" }));

module.exports = router;
