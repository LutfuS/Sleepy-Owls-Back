const mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
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
    personnel: {
        compte: {
            type: String,
            unique: true,
            required: true,
        },
        consentement: {
            type: Boolean,
            default: false
        }
    },
    alarme: {
        vibration: {
            type: Boolean,
            default: false
        }
    },

    conseil: {
        image: {
            type: String,
            match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/
        },
        texte: {
            type: String,

        },
        statut: {
            type: Boolean,
            default: false
        }
    },

    token: {
        type: String,
        required: false
    }

})



module.exports = UserSchema;

