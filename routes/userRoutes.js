const express = require("express");
const { register, Login, getAuth } = require("../controllers/userControler");
const { registerVali, loginVali } = require("../validation/userValidation");
const Auth = require("../middleware/Auth");

const router = express.Router();

router.post("/register", registerVali, register);
router.post("/login", loginVali, Login);
router.get("/", Auth, getAuth);

module.exports = router;
