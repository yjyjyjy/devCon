const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const { json } = require("express");
const User = require("../../models/User");
const { findOne } = require("../../models/Profile");

// @route GET api/profile/me
// @desc get current user's profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/profile
// @desc create or update a profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // validate the data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // create a profile using the profile model

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) {
      profileFields.company = company;
    }
    if (website) {
      profileFields.website = website;
    }
    if (location) {
      profileFields.location = location;
    }
    if (bio) {
      profileFields.bio = bio;
    }
    if (status) {
      profileFields.status = status;
    }
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // social stuff
    profileFields.social = {};
    if (youtube) {
      profileFields.social.youtube = youtube;
    }
    if (facebook) {
      profileFields.social.facebook = facebook;
    }
    if (twitter) {
      profileFields.social.twitter = twitter;
    }
    if (linkedin) {
      profileFields.social.linkedin = linkedin;
    }
    if (instagram) {
      profileFields.social.instagram = instagram;
    }

    // mongoose operation
    let profile;
    try {
      profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: profileFields,
          },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ msg: "Can't save" });
    }
  }
);

// @route GET api/profile
// @desc get all profiles
// @access Public

router.get("/", async (req, res) => {
  try {
    let profiles;
    profiles = await Profile.find({}).populate("user", [
      "user",
      "name",
      "avatar",
    ]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Retrieve all users failed" });
  }
});

// @route GET api/profile/user/:uid
// @desc get profile by user id
// @access Public

router.get("/user/:uid", async (req, res) => {
  let profile;
  try {
    profile = await Profile.findOne({ user: req.params.uid }).populate("user", [
      "user",
      "name",
      "avatar",
    ]);
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Can't find the user's profile by user id" });
  }
});

// @route DELETE api/profile/user/:uid
// @desc delete profile, user and posts of the current user.
// @access Private

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndRemove(req.user.id);

    res.status(200).json({ msg: "deletion succeeded!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Can't find the user's profile by user id" });
  }
});

// @route PUT api/profile/experience
// @desc add profile experience
// @access Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experiences.push(newExp); // same to push but to the beginning.
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Error adding experience" });
    }
  }
);

module.exports = router;
