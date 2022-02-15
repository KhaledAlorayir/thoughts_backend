const express = require("express");
const Auth = require("../middleware/Auth");
const {
  CreatePost,
  getAllPosts,
  getPostsByUid,
  getPostByid,
  DeletePost,
  LikePost,
  unlikePost,
  CommentOnPost,
} = require("../controllers/PostController");
const { CreatePostVali, CommentVali } = require("../validation/PostValidation");

const router = express.Router();

router.post("/", [Auth, CreatePostVali], CreatePost);
router.get("/", getAllPosts);
router.get("/:id", getPostByid);
router.get("/user/:uid", getPostsByUid);
router.delete("/:id", Auth, DeletePost);
router.post("/like/:id", Auth, LikePost);
router.post("/unlike/:id", Auth, unlikePost);
router.post("/comment/:id", [Auth, CommentVali], CommentOnPost);

module.exports = router;
