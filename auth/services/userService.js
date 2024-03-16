const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const nodemailer = require("nodemailer");
const { config } = require("../config/settings");

class UserService {

  // Register service
  async registerUser(username, name, email, password) {
    if (!username || !name || !email || !password) {
      throw new Error("Please add all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new User({
      username,
      name,
      email,
      password: hashedPassword,
    }).save();

    if (user) {
      return {
        _id: user.id,
        name: user.name,
        email: user.email,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error("Invalid user data");
    }
  }

  // Login service
  async loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatched = bcrypt.compare(password, user.password);

    if (passwordMatched) {
      return {
        _id: user.id,
        name: user.name,
        email: user.email,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error("Invalid credentials");
    }
  }

  // Forgot password service
  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found!");
    }

    const otp = await this.generateOTP(user);
    this.sendEmail(user, otp);

    return {
      _id: user.id,
      otp: otp,
      email: user.email,
      token: this.generateToken(user._id),
    };
  }

  // Reset password service
  async resetPassword(id, token, password) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.findByIdAndUpdate(
        decoded.id,
        {
          password: hash,
        },
        { new: true }
      );

      return {
        _id: user.id,
        isUpdated: true,
      };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

    // FGet User info service
    async getUser(id) {
      const user = await User.findById(id);
  
      if (!user) {
        throw new Error("Invalid credentials");
      }
      return {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        isLoggedIn: true,
        isMember: user.isMember,
        token: this.generateToken(user._id),
      };
    }

      // Generate OTP service
  async generateOTP(user) {
    // Generate a random 4-digit OTP
    const otpValue = Math.floor(1000 + Math.random() * 9000);

    // Save OTP to the database
    const otp = await new OTP({
      userId: user._id,
      otp: otpValue,
      createdAt: new Date(),
    }).save();

    return otpValue;
  }

  generateToken(id) {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: "30d" });
  }

  sendEmail(user, otp) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devaneees@gmail.com",
        pass: "eubi nkkv evpt ebxa",
      },
    });

    var mailOptions = {
      from: "devaneees@gmail.com",
      to: user.email,
      subject: "Porkbuns OTP Verification",
      html: `
        <p>Hello ${user.fullName},</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

module.exports = new UserService();
