const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
var SettingsSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,

    },
    read: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: new Date()
    },



},

);

module.exports = SettingsSchema