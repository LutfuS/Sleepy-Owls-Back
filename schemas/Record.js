const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
var RecordSchema = mongoose.Schema({
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
        required: true,

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
    token: {
        type: String,
        required: false
    }

},

);

module.exports = RecordSchema


