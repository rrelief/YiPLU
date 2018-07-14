const express = require("express");
const router = express.Router();

//@route   GET request for api/posts/test
//@desc    Tests for  post route
//@acess   Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;
