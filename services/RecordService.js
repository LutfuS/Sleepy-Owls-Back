const RecordSchema = require('../schemas/Record')
const _ = require('lodash')
const async = require('async')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bcrypt = require('bcrypt')
const TokenUtils = require('./../utils/token')
const SALT_WORK8FACTOR = 10

var Record = mongoose.model('Record', RecordSchema)

Record.createIndexes()


module.exports.createOneRecord = async function (record, options, callback) {

    try {
        var new_record = new Record(record);
        var errors = new_record.validateSync();
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
            await new_record.save();
            callback(null, new_record.toObject());
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

module.exports.createManyRecords = async function (records, options, callback) {
    var errors = [];

    // Vérifier les erreurs de validation
    for (var i = 0; i < records.length; i++) {
        var record = records[i];

        var new_record = new Record(record);
        var error = new_record.validateSync();
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
            const data = await Record.insertMany(records, { ordered: false });
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

module.exports.findOneRecord = function (tab_field, value, options, callback) {
    var field_unique = ["user_id", "sleepQuality"]
    if (tab_field && Array.isArray(tab_field) && value && _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1 }).length == 0) {
        var obj_find = []
        _.forEach(tab_field, (e) => {
            obj_find.push({ [e]: value })
        })
        Record.findOne({ $or: obj_find }).then((value) => {
            if (value)
                callback(null, value.toObject())
            else {
                callback({ msg: "Record non trouvé.", type_error: "no-found" })
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
module.exports.findManyRecords = function (search, page, limit, options, callback) {
    page = !page ? 1 : parseInt(page)
    limit = !limit ? 10 : parseInt(limit)
    var populate = options && options.populate ? ["user_id"] : []
    if (typeof page !== "number" || typeof limit !== "number" || isNaN(page) || isNaN(limit)) {
        callback({ msg: `format de ${typeof page !== "number" ? "page" : "limit"} est incorrect`, type_error: "no-valid" })
    } else {
        var query_mongo = search ? {
            $or: _.map(["sleepQuality"], (e) => { return { [e]: { $regex: search } } })
        } : {}
        Record.countDocuments(query_mongo).then((value) => {
            if (value > 0) {
                const skip = ((page - 1) * limit)
                Record.find(query_mongo, null, { skip: skip, limit: limit, populate: populate, lean: true }).then((results) => {
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
module.exports.findOneRecordById = function (record_id, options, callback) {
    var opts = { populate: options && options.populate ? ["user_id"] : [] }
    if (record_id && mongoose.isValidObjectId(record_id)) {
        Record.findById(record_id, null, opts).then((value) => {
            try {
                if (value) {
                    callback(null, value.toObject());
                } else {
                    callback({ msg: "Aucun record trouvé.", type_error: "no-found" });
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

module.exports.findManyRecordsById = function (records_id, options, callback) {
    var opts = { populate: (options && options.populate ? ["user_id"] : []), lean: true }
    if (records_id && Array.isArray(records_id) && records_id.length > 0 && records_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == records_id.length) {
        records_id = records_id.map((e) => { return new ObjectId(e) })
        Record.find({ _id: records_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun record trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (records_id && Array.isArray(records_id) && records_id.length > 0 && records_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != records_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: records_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (records_id && !Array.isArray(records_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findManyRecordsById = function (records_id, options, callback) {
    var opts = { populate: (options && options.populate ? ["user_id"] : []), lean: true }
    if (records_id && Array.isArray(records_id) && records_id.length > 0 && records_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == records_id.length) {
        records_id = records_id.map((e) => { return new ObjectId(e) })
        Record.find({ _id: records_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun record trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (records_id && Array.isArray(records_id) && records_id.length > 0 && records_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != records_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: records_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (records_id && !Array.isArray(records_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.updateOneRecord = async function (record_id, update, options, callback) {
    if (record_id && mongoose.isValidObjectId(record_id)) {

        Record.findByIdAndUpdate(new ObjectId(record_id), update, { returnDocument: 'after', runValidators: true }).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Record non trouvé.", type_error: "no-found" });

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


module.exports.updateManyRecords = async function (records_id, update, options, callback) {
    if (records_id && Array.isArray(records_id) && records_id.length > 0 && records_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == records_id.length) {
        records_id = records_id.map((e) => { return new ObjectId(e) })


        Record.updateMany({ _id: records_id }, update, { runValidators: true }).then((value) => {
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

module.exports.deleteOneRecord = function (record_id, options, callback) {
    if (record_id && mongoose.isValidObjectId(record_id)) {
        Record.findByIdAndDelete(record_id).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Record non trouvé.", type_error: "no-found" });
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

module.exports.deleteManyRecords = function (records_id, options, callback) {
    if (records_id && Array.isArray(records_id) && records_id.length > 0 && records_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == records_id.length) {
        records_id = records_id.map((e) => { return new ObjectId(e) })
        Record.deleteMany({ _id: records_id }).then((value) => {
            callback(null, value)
        }).catch((err) => {
            callback({ msg: "Erreur mongo suppression.", type_error: "error-mongo" });
        })
    }
    else if (records_id && Array.isArray(records_id) && records_id.length > 0 && records_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != records_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: records_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (records_id && !Array.isArray(records_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}


