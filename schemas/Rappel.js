const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

var RappelSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },

    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    frequence: {
        type: Number,
        default: false
    },
    statut: {
        type: String,
        required: true
    },
    notifType: {
        type: String,
        required: true
    }
}


);


module.exports = RappelSchema


