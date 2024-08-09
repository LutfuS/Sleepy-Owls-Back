const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
var SettingsSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    NomParamètre: {
        type: String,
        required: true,

    },
    ValeurParamètre: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,

    },



},

);

module.exports = SettingsSchema