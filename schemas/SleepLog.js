const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
var SleepLogSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    sleepStart: {
        type: Date,
        required: true,

    },
    sleepEnd: {
        type: Date,
        required: true,
    },
    sleepDuration: {
        type: Date,
        default: false,

    },

    sleepQuality: {
        type: String,
        required: true,

    },
    sleepSound: {
        type: String,
        required: true,

    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()

    },
    logDate: {
        type: Date,
        default: new Date()

    },
    note: {
        type: String,
        default: false,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },




},

);

module.exports = SleepLogSchema