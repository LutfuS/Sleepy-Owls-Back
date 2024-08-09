const mongoose = require("mongoose");

module.exports.CheckConnexion = function (req, res, next) {
    req.log.info("Verification de la connection base de donnée")
    if (mongoose.connection.readyState == 1) {
        next();
    } else {
        req.log.error()
        res.statusCode = 500;
        res.send({ msg: `La base de donnée est en erreur ${mongoose.connection.readyState}`, type_error: "error-connection-db" })
    }
};
