const User = require("../models/User");
const Profile = require("../models/Profile");
const { validationResult } = require("express-validator");

const getMyProfile = async (req, res) => {
  try {
    const p = await Profile.findOne({ user: req.uid }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!p) return res.json({ msg: "no profile found to this account" });
    res.json(p);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const Create_Update_Profile = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors.array()[0]);
    }

    const { bio, location, social } = req.body;

    const p = {
      user: req.uid,
      bio: "",
      location: "",
      social: {},
    };

    if (bio) p.bio = bio;
    if (location) p.location = location;
    if (social?.youtube) p.social.youtube = social.youtube;
    if (social?.twitter) p.social.twitter = social.twitter;
    if (social?.facebook) p.social.facebook = social.facebook;
    if (social?.linkedin) p.social.linkedin = social.linkedin;
    if (social?.instagram) p.social.instagram = social.instagram;

    const updated = await Profile.findOneAndUpdate({ user: req.uid }, p, {
      new: true,
      upsert: true,
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const getProfileByID = async (req, res) => {
  try {
    const { id } = req.params;

    const p = await Profile.findOne({ user: id }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!p) return res.json({ msg: "no profile found to this account" });
    res.json(p);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const AddTags = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors.array()[0]);
    }

    const p = await Profile.findOne({ user: req.uid });

    if (!p) return res.json({ msg: "no profile found to this account" });

    const { tags } = req.body;

    const TagsArr = tags.split(",").map((tag) => tag.trim());

    p.tags = TagsArr;
    await p.save();
    res.json(p);
  } catch (err) {}
};

const DeleteAccount = async (req, res) => {
  try {
    //todo delete posts
    await Promise.all([
      Profile.findOneAndDelete({ user: req.uid }),
      User.findByIdAndDelete(req.uid),
    ]);
    res.json({ mess: "user has been deleted" });
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

module.exports = {
  getProfiles,
  getMyProfile,
  Create_Update_Profile,
  getProfileByID,
  DeleteAccount,
  AddTags,
};
