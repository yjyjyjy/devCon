const express = require("express");
const bcryptjs = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

// ---------------------------------------------------------------------------
// @route GET api/auth
// @desc Get the current user data
// @access private
router.get("/", auth, async (req, res) => {
  // add auth middleware
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ---------------------------------------------------------------------------
// @route POST api/auth
// @desc sign in
// @access Public
router.post(
  "/",
  [
    check("email", "Please have a valid email").isEmail(),
    check("password", "Password is at least 6 characters long.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    let user;
    let isPasswordValid = false;

    try {
      // verify user
      user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Incorrect Email or Password" }] });
      }

      isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Incorrect Email or Password" }] });
      }

      // Return the jsonWebToken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
