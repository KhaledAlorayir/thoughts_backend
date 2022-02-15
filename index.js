const express = require("express");
const helemt = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server is running"));
mongoose.connect(process.env.DB_CONN, () => console.log("db is running"));

app.use(helemt());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Thoughts API");
});

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
