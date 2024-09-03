const NotificationService = require('../../services/NotificationService')
const UserService = require('../../services/UserService')
const SleepLogService = require('../../services/SleepLogService')
const chai = require('chai');
const { faker } = require('@faker-js/faker');
let expect = chai.expect;
const _ = require('lodash')
var id_notification_valid = ""
var tab_id_notifications = []
var tab_id_users = []
var notifications = []


const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
const sleepStart = faker.defaultRefDate(30);
const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

const sounds = {
    'Ronflement': 'public\son\man_breathing_asleep-75120.mp3',
    'Somniloquie': 'public\son\sleep-talking-wav-68027.mp3',
    'Chuchotement': 'public\son\shushing-150148.mp3',
    'Reveil': 'public\son\man-waking-up-from-sleep-6338.mp3',
    'Respirations': 'public\son\man_breathing_asleep-75120.mp3'
}

const soundKey = faker.helpers.arrayElement(Object.keys(sounds))
const sleepSound = sounds[soundKey]
var tab_id_fictifData = []
let fictifData = [

    {

        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound,
        user_id: rdm_user(tab_id_users)
    },
    {

        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound,
        user_id: rdm_user(tab_id_users)
    },
    {

        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound,
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
        password: "fggsdqge",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true

    },

    {
        email: "edshfuard.dupont@gmail.com",
        password: "fggsdqge",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true
    },
    {
        email: "eduauhtrshrd.dupont@gmail.com",
        password: "fggsdqge",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true
    },

    {
        email: "eduayglheerd.dupont@gmail.com",
        password: "fggsdqge",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true
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

describe("CreateOneNotification", () => {
    const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
    const statut = faker.helpers.arrayElement(["en attente", "completer"])
    const notifType = faker.helpers.arrayElement(["sms", "push"])
    it("Notification correct. - S", (done) => {

        var notification = {

            user_id: rdm_user(tab_id_users),
            message,
            notifType,
            statut,
            created_at: faker.defaultRefDate(30),
            lu: false

        }

        NotificationService.createOneNotification(notification, null, function (err, value) {

            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_notification_valid = value._id
            notifications.push(value)

            done()
        })
    })

    it("Notification incorrect. (Sans user_id) - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        var notification_no_valid = {


            message,
            notifType,
            statut,
            created_at: faker.defaultRefDate(30),
            lu: false

        }
        NotificationService.createOneNotification(notification_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('user_id')
            expect(err['fields']['user_id']).to.equal('Path `user_id` is required.')
            done()
        })
    })
})

describe("CreateManyNotifications", () => {
    it("Notifications à ajouter, valide. - S", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])

        var notifications_tab = [{

            user_id: rdm_user(tab_id_users),
            message,
            notifType,
            statut,
            created_at: faker.defaultRefDate(30),
            lu: false



        }, {

            user_id: rdm_user(tab_id_users),
            message,
            notifType,
            statut,
            created_at: faker.defaultRefDate(30),
            lu: false




        },
        {


            user_id: rdm_user(tab_id_users),
            message,
            notifType,
            statut,
            created_at: faker.defaultRefDate(30),
            lu: false



        }]

        NotificationService.createManyNotifications(notifications_tab, null, function (err, value) {
            //  console.log(err)
            tab_id_notifications = _.map(value, '_id')
            notifications = [...value, ...notifications]
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Notifications à ajouter, non valide. - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        var notifications_tab_error = [{


            message,
            notifType,
            statut,
            created_at: faker.defaultRefDate(30),
            lu: false



        }, {


            message,
            notifType,
            statut,
            created_at: faker.defaultRefDate(30),
            lu: false

        }]

        NotificationService.createManyNotifications(notifications_tab_error, null, function (err, value) {
            done()
        })
    })
})

describe("findOneNotification", () => {
    it("Chercher une notification par les champs selectionnés - S.", (done) => {

        NotificationService.findOneNotification(["user_id"], notifications[0].user_id, null, function (err, value) {


            expect(value).to.haveOwnProperty('message')
            expect(value).to.haveOwnProperty('notifType')
            expect(value).to.haveOwnProperty('statut')
            expect(value).to.haveOwnProperty('user_id')
            expect(value).to.haveOwnProperty('created_at')
            expect(value).to.haveOwnProperty('lu'),


                done()
        })
    })

    it("Chercher une notification avec un champ non autorisés - E.", (done) => {
        NotificationService.findOneNotification(["description", "price"], notifications[0].user_id, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher une notification sans tableau de champ - E.", (done) => {
        NotificationService.findOneNotification("message", notifications[0].user_id, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

    it("Chercher une notification inexistant - E.", (done) => {
        NotificationService.findOneNotification(["message"], "notifications[0].userId", null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findOneNotificationById", () => {
    it("Chercher une notification existant correct. - S", (done) => {
        NotificationService.findOneNotificationById(id_notification_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            done()

        })
    })
    it("Chercher une notification non-existant correct. - E", (done) => {
        NotificationService.findOneNotificationById("100", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyNotifications", () => {
    it("Retourne 3 notifications sur les 4. - S", (done) => {
        NotificationService.findManyNotifications(null, 1, 3, null, function (err, value) {
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
        NotificationService.findManyNotifications("Couteau", 1, 3, null, function (err, value) {
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
        NotificationService.findManyNotifications(null, "user_id", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("findManyNotificationsById", () => {
    it("Chercher des notifications existant correct. - S", (done) => {
        NotificationService.findManyNotificationsById(tab_id_notifications, null, function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})


describe("updateOneNotification", () => {
    it("Modifier une notification correct. - S", (done) => {
        NotificationService.updateOneNotification(id_notification_valid, { message: "Le récapitulatif de cette nuit est disponible", lu: true }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('message')
            expect(value).to.haveOwnProperty('lu')
            expect(value['message']).to.be.equal('Le récapitulatif de cette nuit est disponible')
            expect(value['lu']).to.be.equal(true)
            done()

        })
    })
    it("Modifier une notification avec id incorrect. - E", (done) => {
        NotificationService.updateOneNotification("1200", { message: "Le récapitulatif de cette nuit est disponible", lu: true }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier une notification avec des champs requis vide. - E", (done) => {
        NotificationService.updateOneNotification(id_notification_valid, { message: "", lu: true }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('message')
            expect(err['fields']['message']).to.equal('Path `message` is required.')
            done()
        })
    })
})

describe("updateManyNotifications", () => {
    it("Modifier plusieurs notifications correctement. - S", (done) => {
        NotificationService.updateManyNotifications(tab_id_notifications, { message: "Le récapitulatif de cette nuit est disponible", lu: true }, null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_notifications.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_notifications.length)
            done()

        })
    })
    it("Modifier plusieurs notifications avec id incorrect. - E", (done) => {
        NotificationService.updateManyNotifications("1200", { message: "Le récapitulatif de cette nuit est disponible", lu: true }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs notifications avec des champs requis vide. - E", (done) => {
        NotificationService.updateManyNotifications(tab_id_notifications, { message: "", lu: true }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('message')
            expect(err['fields']['message']).to.equal('Path `message` is required.')
            done()
        })
    })
})

describe("deleteOneNotification", () => {
    it("Supprimer une notification correct. - S", (done) => {
        NotificationService.deleteOneNotification(id_notification_valid, null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('message')
            expect(value).to.haveOwnProperty('statut')
            done()
        })
    })
    it("Supprimer une notification avec id incorrect. - E", (done) => {
        NotificationService.deleteOneNotification("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un article avec un id inexistant. - E", (done) => {
        NotificationService.deleteOneNotification("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyNotifications", () => {
    it("Supprimer plusieurs notifications correctement. - S", (done) => {
        NotificationService.deleteManyNotifications(tab_id_notifications, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_notifications.length)
            done()

        })
    })
    it("Supprimer plusieurs notifications avec id incorrect. - E", (done) => {
        NotificationService.deleteManyNotifications("1200", null, function (err, value) {
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

