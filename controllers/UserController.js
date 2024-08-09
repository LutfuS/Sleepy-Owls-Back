const UserService = require("../services/UserService");
const LoggerHttp = require('../utils/logger').http
const passport = require('passport')

//La fonction pour gerer l'authentification depuis passport
module.exports.loginUser = function (req, res, next) {
    passport.authenticate('login', { badRequestMessage: "Les champs sont manquants." }, async function (err, user) {

        if (err) {
            res.statusCode = 401
            return res.send({ msg: "Le nom d'utilisateur ou le mot de passe n'est pas correct", type_error: "no-valid-login" })
        }
        req.logIn(user, async function (err) {
            if (err) {
                res.statusCode = 500
                return res.send({ msg: "Probleme d'authentification sur le serveur.", type_error: "internal" })
            } else {
                return res.send(user)
            }
        })
    })(req, res, next)
}


//La fonction permet d'ajouter un user
module.exports.AddOneUser = function (req, res) {

    req.log.info("Création d'un utilisateur");
    UserService.addOneUser(req.body, null, function (err, value) {
        if (err && err.type_error === "no-found") {
            res.statusCode = 404;
            res.send(err);
        } else if (err && err.type_error === "validator") {
            res.statusCode = 405;
            res.send(err);

        } else if (err && err.type_error === "duplicate") {
            res.statusCode = 405;
            res.send(err);

        }
        else {
            res.statusCode = 201;
            res.send(value);
        }
    });
};

// La fonction permet d'ajouter beaucoup d'user
module.exports.AddManydUser = function (req, res) {

    req.log.info("Création de plusieurs utilisateurs");
    UserService.addManyUsers(req.body, null, function (err, value) {
        if (err) {
            res.statusCode = 405;
            res.send(err);
        } else {
            res.statusCode = 201;
            res.send(value);
        }
    });
};

module.exports.findOneUser = function (req, res) {
    req.log.info("Chercher un utilisateur")
    var fields = req.query.fields;
    if (fields && !Array.isArray(fields))
        fields = [fields];
    UserService.findOneUser(fields, req.query.value, null, function (err, value) {
        if (err && err.type_error === "no-found") {
            res.statusCode = 404;
            res.send(err);
        } else if (err && err.type_error === "error-mongo") {
            res.statusCode = 500;
            res.send(err);
        } else if (err && err.type_error === "no-valid") {
            res.statusCode = 405;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(value);
        }
    })
}

//La fonction permet de trouver un utilisateur
module.exports.findOneUserById = function (req, res) {

    req.log.info("Trouver un utilisateur");
    UserService.findOneUserById(req.params.id, null, function (err, value) {
        if (err && err.type_error === "no-found") {
            res.statusCode = 404;
            res.send(err);
        } else if (err && err.type_error === "error-mongo") {
            res.statusCode = 500;
            res.send(err);
        } else if (err && err.type_error === "no-valid") {
            res.statusCode = 405;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(value);
        }
    });
};
//La fonction permet de trouver plusieurs user
// La fonction permet de chercher plusieurs utilisateurs
module.exports.findManyUsers = function (req, res) {
    req.log.info("Recherche de plusieurs utilisateurs")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    UserService.findManyUsers(searchValue, pageSize, page, null, function (err, value) {
        if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}


// La fonction permet de mettre à jour un utilisateur
module.exports.UpdateOneUser = function (req, res) {

    req.log.info("Modification d'un utilisateur");
    UserService.updateOneUser(req.params.id, req.body, null, function (err, value) {
        if (err && err.type_error === "no-found") {
            res.status(404).send(err);
        } else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error === "duplicate")) {
            res.status(405).send(err);
        } else if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(value);
        }
    });
};
// La fonction permet de mettre à jour plusieurs utilisateurs
module.exports.UpdateManyUser = function (req, res) {

    req.log.info("Modification de plusieurs utilisateurs");
    var arg = req.query.id;
    if (arg && !Array.isArray(arg)) arg = [arg];
    var updateData = req.body;
    UserService.updateManyUsers(arg, updateData, null, function (err, value) {
        if (err && err.type_error === "no-found") {
            res.status(404).send(err);
        } else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error === "duplicate")) {
            res.status(405).send(err);
        } else if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(value);
        }
    });
};

//La fonction permet de supprimer un user
module.exports.DeleteOneUser = function (req, res) {

    req.log.info("Suppression d'un utilisateur");
    UserService.deleteOneUser(req.params.id, null, function (err, value) {
        if (err && err.type_error === "no-found") {
            res.statusCode = 404;
            res.send(err);
        } else if (err && err.type_error === "error-mongo") {
            res.statusCode = 500;
            res.send(err);
        } else if (err && err.type_error === "no-valid") {
            res.statusCode = 405;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(value);
        }
    });
};

//La fonction permet de supprimer plusieurs utilisateurs
module.exports.deleteManyUsers = function (req, res) {

    req.log.info("Suppression de plusieurs utilisateurs");
    var arg = req.query.id;
    if (arg && !Array.isArray(arg))
        arg = [arg];

    UserService.deleteManyUsers(req.query.id, null, function (err, value) {
        console.log(err)
        if (err && err.type_error === "no-found") {
            res.statusCode = 404;
            res.send(err);
        } else if (err && err.type_error === "error-mongo") {
            res.statusCode = 500;
            res.send(err);
        } else if (err && err.type_error === "no-valid") {
            res.statusCode = 405;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(value);
        }
    });
};


//La fonction pour gerer la deconnexion
module.exports.logoutUser = function (req, res, next) {
    req.log.info("Déconnexion d un utilisateur")
    UserService.updateOneUser(req.user._id, { token: "" }, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "duplicate") {
            res.statusCode = 405
            res.send(err)
        }
        else {
            res.statusCode = 201
            res.send({ message: "L'utilisateur est déconnecté." })
        }
    })(req, res, next)
}
