const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const router = express.Router();

// @route POST api/posts
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
      res.status(500).send("server error while creating a post");
    }
  }
);

// @route GET api/posts
// @desc get all posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error while retrieving all posts");
  }
});

// @route GET api/posts/:postId
// @desc get post by id
// @access Private
router.get("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ msg: "Retrieving post by id failed. Post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      // when input is not a valid object id.
      return res.status(404).json({
        msg: "Retrieving post by id failed. Input is not an Object Id",
      });
    }
    console.error(error.message);
    res.status(500).send("server error while retrieving post by id");
  }
});

// @route DELETE api/posts/:postId
// @desc delete post by id
// @access Private
router.delete("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ msg: "Deleting post by id failed. Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "Deleting post by id failed. Unauthroized user" });
    }
    await post.remove();
    res.json({ msg: "post deleted" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      // when input is not a valid object id.
      return res.status(404).json({
        msg: "Deleting post by id failed. Input is not an Object Id",
      });
    }
    console.error(error.message);
    res.status(500).send("server error while deleting post by id");
  }
});

// @route PUT api/posts/like/:postId
// @desc user like a post
// @access Private
router.put("/like/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ msg: "Retrieving post by id failed. Post not found" });
    }

    // check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "the post has already been liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    if (error.kind === "ObjectId") {
      // when input is not a valid object id.
      return res.status(404).json({
        msg: "Retrieving post by id failed. Input is not an Object Id",
      });
    }
    console.error(error.message);
    res.status(500).send("server error while adding like to post");
  }
});

// @route PUT api/posts/unlike/:postId
// @desc user unlike a post
// @access Private
router.put("/unlike/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ msg: "Retrieving post by id failed. Post not found" });
    }

    // check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "the post has not been liked" });
    }
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    await post.save();
    res.json(post.likes);
  } catch (error) {
    if (error.kind === "ObjectId") {
      // when input is not a valid object id.
      return res.status(404).json({
        msg: "Retrieving post by id failed. Input is not an Object Id",
      });
    }
    console.error(error.message);
    res.status(500).send("server error while adding like to post");
  }
});

// @route POST api/posts/comment/:postId
// @desc Add a comment to a post
// @access Private
router.post(
  "/comment/:postId",
  [auth, [check("text", "Comment text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.postId);
      const newComment = {
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(newComment);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error while adding a comment to a post");
    }
  }
);

// @route DELETE api/posts/comment/:postId/:commentId
// @desc delete a comment to a post
// @access Private
router.delete("/comment/:postId/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.find(
      (comment) => comment.id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({
        msg: "Deleting comment failed. Cannot find the comment to be deleted.",
      });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "Unauthorized user!",
      });
    }
    post.comments = post.comments.filter(
      (comment) => comment.id.toString() !== req.params.commentId
    );
    await post.save();
    res.json(post.comments);
  } catch (error) {
    if (error.kind === "ObjectId") {
      // when input is not a valid object id.
      return res.status(400).json({
        msg: "Deleting comment by id failed. Input is not an Object Id",
      });
    }
    console.error(error.message);
    res.status(500).send("server error while deleting comment by id");
  }
});

module.exports = router;
