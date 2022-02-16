const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(errors.array()[0]);
  }

  try {
    const { name, password, email } = req.body;
    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({ msg: "e-mail is already used!" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const u = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign({ uid: u.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const Login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(errors.array()[0]);
  }
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });

    if (!u) {
      return res.json({ msg: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, u.password);

    if (!isMatch) {
      return res.json({ msg: "invalid credentials" });
    }

    const token = jwt.sign({ uid: u.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    res.json({ token });
  } catch (error) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const getAuth = async (req, res) => {
  try {
    const u = await User.findById(req.uid).select("-password");

    if (!u) {
      return res.json({ msg: "invalid credentials" });
    }

    res.json(u);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const u = await User.find().select("-password");
    res.json(u);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

module.exports = { register, Login, getAuth, getUsers };
