const RecordService = require('../../services/RecordService')
const UserService = require('../../services/UserService')
const chai = require('chai');
const { faker } = require('@faker-js/faker');
let expect = chai.expect;
const _ = require('lodash')
var id_record_valid = ""
var tab_id_records = []
var tab_id_users = []
var records = []
var tab_id_fictifData = []
const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
const sleepStart = faker.defaultRefDate(30);
const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);


let fictifData = [

    {
        username: "MichelTrogneux  ",
        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),
        user_id: rdm_user(tab_id_users)
    },
    {
        username: "ligones",
        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),
        user_id: rdm_user(tab_id_users)
    },
    {
        username: "Xavier",
        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),
        user_id: rdm_user(tab_id_users)
    },
]

it("GenerateData", (done => {
    RecordService.createManyRecords(fictifData, null, function (err, value) {
        tab_id_fictifData = _.map(value, '_id')
        //  console.log(tab_id_users)
        done()
    })
}))

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
]

it("Création de users", (done => {
    UserService.addManyUsers(users, null, function (err, value) {
        tab_id_users = _.map(value, '_id')
        //  console.log(tab_id_users)
        done()
    })
}))
function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

describe("CreateOneRecord", () => {

    it("Record correct. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        var record = {

            sleepStart,
            sleepEnd,
            sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),
            user_id: rdm_user(tab_id_users)

        }

        RecordService.createOneRecord(record, null, function (err, value) {

            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_record_valid = value._id
            records.push(value)

            done()
        })
    })

    it("Record incorrect. (Sans user_id) - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        var record_no_valid = {

            sleepStart,
            sleepEnd,
            sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),


        }
        RecordService.createOneRecord(record_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('user_id')
            expect(err['fields']['user_id']).to.equal('Path `user_id` is required.')
            done()
        })
    })
})

describe("CreateManyRecords", () => {
    it("Records à ajouter, valide. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        var records_tab = [{

            sleepStart,
            sleepEnd,
            sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),
            user_id: rdm_user(tab_id_users)


        }, {

            sleepStart,
            sleepEnd,
            sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),
            user_id: rdm_user(tab_id_users)



        },
        {


            sleepStart,
            sleepEnd,
            sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),
            user_id: rdm_user(tab_id_users)


        }]

        RecordService.createManyRecords(records_tab, null, function (err, value) {
            //  console.log(err)
            tab_id_records = _.map(value, '_id')
            records = [...value, ...records]
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Records à ajouter, non valide. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        var records_tab_error = [{

            sleepStart,
            sleepEnd,
            sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),



        }, {

            sleepStart,
            sleepEnd,
            sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore during sleep', 'talk during sleep', 'move during sleep', 'wake up in the night']),

        }]

        RecordService.createManyRecords(records_tab_error, null, function (err, value) {
            done()
        })
    })
})

describe("findOneRecord", () => {
    it("Chercher un record par les champs selectionnés - S.", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        RecordService.findOneRecord(["user_id", "sleepQuality"], records[0].user_id, null, function (err, value) {
            expect(value).to.haveOwnProperty('sleepStart')
            expect(value).to.haveOwnProperty('sleepEnd')
            expect(value).to.haveOwnProperty('sleepDuration')
            expect(value).to.haveOwnProperty('user_id')
            expect(value).to.haveOwnProperty('sleepQuality'),


                done()
        })
    })

    it("Chercher un record avec un champ non autorisés - E.", (done) => {
        RecordService.findOneRecord(["description", "price"], records[0].userId, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher un record sans tableau de champ - E.", (done) => {
        RecordService.findOneRecord("description", records[0].user_id, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher un record inexistant - E.", (done) => {
        RecordService.findOneRecord(["sleepStart"], "records[0].userId", null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findOneRecordById", () => {
    it("Chercher un record existant correct. - S", (done) => {
        RecordService.findOneRecordById(id_record_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            done()

        })
    })
    it("Chercher un record non-existant correct. - E", (done) => {
        RecordService.findOneRecordById("100", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyRecords", () => {
    it("Retourne 3 records sur les 4. - S", (done) => {
        RecordService.findManyRecords(null, 1, 3, null, function (err, value) {
            // console.log(err, value)
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(4)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("Faire une recherche avec 0 resultats correspondant. - E", (done) => {
        RecordService.findManyRecords("Couteau", 1, 3, null, function (err, value) {
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
        RecordService.findManyRecords(null, "user_id", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("findManyRecordsById", () => {
    it("Chercher des records existant correct. - S", (done) => {
        RecordService.findManyRecordsById(tab_id_records, null, function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})


describe("updateOneRecord", () => {
    it("Modifier un record correct. - S", (done) => {
        RecordService.updateOneRecord(id_record_valid, { sleepSound: "snore during sleep", sleepQuality: "good" }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('sleepSound')
            expect(value).to.haveOwnProperty('sleepQuality')
            expect(value['sleepSound']).to.be.equal('snore during sleep')
            expect(value['sleepQuality']).to.be.equal("good")
            done()

        })
    })
    it("Modifier un record avec id incorrect. - E", (done) => {
        RecordService.updateOneRecord("1200", { sleepSound: "snore during sleep", sleepQuality: "good" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un record avec des champs requis vide. - E", (done) => {
        RecordService.updateOneRecord(id_record_valid, { sleepSound: "", sleepQuality: "good" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('sleepSound')
            expect(err['fields']['sleepSound']).to.equal('Path `sleepSound` is required.')
            done()
        })
    })
})

describe("updateManyRecords", () => {
    it("Modifier plusieurs records correctement. - S", (done) => {
        RecordService.updateManyRecords(tab_id_records, { sleepSound: "snore during sleep", sleepQuality: "good" }, null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_records.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_records.length)
            done()

        })
    })
    it("Modifier plusieurs records avec id incorrect. - E", (done) => {
        RecordService.updateManyRecords("1200", { sleepSound: "snore during sleep", sleepQuality: "good" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs records avec des champs requis vide. - E", (done) => {
        RecordService.updateManyRecords(tab_id_records, { sleepSound: "", sleepQuality: "good" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('sleepSound')
            expect(err['fields']['sleepSound']).to.equal('Path `sleepSound` is required.')
            done()
        })
    })
})

describe("deleteOneRecord", () => {
    it("Supprimer un record correct. - S", (done) => {
        RecordService.deleteOneRecord(id_record_valid, null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('sleepQuality')
            expect(value).to.haveOwnProperty('sleepSound')
            done()
        })
    })
    it("Supprimer un record avec id incorrect. - E", (done) => {
        RecordService.deleteOneRecord("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un article avec un id inexistant. - E", (done) => {
        RecordService.deleteOneRecord("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyRecords", () => {
    it("Supprimer plusieurs records correctement. - S", (done) => {
        RecordService.deleteManyRecords(tab_id_records, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_records.length)
            done()

        })
    })
    it("Supprimer plusieurs records avec id incorrect. - E", (done) => {
        RecordService.deleteManyRecords("1200", null, function (err, value) {
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

