const mongoose = require('mongoose');

const studentschema = new mongoose.Schema({
    avatar: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    membership: {
        type: String,
        enum: ['Explorer', 'Achiever', 'Scholar'],
        default: 'Explorer',
        required: true
    },
    membershipDetails: {
        startDate: Date,
        endDate: Date,
        paymentId: String,
        orderId: String,
        amount: Number,
        status: {
            type: String,
            enum: ['active', 'expired', 'pending'],
            default: 'pending'
        }
    },
    usage: {
        summarizedVideos: {
            type: Number,
            default: 0
        },
        quizzesTaken: {
            type: Number,
            default: 0
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    password: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false,
        default: null
    },
}, { timestamps: true });
// Index for faster queries
studentschema.index({ "membershipDetails.endDate": -1 });
// Index for faster queries
studentschema.index({ "usage.lastActive": -1 });

const student = mongoose.model('student', studentschema);


module.exports = student;
