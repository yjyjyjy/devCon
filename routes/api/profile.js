const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

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
let profiles;
router.get("/", async (req, res) => {
  try {
    profiles = await Profile.find({}).populate("user", [
      "user",
      "name",
      "avatar",
    ]);
    res.json(profiles);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ msg: "Retrieve all users failed" });
  }
});

module.exports = router;
