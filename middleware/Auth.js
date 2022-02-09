const { verify } = require("jsonwebtoken");

const Auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res.json({ msg: "you must be logged in" });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    //console.log(err);
    res.json({ msg: "invalid token" });
  }
};

module.exports = Auth;
