const Post = require("../models/Post");
const { validationResult } = require("express-validator");

const CreatePost = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors.array()[0]);
    }

    const { content } = req.body;

    const p = await Post.create({
      content,
      user: req.uid,
    });

    res.json(p);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const p = await Post.find().sort({ date: -1 });
    res.json(p);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const getPostsByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const p = await Post.find({ user: uid }).sort({ date: -1 });
    res.json(p);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const getPostByid = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Post.findById(id);

    if (!p) return res.json({ msg: "no post found with this id!" });
    res.json(p);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const DeletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Post.findById(id);

    if (!p) return res.json({ msg: "no post found with this id!" });

    if (p.user.toString() !== req.uid)
      return res.json({ msg: "not authorized" });

    const deleted = await Post.findByIdAndDelete(id);
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const LikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Post.findById(id);
    if (!p) return res.json({ msg: "no post found with this id!" });

    const isLiked =
      p.likes.findIndex((uid) => uid.toString() === req.uid) !== -1;

    if (isLiked) return res.json({ msg: "you already liked this post!" });

    p.likes.push(req.uid);
    await p.save();
    res.json({ msg: "liked!" });
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Post.findById(id);
    if (!p) return res.json({ msg: "no post found with this id!" });

    const isLiked =
      p.likes.findIndex((uid) => uid.toString() === req.uid) !== -1;

    if (!isLiked) return res.json({ msg: "you haven't liked this post!" });

    const ArrAfterUnlike = p.likes.filter((uid) => uid.toString() !== req.uid);
    p.likes = ArrAfterUnlike;

    await p.save();
    res.json({ msg: "unliked!" });
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const CommentOnPost = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors.array()[0]);
    }

    const { id } = req.params;
    const { comment } = req.body;

    const p = await Post.findById(id);
    if (!p) return res.json({ msg: "no post found with this id!" });

    p.comments.push({ comment, user: req.uid });
    await p.save();
    res.json(p.comments);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

const DeleteComment = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const p = await Post.findById(pid);
    if (!p) return res.json({ msg: "no post found with this id!" });

    const cindex = p.comments.findIndex(
      (comment) => comment._id.toString() === cid
    );

    if (cindex === -1)
      return res.json({ msg: "no comment found with this id!" });

    const isAuthorized = p.comments[cindex].user.toString() === req.uid;

    if (!isAuthorized) return res.json({ msg: "not authorized" });

    p.comments.splice(cindex, 1);
    await p.save();

    res.json(p.comments);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

module.exports = {
  CreatePost,
  getAllPosts,
  getPostsByUid,
  getPostByid,
  DeletePost,
  LikePost,
  unlikePost,
  CommentOnPost,
  DeleteComment,
};
