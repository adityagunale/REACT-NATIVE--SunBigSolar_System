const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    tele: {
        type: String,
        required: true,
        unique: true,
        // match: [/^\+\d{10,15}$/, 'Please use a valid phone number with country code.']
    },
    password: {
        type: String,
        required: true,
    },
    resetCode: {
        type: String,
        default: null
    },
    resetCodeExpiry: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    roles: {
        type: [String],
        default: ['user']
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
