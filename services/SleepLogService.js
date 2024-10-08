const SleepLogSchema = require('../schemas/SleepLog')
const _ = require('lodash')
const async = require('async')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bcrypt = require('bcrypt')
const TokenUtils = require('./../utils/token')
const SALT_WORK8FACTOR = 10

var SleepLog = mongoose.model('SleepLog', SleepLogSchema)

SleepLog.createIndexes()


module.exports.createOneSleepLog = async function (sleepLog, options, callback) {

    try {
        var new_sleepLog = new SleepLog(sleepLog);
        var errors = new_sleepLog.validateSync();
        if (errors) {
            errors = errors['errors'];
            var text = Object.keys(errors).map((e) => {
                return errors[e]['properties']['message'];
            }).join(' ');
            var fields = _.transform(Object.keys(errors), function (result, value) {
                result[value] = errors[value]['properties']['message'];
            }, {});
            var err = {
                msg: text,
                fields_with_error: Object.keys(errors),
                fields: fields,
                type_error: "validator"
            };
            callback(err);
        } else {
            await new_sleepLog.save();
            callback(null, new_sleepLog.toObject());
        }
    } catch (error) {
        if (error.code === 11000) { // Erreur de duplicité
            var field = Object.keys(error.keyValue)[0];
            var err = {
                msg: `Duplicate key error: ${field} must be unique.`,
                fields_with_error: [field],
                fields: { [field]: `The ${field} is already taken.` },
                type_error: "duplicate"
            };
            callback(err);
        } else {
            callback(error); // Autres erreurs
        }
    }
};

module.exports.createManySleepLogs = async function (sleepLogs, options, callback) {
    var errors = [];

    // Vérifier les erreurs de validation
    for (var i = 0; i < sleepLogs.length; i++) {
        var sleepLog = sleepLogs[i];

        var new_sleepLog = new SleepLog(sleepLog);
        var error = new_sleepLog.validateSync();
        if (error) {
            error = error['errors'];
            var text = Object.keys(error).map((e) => {
                return error[e]['properties']['message'];
            }).join(' ');
            var fields = _.transform(Object.keys(error), function (result, value) {
                result[value] = error[value]['properties']['message'];
            }, {});
            errors.push({
                msg: text,
                fields_with_error: Object.keys(error),
                fields: fields,
                index: i,
                type_error: "validator"
            });
        }
    }
    if (errors.length > 0) {
        callback(errors);
    } else {
        try {
            // Tenter d'insérer les utilisateurs
            const data = await SleepLog.insertMany(sleepLogs, { ordered: false });
            callback(null, data);
        } catch (error) {
            if (error.code === 11000) { // Erreur de duplicité
                const duplicateErrors = error.writeErrors.map(err => {
                    //const field = Object.keys(err.keyValue)[0];
                    const field = err.err.errmsg.split(" dup key: { ")[1].split(':')[0].trim();
                    return {
                        msg: `Duplicate key error: ${field} must be unique.`,
                        fields_with_error: [field],
                        fields: { [field]: `The ${field} is already taken.` },
                        index: err.index,
                        type_error: "duplicate"
                    };
                });
                callback(duplicateErrors);
            } else {
                callback(error); // Autres erreurs
            }
        }
    }
};

module.exports.findOneSleepLog = function (tab_field, value, options, callback) {
    var field_unique = ["user_id", "sleepQuality"]
    if (tab_field && Array.isArray(tab_field) && value && _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1 }).length == 0) {
        var obj_find = []
        _.forEach(tab_field, (e) => {
            obj_find.push({ [e]: value })
        })
        SleepLog.findOne({ $or: obj_find }).then((value) => {
            if (value)
                callback(null, value.toObject())
            else {
                callback({ msg: "SleepLog non trouvé.", type_error: "no-found" })
            }
        }).catch((err) => {
            callback({ msg: "Error interne mongo", type_error: 'error-mongo' })
        })
    }
    else {
        let msg = ""
        if (!tab_field || !Array.isArray(tab_field)) {
            msg += "Les champs de recherche sont incorrecte."
        }
        if (!value) {
            msg += msg ? "Et la valeur de rechercher est vide." : "La valeur de rechercher est vide"
        }
        if (_.filter(tab_field, (e) => {
            return field_unique.indexOf(e) == -1
        }).length > 0) {
            var field_not_authorized = _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1 })
            msg += msg ? `Et (${field_not_authorized.join(',')})ne sont pas des champs de recherche autorisé` :
                `Les champs(${field_not_authorized.join(',')})ne sont pas des champs de recherche autorisé.`
            callback({ msg: msg, type_error: 'no-valid', field_not_authorized: field_not_authorized })
        }
        else
            callback({ msg: msg, type_error: 'no-valid' })
    }
}
module.exports.findManySleepLogs = function (search, page, limit, options, callback) {
    page = !page ? 1 : parseInt(page)
    limit = !limit ? 10 : parseInt(limit)
    var populate = options && options.populate ? ["user_id"] : []
    if (typeof page !== "number" || typeof limit !== "number" || isNaN(page) || isNaN(limit)) {
        callback({ msg: `format de ${typeof page !== "number" ? "page" : "limit"} est incorrect`, type_error: "no-valid" })
    } else {
        var query_mongo = search ? {
            $or: _.map(["sleepQuality"], (e) => { return { [e]: { $regex: search } } })
        } : {}
        SleepLog.countDocuments(query_mongo).then((value) => {
            if (value > 0) {
                const skip = ((page - 1) * limit)
                SleepLog.find(query_mongo, null, { skip: skip, limit: limit, populate: populate, lean: true }).then((results) => {
                    callback(null, {
                        count: value,
                        results: results
                    })
                })
            } else {
                callback(null, { count: 0, results: [] })
            }
        }).catch((e) => {
            callback(e)
        })
    }
}
module.exports.findOneSleepLogById = function (sleepLog_id, options, callback) {
    var opts = { populate: options && options.populate ? ["user_id"] : [] }
    if (sleepLog_id && mongoose.isValidObjectId(sleepLog_id)) {
        SleepLog.findById(sleepLog_id, null, opts).then((value) => {
            try {
                if (value) {
                    callback(null, value.toObject());
                } else {
                    callback({ msg: "Aucun sleepLog trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    } else {
        callback({ msg: "ObjectId non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findManySleepLogsById = function (sleepLogs_id, options, callback) {
    var opts = { populate: (options && options.populate ? ["user_id"] : []), lean: true }
    if (sleepLogs_id && Array.isArray(sleepLogs_id) && sleepLogs_id.length > 0 && sleepLogs_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == sleepLogs_id.length) {
        sleepLogs_id = sleepLogs_id.map((e) => { return new ObjectId(e) })
        SleepLog.find({ _id: sleepLogs_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun sleepLog trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (sleepLogs_id && Array.isArray(sleepLogs_id) && sleepLogs_id.length > 0 && sleepLogs_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != sleepLogs_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: sleepLogs_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (sleepLogs_id && !Array.isArray(sleepLogs_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findManySleepLogsById = function (sleepLogs_id, options, callback) {
    var opts = { populate: (options && options.populate ? ["user_id"] : []), lean: true }
    if (sleepLogs_id && Array.isArray(sleepLogs_id) && sleepLogs_id.length > 0 && sleepLogs_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == sleepLogs_id.length) {
        sleepLogs_id = sleepLogs_id.map((e) => { return new ObjectId(e) })
        SleepLog.find({ _id: sleepLogs_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun sleepLog trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (sleepLogs_id && Array.isArray(sleepLogs_id) && sleepLogs_id.length > 0 && sleepLogs_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != sleepLogs_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: sleepLogs_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (sleepLogs_id && !Array.isArray(sleepLogs_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.updateOneSleepLog = async function (sleepLog_id, update, options, callback) {
    if (sleepLog_id && mongoose.isValidObjectId(sleepLog_id)) {

        SleepLog.findByIdAndUpdate(new ObjectId(sleepLog_id), update, { returnDocument: 'after', runValidators: true }).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "SleepLog non trouvé.", type_error: "no-found" });

            } catch (e) {
                console.log(e)
                callback(e)
            }
        }).catch((errors) => {
            if (errors.code == 11000) {
                const field = Object.keys(errors.keyPattern)[0]
                const duplicateErrors = {
                    msg: `Duplicate key error: ${field}must be unique`,
                    fields_with_error: [field],
                    fields: { [field]: `The ${field}is already taken` },
                    type_error: "duplicate"
                }

                callback(duplicateErrors)
            } else {
                errors = errors['errors']
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}


module.exports.updateManySleepLogs = async function (sleepLogs_id, update, options, callback) {
    if (sleepLogs_id && Array.isArray(sleepLogs_id) && sleepLogs_id.length > 0 && sleepLogs_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == sleepLogs_id.length) {
        sleepLogs_id = sleepLogs_id.map((e) => { return new ObjectId(e) })


        SleepLog.updateMany({ _id: sleepLogs_id }, update, { runValidators: true }).then((value) => {
            try {
                if (value && value.matchedCount != 0) {
                    callback(null, value)
                } else {
                    callback({ msg: 'Utilisateurs non trouvé', type_error: 'no-found' })
                }
            } catch (e) {
                console.log(e)
                callback(e)
            }
        }).catch((errors) => {
            if (errors.code === 11000) {
                var field = Object.keys(errors.keyPattern)[0]
                const duplicateErrors = {
                    msg: `Duplicate key error: ${field}must be unique`,
                    fields_with_error: [field],
                    index: errors.index,
                    fields: { [field]: `The ${field}is already taken.` },
                    type_error: "duplicate"
                }
                callback(duplicateErrors)
            } else {
                errors = errors['errors']
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.deleteOneSleepLog = function (sleepLog_id, options, callback) {
    if (sleepLog_id && mongoose.isValidObjectId(sleepLog_id)) {
        SleepLog.findByIdAndDelete(sleepLog_id).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "SleepLog non trouvé.", type_error: "no-found" });
            }
            catch (e) {
                console.log(e)
                callback(e)
            }
        }).catch((e) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.deleteManySleepLogs = function (sleepLogs_id, options, callback) {
    if (sleepLogs_id && Array.isArray(sleepLogs_id) && sleepLogs_id.length > 0 && sleepLogs_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == sleepLogs_id.length) {
        sleepLogs_id = sleepLogs_id.map((e) => { return new ObjectId(e) })
        SleepLog.deleteMany({ _id: sleepLogs_id }).then((value) => {
            callback(null, value)
        }).catch((err) => {
            callback({ msg: "Erreur mongo suppression.", type_error: "error-mongo" });
        })
    }
    else if (sleepLogs_id && Array.isArray(sleepLogs_id) && sleepLogs_id.length > 0 && sleepLogs_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != sleepLogs_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: sleepLogs_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (sleepLogs_id && !Array.isArray(sleepLogs_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}


