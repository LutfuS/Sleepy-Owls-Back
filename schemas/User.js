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
    token: [{
        authToken: {
            type: String,
            required: true
        }
    }],

},

);

module.exports = UserSchema;
