const RecordService = require('../services/RecordService')
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

// La fonction permet d'ajouter un record
module.exports.createOneRecord = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un record")
    RecordService.createOneRecord(req.body, null, function (err, value) {
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
module.exports.createManyRecords = function (req, res) {
    req.log.info("Création de plusieurs records")
    RecordService.createManyRecords(req.body, null, function (err, value) {
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

// La fonction permet de chercher un record
module.exports.findOneRecord = function (req, res) {
    req.log.info("Recherche d'un record avec un champ choisi")
    let fields = req.query.fields
    if (fields && !Array.isArray(fields))
        fields = [fields]
    var opts = { populate: req.query.populate }
    RecordService.findOneRecord(fields, req.query.value, opts, function (err, value) {
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

// La fonction permet de chercher un record avec id
module.exports.findOneRecordById = function (req, res) {
    req.log.info("Recherche d'un record avec id")
    var opts = { populate: req.query.populate }
    RecordService.findOneRecordById(req.params.id, opts, function (err, value) {
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

// La fonction permet de chercher plusieurs records
module.exports.findManyRecords = function (req, res) {
    req.log.info("Recherche d'un record avec un champ choisi")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    var opts = { populate: req.query.populate }
    RecordService.findManyRecords(searchValue, page, pageSize, opts, function (err, value) {

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

// La fonction permet de chercher plusieurs records
module.exports.findManyRecordsById = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs records", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var opts = { populate: req.query.populate }
    RecordService.findManyRecordsById(arg, opts, function (err, value) {
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
// La fonction permet de modifier un record
module.exports.updateOneRecord = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un record")
    RecordService.updateOneRecord(req.params.id, req.body, null, function (err, value) {
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

// La fonction permet de modifier plusieurs records
module.exports.updateManyRecords = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs records")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    RecordService.updateManyRecords(arg, updateData, null, function (err, value) {
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


// La fonction permet de supprimer un record
module.exports.deleteOneRecord = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un record")
    RecordService.deleteOneRecord(req.params.id, null, function (err, value) {
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

// La fonction permet de supprimer plusieurs records
module.exports.deleteManyRecords = function (req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs records")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    RecordService.deleteManyRecords(arg, null, function (err, value) {
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




