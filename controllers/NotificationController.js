const NotificationService = require('../services/NotificationService')
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

// La fonction permet d'ajouter un notification
module.exports.createOneNotification = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un notification")
    NotificationService.createOneNotification(req.body, null, function (err, value) {
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

// La fonction permet d'ajouter plusieurs notifications
module.exports.createManyNotifications = function (req, res) {
    req.log.info("Création de plusieurs notifications")
    NotificationService.createManyNotifications(req.body, null, function (err, value) {
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

// La fonction permet de chercher un notification
module.exports.findOneNotification = function (req, res) {
    req.log.info("Recherche d'un notification avec un champ choisi")
    let fields = req.query.fields
    if (fields && !Array.isArray(fields))
        fields = [fields]
    var opts = { populate: req.query.populate }
    NotificationService.findOneNotification(fields, req.query.value, opts, function (err, value) {
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

// La fonction permet de chercher un notification avec id
module.exports.findOneNotificationById = function (req, res) {
    req.log.info("Recherche d'un notification avec id")
    var opts = { populate: req.query.populate }
    NotificationService.findOneNotificationById(req.params.id, opts, function (err, value) {
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

// La fonction permet de chercher plusieurs notifications
module.exports.findManyNotifications = function (req, res) {
    req.log.info("Recherche d'un notification avec un champ choisi")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    var opts = { populate: req.query.populate }
    NotificationService.findManyNotifications(searchValue, page, pageSize, opts, function (err, value) {

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

// La fonction permet de chercher plusieurs notifications
module.exports.findManyNotificationsById = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs notifications", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var opts = { populate: req.query.populate }
    NotificationService.findManyNotificationsById(arg, opts, function (err, value) {

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
// La fonction permet de modifier un notification
module.exports.updateOneNotification = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un notification")
    NotificationService.updateOneNotification(req.params.id, req.body, null, function (err, value) {
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

// La fonction permet de modifier plusieurs notifications
module.exports.updateManyNotifications = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs notifications")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    NotificationService.updateManyNotifications(arg, updateData, null, function (err, value) {
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


// La fonction permet de supprimer un notification
module.exports.deleteOneNotification = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un notification")
    NotificationService.deleteOneNotification(req.params.id, null, function (err, value) {
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

// La fonction permet de supprimer plusieurs notifications
module.exports.deleteManyNotifications = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs notifications")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    NotificationService.deleteManyNotifications(arg, null, function (err, value) {
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

