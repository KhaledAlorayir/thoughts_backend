const { check } = require("express-validator");

const registerVali = [
  check("name", "name is required").notEmpty({ ignore_whitespace: true }),
  check("name", "name is too long").isLength({ max: 30 }),
  check("email", "email should be valid").isEmail(),
  check(["password", "repassword"], ["password is required"]).notEmpty({
    ignore_whitespace: true,
  }),
  check("repassword", "passwords should match").custom(
    (v, { req }) => v === req.body.password
  ),
];

const loginVali = [
  check("email", "email should be valid").isEmail(),
  check("password", "password is required").notEmpty({
    ignore_whitespace: true,
  }),
];

module.exports = { registerVali, loginVali };
