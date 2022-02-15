const { check } = require("express-validator");

const CreatePostVali = [
  check("content", "post is empty!").notEmpty({ ignore_whitespace: true }),
  check("content", "post is 400 characters max").isLength({ max: 400 }),
];

const CommentVali = [
  check("comment", "comment is empty!").notEmpty({ ignore_whitespace: true }),
  check("comment", "comment is 180 characters max").isLength({ max: 180 }),
];

module.exports = { CreatePostVali, CommentVali };
