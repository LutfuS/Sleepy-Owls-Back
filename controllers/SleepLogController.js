const SleepLogService = require('../services/SleepLogService')
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

// La fonction permet d'ajouter un sleepLog
module.exports.createOneSleepLog = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un sleepLog")
    SleepLogService.createOneSleepLog(req.body, null, function (err, value) {
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

// La fonction permet d'ajouter plusieurs records
module.exports.createManySleepLogs = function (req, res) {
    req.log.info("Création de plusieurs sleepLogs")
    SleepLogService.createManySleepLogs(req.body, null, function (err, value) {
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

// La fonction permet de chercher un sleepLogs
module.exports.findOneSleepLog = function (req, res) {
    req.log.info("Recherche d'un sleepLog avec un champ choisi")
    let fields = req.query.fields
    if (fields && !Array.isArray(fields))
        fields = [fields]
    var opts = { populate: req.query.populate }
    SleepLogService.findOneSleepLog(fields, req.query.value, opts, function (err, value) {
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

// La fonction permet de chercher un sleeplog avec id
module.exports.findOneSleepLogById = function (req, res) {
    req.log.info("Recherche d'un sleepLog avec id")
    var opts = { populate: req.query.populate }
    SleepLogService.findOneSleepLogById(req.params.id, opts, function (err, value) {
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

// La fonction permet de chercher plusieurs sleepLogs
module.exports.findManySleepLogs = function (req, res) {
    req.log.info("Recherche de sleepLOgs avec un champ choisi")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    var opts = { populate: req.query.populate }
    SleepLogService.findManySleepLogsById(searchValue, page, pageSize, opts, function (err, value) {

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

// La fonction permet de chercher plusieurs sleeplogs
module.exports.findManySleepLogsById = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs sleepLogs", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var opts = { populate: req.query.populate }
    SleepLogService.findManySleepLogsById(arg, opts, function (err, value) {
        console.log(err, value)
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
// La fonction permet de modifier un sleepLog
module.exports.updateOneSleepLog = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un sleepLog")
    SleepLogService.updateOneSleepLog(req.params.id, req.body, null, function (err, value) {
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

// La fonction permet de modifier plusieurs sleepLogs
module.exports.updateManySleepLogs = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs sleeplogs")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    SleepLogService.updateManySleepLogs(arg, updateData, null, function (err, value) {
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


// La fonction permet de supprimer un sleepLOg
module.exports.deleteOneSleepLog = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un sleepLog")
    SleepLogService.deleteOneSleepLog(req.params.id, null, function (err, value) {
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

// La fonction permet de supprimer plusieurs sleepLogs
module.exports.deleteManySleepLogs = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs sleepLogs")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    SleepLogService.deleteManySleepLogs(arg, null, function (err, value) {
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




