const RappelService = require('../services/RappelService')
const LoggerHttp = require('../utils/logger').http

module.exports.generateData = function (req, res) {
    req.params.id
    req.log.info("Création de plusieurs utilisateurs");
    req.add(req.body, null, function (err, value) {
        if (err) {
            res.statusCode = 405;
            res.send(err);
        } else {
            res.statusCode = 201;
            res.send(value);
        }
    });
}

// La fonction permet d'ajouter un rappel
module.exports.createOneRappel = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un rappel")
    RappelService.createOneRappel(req.body, null, function (err, value) {
        if (err && err.type_error == "no found") {
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
            res.send(value)
        }
    })
}

// La fonction permet d'ajouter plusieurs rappels
module.exports.createManyRappels = function (req, res) {
    req.log.info("Création de plusieurs rappels")
    RappelService.createManyRappels(req.body, null, function (err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }

        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet de chercher un rappel
module.exports.findOneRappel = function (req, res) {
    req.log.info("Recherche d'un rappel avec un champ choisi")
    let fields = req.query.fields
    if (fields && !Array.isArray(fields))
        fields = [fields]
    var opts = { populate: req.query.populate }
    RappelService.findOneRappel(fields, req.query.value, opts, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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

// La fonction permet de chercher un rappel avec id
module.exports.findOneRappelById = function (req, res) {
    req.log.info("Recherche d'un rappel avec id")
    var opts = { populate: req.query.populate }
    RappelService.findOneRappelById(req.params.id, opts, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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

// La fonction permet de chercher plusieurs rappels
module.exports.findManyRappels = function (req, res) {
    req.log.info("Recherche d'un rappel avec un champ choisi")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    var opts = { populate: req.query.populate }
    RappelService.findManyRappels(searchValue, page, pageSize, opts, function (err, value) {

        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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

// La fonction permet de chercher plusieurs rappels
module.exports.findManyRappelsById = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs rappels", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var opts = { populate: req.query.populate }
    RappelService.findManyRappelsById(arg, opts, function (err, value) {

        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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
// La fonction permet de modifier un rappel
module.exports.updateOneRappel = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un rappel")
    RappelService.updateOneRappel(req.params.id, req.body, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == "duplicate")) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de modifier plusieurs rappels
module.exports.updateManyRappels = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs rappels")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    RappelService.updateManyRappels(arg, updateData, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == 'duplicate')) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}


// La fonction permet de supprimer un rappel
module.exports.deleteOneRappel = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un rappel")
    RappelService.deleteOneRappel(req.params.id, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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

// La fonction permet de supprimer plusieurs rappels
module.exports.deleteManyRappels = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs rappels")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    RappelService.deleteManyRappels(arg, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

