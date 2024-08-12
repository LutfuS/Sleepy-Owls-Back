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

    token: {
        type: String,
        required: false
    }

},

);

module.exports = UserSchema;

//     personnel: {
//         compte: {
//             type: String,
//             unique: true,
//             required: false,
//         },
//         consentement: {
//             type: Boolean,
//             default: false
//         }
//     },
//     alarme: {
//         vibration: {
//             type: Boolean,
//             default: true
//         },
// conseil: {
//     image: {
//       type: String,
//       match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/  // Valide une URL d'image
//     },
//     texte: {
//       type: String,
//
//     }
//   }