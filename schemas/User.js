const mongoose = require("mongoose");

var UserSchema = mongoose.Schema({

    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    personnel_consentement: {


        type: Boolean,
        default: false

    },
    alarme_vibration: {

        type: Boolean,
        default: false

    },
    alarme_microphone: {
        type: Boolean,
        default: false

    },


    conseil_statut: {


        type: Boolean,
        default: false

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

})



module.exports = UserSchema;

