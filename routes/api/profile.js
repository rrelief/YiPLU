const express = require("express");
const router = express.Router();

//@route   GET request for api/profile/test
//@desc    Tests for  post route
//@acess   Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

module.exports = router;
