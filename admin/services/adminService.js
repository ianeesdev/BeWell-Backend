const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const { config } = require("../config/settings");

class AdminService {
  // Login service
  async loginAdmin(email, password) {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const passwordMatched = await bcrypt.compare(password, admin.password);

    if (passwordMatched) {
      return {
        email: admin.email,
        isLoggedIn: true,
        token: this.generateToken(admin._id),
      };
    } else {
      throw new Error("Invalid credentials");
    }
  }

  generateToken(id) {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: "30d" });
  }
}

module.exports = new AdminService();
