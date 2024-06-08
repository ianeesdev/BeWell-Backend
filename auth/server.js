const express = require("express");
const dotenv = require("dotenv").config();
const session = require("express-session");
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
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: config.jwtSecret,
  })
);

// mount points
app.use("/auth", require("./routes/userRoutes"));

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.cyan.italic.bold)
);
