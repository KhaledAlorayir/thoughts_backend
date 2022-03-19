const express = require("express");
const helemt = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server is running"));
mongoose.connect(process.env.DB_CONN, () => console.log("db is running"));

app.use(helemt({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(
  fileupload({
    limits: { fileSize: 2 * 1024 * 1024 },
    abortOnLimit: true,
  })
);
app.use("/avatar", express.static("public/avatars"));

app.get("/", (req, res) => {
  res.send("Thoughts API");
});

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
