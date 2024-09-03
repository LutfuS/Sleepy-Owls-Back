const UserService = require('../../services/UserService')
const SleepLogService = require('../../services/SleepLogService')
const NotificationService = require('../../services/NotificationService')
const { faker } = require('@faker-js/faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')

chai.use(chaiHttp)
var notifications = []
var tab_id_users = []
var token = ""


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
let users = [
    {

        password: "fggsdqge",
        email: "johnun.us@gmail.com",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true
    },

    {

        password: "fggsdqge",
        email: "johnuzctztc.us@gmail.com",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true,
    },


    {

        password: "fggsdqge",
        email: "johnutgzct.us@gmail.com",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true

    },

    {

        password: "fggsdqge",
        email: "johnu.us@gmail.com",
        personnel_consentement: true,
        alarme_vibration: true,
        conseil_statut: true

    }
]

describe("Gestion des utilisateurs.", () => {

    it("Création de users", (done => {
        UserService.addManyUsers(users, null, function (err, value) {
            // console.log(err, value)
            tab_id_users = _.map(value, '_id')
            done()
        })

    }))

})

function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}
describe("POST -/login", () => {
    it("Authentifier un utilisateur correctement. -S", (done) => {
        chai.request(server).post('/login').send({

            password: "fggsdqge",
            email: "johnun.us@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true


        }).end((err, res) => {
            res.should.have.status(200)

            token = res.body.token
            // console.log(res.body.token)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec password incorrect)", (done) => {
        chai.request(server).post('/login').send({

            password: "fgghregsdqge",
            email: "jovrthchnu.us@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true


        }).end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec username incorrect)", (done) => {
        chai.request(server).post('/login').send({

            password: "fggsdqge",
            email: "jovrthchnu.us@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true

        }).end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
})

let sleepData = [
    {
        sleepStart,
        sleepEnd,
        sleepDuration,
        sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
        sleepSound,
        user_id: rdm_user(tab_id_users)
    },
];
describe("Gestion des data.", () => {
    const genData = sleepData;
    it("Création de data", (done) => {
        SleepLogService.createManySleepLogs(sleepData, null, function (err, value) {
            //    console.log(err, value);
            done();
        });
    });
});










describe("POST - /notification", () => {
    it("Créer un notification. - S", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).post('/notification')
            .auth(token, { type: 'bearer' })

            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false

            })
            .end((err, res) => {

                expect(res).to.have.status(201)
                notifications.push(res.body)
                done()
            });
    })
    it("Ajouter un notification incorrect. (Sans user_id) - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).post('/notification')
            .auth(token, { type: 'bearer' })

            .send({

                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false


            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })

    it("Ajouter une notification incorrect. (Avec un champ vide) - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).post('/notification')
            .auth(token, { type: 'bearer' })

            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType: "",
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false

            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })

})


describe("POST - /notifications", () => {
    it("Créer des notifications correct. - S", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).post('/notifications')
            .auth(token, { type: 'bearer' })

            .send([
                {
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
                    notifType: "informatif",
                    statut,
                    created_at: faker.defaultRefDate(30),
                    lu: false

                }
            ]).end((err, res) => {
                notifications = [...notifications, ...res.body]
                expect(res).to.have.status(201)
                done()
            });
    })
    it("Ajouter des notifications incorrect. (user_id) - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).post('/notifications')
            .auth(token, { type: 'bearer' })
            .send([
                {

                    message,
                    notifType,
                    statut,
                    created_at: faker.defaultRefDate(30),
                    lu: false
                },
                {



                    message,
                    notifType,
                    statut,
                    created_at: faker.defaultRefDate(30),
                    lu: false

                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })

    it("Ajouter des notifications incorrect. (Avec un champ vide) - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).post('/notifications')
            .auth(token, { type: 'bearer' })

            .send([
                {
                    user_id: rdm_user(tab_id_users),
                    message,
                    notifType: "",
                    statut,
                    created_at: faker.defaultRefDate(30),
                    lu: false


                },
                {
                    user_id: rdm_user(tab_id_users),
                    message,
                    notifType: "",
                    statut,
                    created_at: faker.defaultRefDate(30),
                    lu: false

                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })

})






describe("GET -/notification", () => {
    it("Chercher une notification par les champs selectionnées -S", (done) => {


        chai.request(server).get('/notification')
            .auth(token, { type: 'bearer' })
            .query({ fields: ["user_id"], value: notifications[0].user_id })

            .end((err, res) => {
                // console.log(token)
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher une notification avec un champ non autorisé -E", (done) => {

        chai.request(server).get('/notification')
            .auth(token, { type: 'bearer' })
            .query({ fields: "ajy", value: notifications[0].user_id })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher une notification sans aucunes query -E", (done) => {

        chai.request(server).get('/notification/')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher une notification inexistant -E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])

        chai.request(server).get('/notification').query({ fields: ["message"], value: ["Votgesvre récargzerpitulatif de cette nuit est disponible"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                // console.log("AHHHHH", err)
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher une notification par les champs selectionnées sans être authentifier -E", (done) => {

        chai.request(server).get('/notification')

            .query({ fields: ["user_id"], value: notifications[0].user_id })

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /notifications", () => {
    it("Chercher plusieurs notifications valides. - S", (done) => {

        chai.request(server).get('/notifications')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(notifications, '_id') })
            .end((err, res) => {

                res.should.have.status(200)

                done()
            })
    })
    it("Chercher plusieurs notifications avec id invalide. - E", (done) => {


        chai.request(server).get('/notifications')
            .query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs notifications non trouvé. - E", (done) => {


        chai.request(server).get('/notifications').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs notifications valides sans être authentifier. - E", (done) => {

        chai.request(server).get('/notifications')
            .query({ id: _.map(notifications, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("GET - /notification/:id", () => {
    it("Chercher une notification existant correct par id. - S", (done) => {

        chai.request(server).get('/notification/' + notifications[0]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher une notification non valide par id invalide. - E", (done) => {

        chai.request(server).get('/notification/' + "15572")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher une notification avec un id valide inexistant. - E", (done) => {


        chai.request(server).get("/notification" + "66791cb82c6b5e01b4c1efd3")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher une notification existant correct par id sans être authentifier. - S", (done) => {

        chai.request(server).get('/notification/' + notifications[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /notifications/:id", () => {
    it("Chercher plusieurs notifications valides. - S", (done) => {

        chai.request(server).get('/notifications')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(notifications, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher plusieurs notifications avec id invalide. - E", (done) => {


        chai.request(server).get('/notifications').query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs notifications non trouvé. - E", (done) => {


        chai.request(server).get('/notifications').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs notifications valides sans être authentifier. - E", (done) => {

        chai.request(server).get('/notifications')
            .query({ id: _.map(notifications, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

})



describe("PUT - /notification", () => {
    it("Modifier une notification correct. - S", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notification/' + notifications[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: true
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("Modifier une notification avec id incorrect. - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notification/1654645').auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false
            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier une notification avec id introuvable. - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notification/66791cb82c6b5e01b4c1efd3').auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false
            })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it("Modifier une notification avec des champs requis vide. - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notification/' + notifications[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType: "",
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false

            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier une notification correct sans être authentifier. - E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notification/' + notifications[0]._id)
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false
            })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

});
describe("PUT -/notifications", () => {
    it("Modifier plusieurs notifications. -S", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notifications')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(notifications, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: true

            }).end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Modifier plusieurs notifications avec des id invalide. -E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notifications')
            .auth(token, { type: 'bearer' })
            .query({ id: ['234465465', '453564'] })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false
            }).end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs notifications avec des ids inexistants. -E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notifications')
            .auth(token, { type: 'bearer' })
            .query({ id: ['66791cb82c6b5e01b4c1efd5', '66791cb82c6b5e01b4c1efd7'] })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false
            }).end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Modifier plusieurs notifications avec un champ requis vide. -E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notifications').
            auth(token, { type: 'bearer' })
            .query({ id: _.map(notifications, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType: "",
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false
            })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs notifications sans être authentifier. -E", (done) => {
        const message = faker.helpers.arrayElement(["Le récapitulatif de votre nuit est disponible", "Votre récapitulatif de la semaine est disponible"])
        const statut = faker.helpers.arrayElement(["en attente", "completer"])
        const notifType = faker.helpers.arrayElement(["sms", "push"])
        chai.request(server).put('/notifications')

            .query({ id: _.map(notifications, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                message,
                notifType,
                statut,
                created_at: faker.defaultRefDate(30),
                lu: false

            }).end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})
describe("DELETE - /notification", () => {
    it("Supprimer une notification. - S", (done) => {

        chai.request(server).delete('/notification/' + notifications[1]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("supprimer une notification incorrect (avec un id inexistant). - E", (done) => {

        chai.request(server).delete('/notification/665f18739d3e172be5daf092')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("supprimer une notification incorrect (avec un id invalide). - E", (done) => {

        chai.request(server).delete('/notification/123')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Supprimer une notification sans être authentifier. - S", (done) => {

        chai.request(server).delete('/notification/' + notifications[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("DELETE - /notifications", () => {

    it("Supprimer plusieurs notifications incorrects (avec un id inexistant). - E", (done) => {

        chai.request(server).delete('/notifications/66791a008843ab10ee8ad688&&66791a008843ab10ee8ad689')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Supprimer plusieurs notifications incorrects (avec un id invalide). - E", (done) => {

        chai.request(server).delete('/notifications').query({ id: ['123', '456'] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Supprimer plusieurs notifications. - S", (done) => {

        chai.request(server).delete('/notifications')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(notifications, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Supprimer plusieurs notifications sans être authentifier. - E", (done) => {

        chai.request(server).delete('/notifications')

            .query({ id: _.map(notifications, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("Gestion des utilisateurs.", () => {

    it("Suppression des utilisateurs fictif", (done) => {
        UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
            done()
        })
    })
})