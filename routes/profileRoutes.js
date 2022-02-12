const express = require("express");
const Auth = require("../middleware/Auth");
const {
  getProfiles,
  getMyProfile,
  Create_Update_Profile,
  getProfileByID,
  DeleteAccount,
  AddTags,
} = require("../controllers/ProfileControler");
const {
  Create_Update_Vali,
  AddTagVali,
} = require("../validation/ProfileValidation");

const router = express.Router();

router.get("/", getProfiles);
router.get("/me", Auth, getMyProfile);
router.get("/:id", getProfileByID);
router.post("/", [Auth, Create_Update_Vali], Create_Update_Profile);
router.delete("/", Auth, DeleteAccount);
router.put("/tags", [Auth, AddTagVali], AddTags);

module.exports = router;
