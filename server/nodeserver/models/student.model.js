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
        enum: ['Explorer', 'Scholar', 'Achiever'],
        default: 'Explorer',
        required: true
    },
    membershipDetails: {
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            default: function() {
                const date = new Date();
                date.setDate(date.getDate() + 30); // Default 30 days
                return date;
            }
        },
        paymentId: String,
        orderId: String,
        transactionId: String,
        amount: Number,
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'active'
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
        },
        ytSummary: {
            type: Number,
            default: 0
        },
        quiz: {
            type: Number,
            default: 0
        },
        chatbot: {
            type: Number,
            default: 0
        },
        mindmap: {
            type: Number,
            default: 0
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
