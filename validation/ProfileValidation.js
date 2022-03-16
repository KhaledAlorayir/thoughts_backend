const { check } = require("express-validator");

const Create_Update_Vali = [
  check("bio", "the bio max is 160 characters").isLength({ max: 160 }),
  check("location", "the location max is 35 characters").isLength({ max: 35 }),
];

const AddTagVali = [
  check("tags", "maximum of 5 tags").custom((v) => v.split(",").length <= 5),
  check("tags", "tags are too long").isLength({ max: 40 }),
];

module.exports = { Create_Update_Vali, AddTagVali };
