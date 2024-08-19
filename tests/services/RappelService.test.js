const RappelService = require('../../services/RappelService')
const UserService = require('../../services/UserService')
const SleepLogService = require('../../services/SleepLogService')
const chai = require('chai');
const { faker } = require('@faker-js/faker');
let expect = chai.expect;
const _ = require('lodash')
var id_rappel_valid = ""
var tab_id_rappels = []
var tab_id_users = []
var rappels = []
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
    SleepLogService.createManySleepLogs(fictifData, null, function (err, value) {
        tab_id_fictifData = _.map(value, '_id')
        //  console.log(tab_id_users)
        done()
    })
}))

let users = [
    {
        email: "eduard.duponsgeverg@gmail.com",
        username: "edupgsztrot",
        password: "fggsdqge",
        personnel: {
            compte: "ze70",
            consentement: true
        },
        alarme: {
            vibration: true
        },
        conseil: {
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/She-goat_J1.jpg/240px-She-goat_J1.jpg",
            texte: "SUUUUUUUU",
            statut: true
        }

    },

    {
        email: "edshfuard.dupont@gmail.com",
        username: "eduresgdfgot",
        password: "fggsdqge",
        personnel: {
            compte: "ze71",
            consentement: true
        },
        alarme: {
            vibration: true
        },
        conseil: {
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/She-goat_J1.jpg/240px-She-goat_J1.jpg",
            texte: "SUUUUUUUU",
            statut: true
        }
    },
    {
        email: "eduauhtrshrd.dupont@gmail.com",
        username: "edupshthrot",
        password: "fggsdqge",
        personnel: {
            compte: "ze73",
            consentement: true
        },
        alarme: {
            vibration: true
        },
        conseil: {
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/She-goat_J1.jpg/240px-She-goat_J1.jpg",
            texte: "SUUUUUUUU",
            statut: true
        }
    },

    {
        email: "eduayglheerd.dupont@gmail.com",
        username: "edewdgrresupot",
        password: "fggsdqge",
        personnel: {
            compte: "ze75",
            consentement: true
        },
        alarme: {
            vibration: true
        },
        conseil: {
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/She-goat_J1.jpg/240px-She-goat_J1.jpg",
            texte: "SUUUUUUUU",
            statut: true
        }
    }
]

it("Création de users", (done => {
    UserService.addManyUsers(users, null, function (err, value) {
        tab_id_users = _.map(value, '_id')
        // console.log(tab_id_users)
        done()
    })
}))
function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

describe("CreateOneRappel", () => {

    it("Rappel correct. - S", (done) => {

        var rappel = {

            user_id: rdm_user(tab_id_users),
            titre: "Rappel",
            description: "Il est l'heure de vous lever",
            date: faker.defaultRefDate(30),
            frequence: faker.helpers.arrayElement([5, 10, 15]),
            statut: faker.helpers.arrayElement(["en attente", "completer"]),
            notifType: faker.helpers.arrayElement(["sms", "push"])



        }

        RappelService.createOneRappel(rappel, null, function (err, value) {

            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_rappel_valid = value._id
            rappels.push(value)

            done()
        })
    })

    it("Rappel incorrect. (Sans user_id) - E", (done) => {

        var rappel_no_valid = {



            titre: "Rappel",
            description: "Il est l'heure de vous lever",
            date: faker.defaultRefDate(30),
            frequence: faker.helpers.arrayElement([5, 10, 15]),
            statut: faker.helpers.arrayElement(["en attente", "completer"]),
            notifType: faker.helpers.arrayElement(["sms", "push"])


        }
        RappelService.createOneRappel(rappel_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('user_id')
            expect(err['fields']['user_id']).to.equal('Path `user_id` is required.')
            done()
        })
    })
})

describe("CreateManyRappels", () => {
    it("Rappels à ajouter, valide. - S", (done) => {

        var rappels_tab = [{

            user_id: rdm_user(tab_id_users),
            titre: "Rappel",
            description: "Il est l'heure de vous lever",
            date: faker.defaultRefDate(30),
            frequence: faker.helpers.arrayElement([5, 10, 15]),
            statut: faker.helpers.arrayElement(["en attente", "completer"]),
            notifType: faker.helpers.arrayElement(["sms", "push"])




        }, {

            user_id: rdm_user(tab_id_users),
            titre: "Rappel",
            description: "Il est l'heure de vous lever",
            date: faker.defaultRefDate(30),
            frequence: faker.helpers.arrayElement([5, 10, 15]),
            statut: faker.helpers.arrayElement(["en attente", "completer"]),
            notifType: faker.helpers.arrayElement(["sms", "push"])





        },
        {


            user_id: rdm_user(tab_id_users),
            titre: "Rappel",
            description: "Il est l'heure de vous lever",
            date: faker.defaultRefDate(30),
            frequence: faker.helpers.arrayElement([5, 10, 15]),
            statut: faker.helpers.arrayElement(["en attente", "completer"]),
            notifType: faker.helpers.arrayElement(["sms", "push"])



        }]

        RappelService.createManyRappels(rappels_tab, null, function (err, value) {
            //  console.log(err)
            tab_id_rappels = _.map(value, '_id')
            rappels = [...value, ...rappels]
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Rappels à ajouter, non valide. - E", (done) => {

        var rappels_tab_error = [{



            titre: "Rappel",
            description: "Il est l'heure de vous lever",
            date: faker.defaultRefDate(30),
            frequence: faker.helpers.arrayElement([5, 10, 15]),
            statut: faker.helpers.arrayElement(["en attente", "completer"]),
            notifType: faker.helpers.arrayElement(["sms", "push"])




        }, {



            titre: "Rappel",
            description: "Il est l'heure de vous lever",
            date: faker.defaultRefDate(30),
            frequence: faker.helpers.arrayElement([5, 10, 15]),
            statut: faker.helpers.arrayElement(["en attente", "completer"]),
            notifType: faker.helpers.arrayElement(["sms", "push"])


        }]

        RappelService.createManyRappels(rappels_tab_error, null, function (err, value) {
            done()
        })
    })
})

describe("findOneRappel", () => {
    it("Chercher une rappel par les champs selectionnés - S.", (done) => {

        RappelService.findOneRappel(["user_id"], rappels[0].user_id, null, function (err, value) {


            expect(value).to.haveOwnProperty('titre')
            expect(value).to.haveOwnProperty('description')
            expect(value).to.haveOwnProperty('date')
            expect(value).to.haveOwnProperty('frequence')
            expect(value).to.haveOwnProperty('user_id')
            expect(value).to.haveOwnProperty('statut')
            expect(value).to.haveOwnProperty('notifType')


            done()
        })
    })

    it("Chercher une rappel avec un champ non autorisés - E.", (done) => {
        RappelService.findOneRappel(["description", "price"], rappels[0].user_id, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher une rappel sans tableau de champ - E.", (done) => {
        RappelService.findOneRappel("titre", rappels[0].user_id, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher une rappel inexistant - E.", (done) => {
        RappelService.findOneRappel(["message"], "rappels[0].userId", null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findOneRappelById", () => {
    it("Chercher une rappel existant correct. - S", (done) => {
        RappelService.findOneRappelById(id_rappel_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            done()

        })
    })
    it("Chercher une rappel non-existant correct. - E", (done) => {
        RappelService.findOneRappelById("100", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyRappels", () => {
    it("Retourne 3 rappels sur les 4. - S", (done) => {
        RappelService.findManyRappels(null, 1, 3, null, function (err, value) {
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
        RappelService.findManyRappels("Couteau", 1, 3, null, function (err, value) {
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
        RappelService.findManyRappels(null, "user_id", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("findManyRappelsById", () => {
    it("Chercher des rappels existant correct. - S", (done) => {
        RappelService.findManyRappelsById(tab_id_rappels, null, function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})


describe("updateOneRappel", () => {
    it("Modifier une rappel correct. - S", (done) => {
        RappelService.updateOneRappel(id_rappel_valid, { description: "Il est l'heure de vous lever", titre: "Rappels" }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('description')
            expect(value).to.haveOwnProperty('titre')
            expect(value['titre']).to.be.equal('Rappels')
            expect(value['description']).to.be.equal("Il est l'heure de vous lever")
            done()

        })
    })
    it("Modifier une rappel avec id incorrect. - E", (done) => {
        RappelService.updateOneRappel("1200", { description: "Il est l'heure de vous lever", titre: "Rappels" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier une rappel avec des champs requis vide. - E", (done) => {
        RappelService.updateOneRappel(id_rappel_valid, { description: "", titre: "Rappels" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('description')
            expect(err['fields']['description']).to.equal('Path `description` is required.')
            done()
        })
    })
})

describe("updateManyRappels", () => {
    it("Modifier plusieurs rappels correctement. - S", (done) => {
        RappelService.updateManyRappels(tab_id_rappels, { description: "Il est l'heure de vous lever", titre: "Rappels" }, null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_rappels.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_rappels.length)
            done()

        })
    })
    it("Modifier plusieurs rappels avec id incorrect. - E", (done) => {
        RappelService.updateManyRappels("1200", { description: "Il est l'heure de vous lever", titre: "Rappels" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs rappels avec des champs requis vide. - E", (done) => {
        RappelService.updateManyRappels(tab_id_rappels, { description: "", titre: "Rappels" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('description')
            expect(err['fields']['description']).to.equal('Path `description` is required.')
            done()
        })
    })
})

describe("deleteOneRappel", () => {
    it("Supprimer une rappel correct. - S", (done) => {
        RappelService.deleteOneRappel(id_rappel_valid, null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('description')
            expect(value).to.haveOwnProperty('titre')
            done()
        })
    })
    it("Supprimer une rappel avec id incorrect. - E", (done) => {
        RappelService.deleteOneRappel("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un article avec un id inexistant. - E", (done) => {
        RappelService.deleteOneRappel("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyRappels", () => {
    it("Supprimer plusieurs rappels correctement. - S", (done) => {
        RappelService.deleteManyRappels(tab_id_rappels, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_rappels.length)
            done()

        })
    })
    it("Supprimer plusieurs rappels avec id incorrect. - E", (done) => {
        RappelService.deleteManyRappels("1200", null, function (err, value) {
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

