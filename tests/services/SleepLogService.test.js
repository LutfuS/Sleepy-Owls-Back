const SleepLogService = require('../../services/SleepLogService');
const UserService = require('../../services/UserService');
const RecordService = require('../../services/RecordService');
const chai = require('chai');
const { faker } = require('@faker-js/faker');
let expect = chai.expect;
const _ = require('lodash');

var id_sleepLog_valid = "";
var tab_id_sleepLogs = [];
var tab_id_users = [];
var sleepLogs = [];
var tab_id_fictifData = [];
const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
const sleepStart = faker.defaultRefDate(30);
const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);


let fictifData = [
    {
        username: "MichelTrogneux",
        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
        user_id: rdm_user(tab_id_users)
    },
    {
        username: "ligones",
        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
        user_id: rdm_user(tab_id_users)
    },
    {
        username: "Xavier",
        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
        user_id: rdm_user(tab_id_users)
    }
];

it("GenerateData", (done) => {
    RecordService.createManyRecords(fictifData, null, function (err, value) {
        tab_id_fictifData = _.map(value, '_id');
        done();
    });
});

let users = [
    {
        firstName: "luf",
        lastName: "Us",
        username: "dwarfSlayer33",
        email: "lutfu.us@gmail.com",
        password: "fggsdqge"
    },
    {
        firstName: "lulu",
        lastName: "brg",
        username: "mai1denless",
        email: "maidenless@gmail.com",
        password: "fggsdqge"
    },
    {
        firstName: "lgfnuf",
        lastName: "Udhngsdh",
        username: "dwarg3jdnfSlgffbayer",
        email: "lutgfdnfhfg.us@gmail.com",
        password: "fggsdqge"
    },
    {
        firstName: "ldfxbfulu",
        lastName: "bbfcxrg",
        username: "mashfbi3denless",
        email: "maideshfbvnless@gmail.com",
        password: "fggsdqge"
    }
];

it("Création de users", (done) => {
    UserService.addManyUsers(users, null, function (err, value) {
        tab_id_users = _.map(value, '_id');
        done();
    });
});

function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * tab.length)];
    return rdm_id;
}


describe("CreateOneSleepLog", () => {
    it("SleepLog Correct. S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        var sleepLog = {
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating,
        }
        SleepLogService.createOneSleepLog(sleepLog, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_sleepLog_valid = value._id
            sleepLogs.push(value)

            done()
        })

    })
    it("SleepLog incorrect. (sans user_id)-E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        var sleepLog = {

            logDate,
            note,
            rating,
        }
        SleepLogService.createOneSleepLog(sleepLog, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('user_id')
            expect(err['fields']['user_id']).to.equal('Path `user_id` is required.')
            done()
        })

    })
})






describe("CreateManySleepLogs", () => {
    it("SleepLogs à ajouter, valide. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        var sleepLog_tab = [{
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating
        },


        {
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating,
        },
        {
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating,
        },
        {
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating,
        },
        ]

        SleepLogService.createManySleepLogs(sleepLog_tab, null, function (err, value) {
            // console.log(err, value)
            tab_id_sleepLogs = _.map(value, '_id')
            sleepLogs = [...value, ...sleepLogs]
            expect(value).lengthOf(4)
            done()
        })
    })
    it("SleepLogs à ajouter, non valide. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        var sleepLogs_tab_error = [{
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating
        },


        {
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating,
        },
        {
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating,
        },
        {
            user_id: rdm_user(tab_id_users),
            logDate,
            note,
            rating,
        }]

        SleepLogService.createManySleepLogs(sleepLogs_tab_error, null, function (err, value) {
            done()
        })
    })
})

describe("findOneSleepLog", () => {
    it("Chercher un sleepLog par les champs selectionnés - S.", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        SleepLogService.findOneSleepLog(["user_id", "note"], sleepLogs[0].user_id, null, function (err, value) {
            expect(value).to.haveOwnProperty('user_id')
            expect(value).to.haveOwnProperty('logDate')
            expect(value).to.haveOwnProperty('rating')
            expect(value).to.haveOwnProperty('note'),



                done()
        })
    })

    it("Chercher un sleeplOg avec un champ non autorisés - E.", (done) => {
        SleepLogService.findOneSleepLog(["description", "price"], sleepLogs[0].userId, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher un sleepLog sans tableau de champ - E.", (done) => {
        SleepLogService.findOneSleepLog("description", sleepLogs[0].user_id, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher un sleepLog inexistant - E.", (done) => {
        SleepLogService.findOneSleepLog(["note"], "records[0].userId", null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findOneSleepLogById", () => {
    it("Chercher un sleepLog existant correct. - S", (done) => {
        SleepLogService.findOneSleepLogById(id_sleepLog_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            done()

        })
    })
    it("Chercher un sleepLog non-existant correct. - E", (done) => {
        SleepLogService.findOneSleepLogById("100", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManySleepLogs", () => {
    it("Retourne 3 sleepLogs sur les 4. - S", (done) => {
        SleepLogService.findManySleepLogs(null, 1, 3, null, function (err, value) {
            // console.log(err, value)
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(9)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("Faire une recherche avec 0 resultats correspondant. - E", (done) => {
        SleepLogService.findManySleepLogs("Couteau", 1, 3, null, function (err, value) {
            // console.log(err, value)
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(0)
            expect(value["results"]).lengthOf(0)
            expect(err).to.be.null
            done()
        })
    })
    it("Envoie chaine de caractere sur page. - E", (done) => {
        SleepLogService.findManySleepLogs(null, "user_id", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("findManySleepLogsById", () => {
    it("Chercher des sleepLogs existant correct. - S", (done) => {
        SleepLogService.findManySleepLogsById(tab_id_sleepLogs, null, function (err, value) {
            expect(value).lengthOf(4)
            done()

        })
    })
})


describe("updateOneSleepLog", () => {
    it("Modifier un sleepLog correct. - S", (done) => {
        SleepLogService.updateOneSleepLog(id_sleepLog_valid, { note: "je me sens fatigué" }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('note')
            expect(value['note']).to.be.equal("je me sens fatigué")

            done()

        })
    })
    it("Modifier un sleepLog avec id incorrect. - E", (done) => {
        SleepLogService.updateOneSleepLog("1200", { note: "je me sens fatigué" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un sleepLog avec des champs requis vide. - E", (done) => {
        SleepLogService.updateOneSleepLog(id_sleepLog_valid, { note: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('note')
            expect(err['fields']['note']).to.equal('Path `note` is required.')
            done()
        })
    })
})

describe("updateManySleepLogs", () => {
    it("Modifier plusieurs sleepLogs correctement. - S", (done) => {
        SleepLogService.updateManySleepLogs(tab_id_sleepLogs, { note: "je me sens fatigué" }, null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_sleepLogs.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_sleepLogs.length)
            done()

        })
    })
    it("Modifier plusieurs sleepLogs avec id incorrect. - E", (done) => {
        SleepLogService.updateManySleepLogs("1200", { note: "je me sens fatigué" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs sleepLogs avec des champs requis vide. - E", (done) => {
        SleepLogService.updateManySleepLogs(tab_id_sleepLogs, { note: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('note')
            expect(err['fields']['note']).to.equal('Path `note` is required.')
            done()
        })
    })
})

describe("deleteOneSleepLog", () => {
    it("Supprimer un sleepLog correct. - S", (done) => {
        SleepLogService.deleteOneSleepLog(id_sleepLog_valid, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('note')
            expect(value).to.haveOwnProperty('logDate')
            done()
        })
    })
    it("Supprimer un sleepLog avec id incorrect. - E", (done) => {
        SleepLogService.deleteOneSleepLog("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un sleepLog avec un id inexistant. - E", (done) => {
        SleepLogService.deleteOneSleepLog("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManySleepLogs", () => {
    it("Supprimer plusieurs sleepLogs correctement. - S", (done) => {
        SleepLogService.deleteManySleepLogs(tab_id_sleepLogs, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_sleepLogs.length)
            done()

        })
    })
    it("Supprimer plusieurs sleepLogs avec id incorrect. - E", (done) => {
        SleepLogService.deleteManySleepLogs("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })

})

it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
        done()
    })
})

