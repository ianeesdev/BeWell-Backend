const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const therapistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    totalPatients: {
        type: Number,
        default: 0
    },
    experience: {
        type: Number,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    // reviews: [{
    //     reviewerName: {
    //         type: String,
    //     },
    //     rating: {
    //         type: Number,
    //     },
    //     comment: {
    //         type: String,
    //     }
    // }]
});

// Create Therapist model
const Therapist = mongoose.model('Therapist', therapistSchema);

module.exports = Therapist;
