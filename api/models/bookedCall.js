// models/bookedCall.js
const mongoose = require('mongoose');

const bookedCallSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    landmark: String,
    solarSystemSize: String,
    scheduleDate: Date
});

module.exports = mongoose.model('BookedCall', bookedCallSchema);
