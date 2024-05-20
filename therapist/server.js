const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/connectDB");
const { config } = require("./config/settings");
const port = config.port;

// Database connection
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/uploads"));

// mount points
app.use("/therapist/auth", require("./routes/authRoutes"));
app.use("/therapist", require("./routes/therapistRoutes"));

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.cyan.italic.bold)
);
