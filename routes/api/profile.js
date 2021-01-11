const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const request = require("request");
const config = require("config");

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
    profileFields.company = company;
    profileFields.website = website;
    profileFields.location = location;
    profileFields.bio = bio;
    profileFields.status = status;
    profileFields.githubusername = githubusername;
    profileFields.skills = skills.split(",").map((skill) => skill.trim());

    // social stuff
    profileFields.social = {};
    profileFields.social.youtube = youtube;
    profileFields.social.facebook = facebook;
    profileFields.social.twitter = twitter;
    profileFields.social.linkedin = linkedin;
    profileFields.social.instagram = instagram;

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

// @route DELETE api/profile
// @desc delete profile, user and posts of the current user.
// @access Private

router.delete("/", auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
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

// @route DELETE api/profile/experience/:exp_id
// @desc delete profile experience
// @access Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    const experience = profile.experiences.filter(
      (exp) => exp.id === req.params.exp_id
    )[0];
    if (!experience) {
      res.status(500).json({ msg: "cannot find the experience requested" });
    }
    profile.experiences = profile.experiences.filter(
      (exp) => exp.id !== experience.id
    );
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error deleting experience" });
  }
});

// @route PUT api/profile/education
// @desc add profile education
// @access Private

router.put(
  "/education",
  [
    auth,
    [
      check("degree", "degree is required").not().isEmpty(),
      check("school", "school is required").not().isEmpty(),
      check("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      degree,
      school,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      degree,
      school,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.push(newEdu); // same to push but to the beginning.
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Error adding education" });
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc delete profile experience
// @access Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    const education = profile.education.filter(
      (edu) => edu.id === req.params.edu_id
    )[0];
    if (!education) {
      res.status(500).json({ msg: "cannot find the education requested" });
    }
    profile.education = profile.education.filter(
      (edu) => edu.id !== education.id
    );
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error deleting education" });
  }
});

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
      }
      if (response.statusCode !== 200) {
        console.log(response.statusCode);
        return res.status(404).json({ msg: "No Github profile found!" });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
