const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Therapist = require("../models/therapistModel");
const { config } = require("../config/settings");

class AuthService {
  // Register service
  async registerTherapist(username, email, password) {
    if (!username || !email || !password) {
      throw new Error("Please add all fields");
    }

    const userExists = await Therapist.findOne({ email });
    if (userExists) {
      throw new Error("Therapist already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const therapist = await new Therapist({
      username,
      email,
      password: hashedPassword,
    }).save();

    if (therapist) {
      return {
        _id: therapist.id,
        email: therapist.email,
        token: this.generateToken(therapist._id),
      };
    } else {
      throw new Error("Invalid therapist data");
    }
  }

  // Login service
  async loginTherapist(email, password) {
    const therapist = await Therapist.findOne({ email });

    if (!therapist) {
      throw new Error("Invalid credentials");
    }

    const passwordMatched = bcrypt.compare(password, therapist.password);

    if (passwordMatched) {
      return {
        _id: therapist.id,
        name: therapist.username,
        email: therapist.email,
        isLoggedIn: true,
        onboarded: therapist.onboarded,
        token: this.generateToken(therapist._id),
      };
    } else {
      throw new Error("Invalid credentials");
    }
  }

  // Get Therapist info service
  async getTherapist(id) {
    const therapist = await Therapist.findById(id);

    if (!therapist) {
      throw new Error("Invalid credentials");
    }
    return {
      _id: therapist.id,
      name: therapist.username,
      email: therapist.email,
      isLoggedIn: true,
      onboarded: therapist.onboarded,
      token: this.generateToken(therapist._id),
    };
  }

  // Save onboarding responses
  async saveProfile(
    therapistId,
    name,
    about,
    speciality,
    location,
    totalPatients,
    experience,
    hourlyRate
  ) {
    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      throw new Error("Therapist not found");
    }

    therapist.name = name;
    therapist.about = about;
    therapist.specialty = speciality;
    therapist.hourlyRate = hourlyRate;
    therapist.totalPatients = totalPatients;
    therapist.experience = experience;
    therapist.location = location;
    therapist.onboarded = true;

    await therapist.save();

    return {
      _id: therapist.id,
      name: therapist.name,
      email: therapist.email,
      isLoggedIn: true,
      onboarded: therapist.onboarded,
      token: this.generateToken(therapist._id),
    };
  }

  generateToken(id) {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: "30d" });
  }

  //   sendEmail(therapist, otp) {
  //     var transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //         therapist: "devaneees@gmail.com",
  //         pass: "brde gskv yihl cfot",
  //       },
  //     });

  //     var mailOptions = {
  //       from: "devaneees@gmail.com",
  //       to: therapist.email,
  //       subject: "Be Well OTP Verification",
  //       html: `
  //         <p>Hello ${therapist.fullName},</p>
  //         <p>Your OTP is: <strong>${otp}</strong></p>
  //       `,
  //     };

  //     transporter.sendMail(mailOptions, function (error, info) {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log("Email sent: " + info.response);
  //       }
  //     });
  //   }
}

module.exports = new AuthService();
