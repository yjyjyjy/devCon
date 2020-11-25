const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const router = express.Router();

// @route GET api/posts
// @desc Create a post
// @access Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
