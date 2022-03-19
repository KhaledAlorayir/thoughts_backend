const User = require("../models/User");
const Profile = require("../models/Profile");
const Posts = require("../models/Post");
const { validationResult } = require("express-validator");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

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
    if (social?.youtube && social?.youtube.trim() !== "")
      p.social.youtube = social.youtube;
    if (social?.twitter && social?.twitter.trim() !== "")
      p.social.twitter = social.twitter;
    if (social?.facebook && social?.facebook.trim() !== "")
      p.social.facebook = social.facebook;
    if (social?.linkedin && social?.linkedin.trim() !== "")
      p.social.linkedin = social.linkedin;
    if (social?.instagram && social?.instagram.trim() !== "")
      p.social.instagram = social.instagram;

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

    if (tags.trim() === "") {
      p.tags = [];
    } else {
      p.tags = TagsArr;
    }

    await p.save();
    res.json(p);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const DeleteAccount = async (req, res) => {
  try {
    await Promise.all([
      Profile.findOneAndDelete({ user: req.uid }),
      Posts.deleteMany({ user: req.uid }),
      User.findByIdAndDelete(req.uid),
    ]);
    res.json({ mess: "user has been deleted" });
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const ChangeAvatar = async (req, res) => {
  try {
    if (!req.files) return res.json({ msg: "the avatar is requierd!" });

    const { avatar } = req.files;
    const avatarEXT = path.extname(avatar.name).toLowerCase();

    const ExtAlowed = [".png", ".jpg", ".jpeg"].includes(avatarEXT);

    if (!ExtAlowed) return res.json({ msg: "PNG,JPG,JPEG are only allowed!" });

    const u = await User.findById(req.uid).select("-password");

    const OLDAvatarname = u.avatar.split("/").pop();

    const name = uuidv4() + avatarEXT;

    const FilePath = path.join(__dirname + "/../public", "avatars/") + name;

    const ImgURL = `http://localhost:5000/avatar/${name}`;

    avatar.mv(FilePath, async (err) => {
      try {
        if (err) return res.json({ msg: err });

        u.avatar = ImgURL;
        await u.save();

        //delete old avatar file
        const oldPath =
          path.join(__dirname + "/../public", "avatars/") + OLDAvatarname;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        res.json(u);
      } catch (err) {
        console.log(err);
        res.json({ msg: "server error" });
      }
    });
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
  ChangeAvatar,
};
