const mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
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
    token: [{
        authToken: {
            type: String,
            required: true
        }
    }],
    phone: String,
},

);

module.exports = UserSchema;
