const mongoose = require("mongoose");
const colors = require("colors");
const { config } = require("./settings");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    const defaultAdmin = await Admin.findOne({ email: "admin@gmail.com" });

    if (!defaultAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.password, salt);

      const newAdmin = new Admin({
        email: "admin@gmail.com",
        password: hashedPassword,
      });

      await newAdmin.save();
      console.log(`Default admin created successfully!`.green);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
