const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

var NotificationSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    notifType: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        required: true
    },

    lu: {
        type: Boolean,
        default: false,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }


});


module.exports = NotificationSchema
