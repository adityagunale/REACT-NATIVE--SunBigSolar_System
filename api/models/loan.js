const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    solarSystemSize: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    annualincome: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo',
        required: true
    },
    files: [{
        filename: String,
        originalName: String,
        fileType: {
            type: String,
            enum: ['image', 'pdf']
        },
        documentType: {
            type: String,
            enum: [
                'Pancard',
                'Aadhar',
                'income',
                'itr',
            ]
        },
        mimeType: String,
        url: String,
        path: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
