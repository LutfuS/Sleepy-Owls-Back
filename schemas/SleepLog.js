const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
var SleepLogsSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    logDate: {
        type: Date,
        default: new Date()

    },
    note: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }, token: [{
        authToken: {
            type: String,
            required: true
        }
    }],



},

);

module.exports = SleepLogsSchema