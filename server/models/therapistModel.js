const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const therapistSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a strong password"],
  },
  about: {
    type: String,
  },
  specialty: {
    type: String,
  },
  location: {
    type: String,
  },
  totalPatients: {
    type: Number,
    default: 0,
  },
  experience: {
    type: Number,
  },
  hourlyRate: {
    type: Number,
  },
  onboarded: {
    type: Boolean,
    default: false,
  },
  cardNumber: String,
  stripeId: String,
  reviews: [{
      reviewerName: {
          type: String,
      },
      rating: {
          type: Number,
      },
      comment: {
          type: String,
      }
  }]
});

// Create Therapist model
const Therapist = mongoose.model("Therapist", therapistSchema);

module.exports = Therapist;
