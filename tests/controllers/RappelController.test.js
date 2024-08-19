const UserService = require('../../services/UserService')
const SleepLogService = require('../../services/SleepLogService')
const RappelService = require('../../services/RappelService')
const { faker } = require('@faker-js/faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')

chai.use(chaiHttp)
var rappels = []
var tab_id_users = []
var token = ""


const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
const sleepStart = faker.defaultRefDate(30);
const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
let users = [
    {
        username: "johnn",
        password: "fggsdqge",
        email: "johnun.us@gmail.com",
        personnel: {
            compte: "ze2784459",
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
        username: "joercthn",
        password: "fggsdqge",
        email: "johnuzctztc.us@gmail.com",
        personnel: {
            compte: "zgzecre10",
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
        username: "jozcgzghn",
        password: "fggsdqge",
        email: "johnutgzct.us@gmail.com",
        personnel: {
            compte: "zegtcg10",
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
        username: "jothfed(ghn",
        password: "fggsdqge",
        email: "johnu.us@gmail.com",
        personnel: {
            compte: "ze1hrt0",
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
            username: "johnn",
            password: "fggsdqge",
            email: "johnun.us@gmail.com",
            personnel: {
                compte: "ze2784459",
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

        }).end((err, res) => {
            res.should.have.status(200)

            token = res.body.token
            // console.log(res.body.token)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec password incorrect)", (done) => {
        chai.request(server).post('/login').send({
            username: "johjtntbhn",
            password: "fgghregsdqge",
            email: "jovrthchnu.us@gmail.com",
            personnel: {
                compte: "ze1g'(ct0",
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

        }).end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec username incorrect)", (done) => {
        chai.request(server).post('/login').send({
            username: "johkjfyujrjtntbhn",
            password: "fggsdqge",
            email: "jovrthchnu.us@gmail.com",
            personnel: {
                compte: "ze1g'(ct0",
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
        sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
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










describe("POST - /rappel", () => {
    it("Créer un rappel. - S", (done) => {

        chai.request(server).post('/rappel')
            .auth(token, { type: 'bearer' })

            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            })
            .end((err, res) => {

                expect(res).to.have.status(201)
                rappels.push(res.body)
                done()
            });
    })
    it("Ajouter un rappel incorrect. (Sans user_id) - E", (done) => {

        chai.request(server).post('/rappel')
            .auth(token, { type: 'bearer' })

            .send({

                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])


            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })

    it("Ajouter un rappel incorrect. (Avec un champ vide) - E", (done) => {

        chai.request(server).post('/rappel')
            .auth(token, { type: 'bearer' })

            .send({
                user_id: rdm_user(tab_id_users),
                titre: "",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])

            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })

})


describe("POST - /rappels", () => {
    it("Créer des rappels correct. - S", (done) => {

        chai.request(server).post('/rappels')
            .auth(token, { type: 'bearer' })

            .send([
                {
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

                }
            ]).end((err, res) => {
                rappels = [...rappels, ...res.body]
                expect(res).to.have.status(201)
                done()
            });
    })
    it("Ajouter des rappels incorrect. (user_id) - E", (done) => {

        chai.request(server).post('/rappels')
            .auth(token, { type: 'bearer' })
            .send([
                {


                    titre: "Rappel",
                    description: "Il est l'heure de vous lever",
                    date: faker.defaultRefDate(30),
                    frequence: faker.helpers.arrayElement([5, 10, 15]),
                    statut: faker.helpers.arrayElement(["en attente", "completer"]),
                    notifType: faker.helpers.arrayElement(["sms", "push"])
                },
                {




                    titre: "Rappel",
                    description: "Il est l'heure de vous lever",
                    date: faker.defaultRefDate(30),
                    frequence: faker.helpers.arrayElement([5, 10, 15]),
                    statut: faker.helpers.arrayElement(["en attente", "completer"]),
                    notifType: faker.helpers.arrayElement(["sms", "push"])

                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })

    it("Ajouter des rappels incorrect. (Avec un champ vide) - E", (done) => {

        chai.request(server).post('/rappels')
            .auth(token, { type: 'bearer' })

            .send([
                {
                    user_id: rdm_user(tab_id_users),
                    titre: "",
                    description: "Il est l'heure de vous lever",
                    date: faker.defaultRefDate(30),
                    frequence: faker.helpers.arrayElement([5, 10, 15]),
                    statut: faker.helpers.arrayElement(["en attente", "completer"]),
                    notifType: faker.helpers.arrayElement(["sms", "push"])


                },
                {
                    user_id: rdm_user(tab_id_users),
                    titre: "",
                    description: "Il est l'heure de vous lever",
                    date: faker.defaultRefDate(30),
                    frequence: faker.helpers.arrayElement([5, 10, 15]),
                    statut: faker.helpers.arrayElement(["en attente", "completer"]),
                    notifType: faker.helpers.arrayElement(["sms", "push"])
                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })

})






describe("GET -/rappel", () => {
    it("Chercher un rappel par les champs selectionnées -S", (done) => {


        chai.request(server).get('/rappel')
            .auth(token, { type: 'bearer' })
            .query({ fields: ["user_id"], value: rappels[0].user_id })

            .end((err, res) => {
                // console.log(token)
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher un rappel avec un champ non autorisé -E", (done) => {

        chai.request(server).get('/rappel')
            .auth(token, { type: 'bearer' })
            .query({ fields: "ajy", value: rappels[0].user_id })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un rappel sans aucuns query -E", (done) => {

        chai.request(server).get('/rappel/')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un rappel inexistant -E", (done) => {


        chai.request(server).get('/rappel').query({ fields: ["titre"], value: ["Votgesvre récargzerpitulatif de cette nuit est disponible"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                // console.log("AHHHHH", err)
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un rappel par les champs selectionnées sans être authentifier -E", (done) => {

        chai.request(server).get('/rappel')

            .query({ fields: ["user_id"], value: rappels[0].user_id })

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /rappels", () => {
    it("Chercher plusieurs rappels valides. - S", (done) => {

        chai.request(server).get('/rappels')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(rappels, '_id') })
            .end((err, res) => {

                res.should.have.status(200)

                done()
            })
    })
    it("Chercher plusieurs rappels avec id invalide. - E", (done) => {


        chai.request(server).get('/rappels')
            .query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs rappels non trouvé. - E", (done) => {


        chai.request(server).get('/rappels').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs rappels valides sans être authentifier. - E", (done) => {

        chai.request(server).get('/rappels')
            .query({ id: _.map(rappels, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("GET - /rappel/:id", () => {
    it("Chercher un rappel existant correct par id. - S", (done) => {

        chai.request(server).get('/rappel/' + rappels[0]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher un rappel non valide par id invalide. - E", (done) => {

        chai.request(server).get('/rappel/' + "15572")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un rappel avec un id valide inexistant. - E", (done) => {


        chai.request(server).get("/rappel" + "66791cb82c6b5e01b4c1efd3")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un rappel existant correct par id sans être authentifier. - S", (done) => {

        chai.request(server).get('/rappel/' + rappels[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /rappels/:id", () => {
    it("Chercher plusieurs rappels valides. - S", (done) => {

        chai.request(server).get('/rappels')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(rappels, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher plusieurs rappels avec id invalide. - E", (done) => {


        chai.request(server).get('/rappels').query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs rappels non trouvé. - E", (done) => {


        chai.request(server).get('/rappels').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs rappels valides sans être authentifier. - E", (done) => {

        chai.request(server).get('/rappels')
            .query({ id: _.map(rappels, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

})



describe("PUT - /rappel", () => {
    it("Modifier un rappel correct. - S", (done) => {

        chai.request(server).put('/rappel/' + rappels[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'hveure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("Modifier un rappel avec id incorrect. - E", (done) => {

        chai.request(server).put('/rappel/1654645').auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un rappel avec id introuvable. - E", (done) => {

        chai.request(server).put('/rappel/66791cb82c6b5e01b4c1efd3').auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it("Modifier un rappel avec des champs requis vide. - E", (done) => {

        chai.request(server).put('/rappel/' + rappels[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])

            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un rappel correct sans être authentifier. - E", (done) => {

        chai.request(server).put('/rappel/' + rappels[0]._id)
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

});
describe("PUT -/rappels", () => {
    it("Modifier plusieurs rappels. -S", (done) => {

        chai.request(server).put('/rappels')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(rappels, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'hesure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])

            }).end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Modifier plusieurs rappels avec des id invalide. -E", (done) => {

        chai.request(server).put('/rappels')
            .auth(token, { type: 'bearer' })
            .query({ id: ['234465465', '453564'] })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            }).end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs rappels avec des ids inexistants. -E", (done) => {

        chai.request(server).put('/rappels')
            .auth(token, { type: 'bearer' })
            .query({ id: ['66791cb82c6b5e01b4c1efd5', '66791cb82c6b5e01b4c1efd7'] })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            }).end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Modifier plusieurs rappels avec un champ requis vide. -E", (done) => {

        chai.request(server).put('/rappels').
            auth(token, { type: 'bearer' })
            .query({ id: _.map(rappels, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])
            })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs rappels sans être authentifier. -E", (done) => {

        chai.request(server).put('/rappels')

            .query({ id: _.map(rappels, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                titre: "Rappel",
                description: "Il est l'heure de vous lever",
                date: faker.defaultRefDate(30),
                frequence: faker.helpers.arrayElement([5, 10, 15]),
                statut: faker.helpers.arrayElement(["en attente", "completer"]),
                notifType: faker.helpers.arrayElement(["sms", "push"])

            }).end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})
describe("DELETE - /rappel", () => {
    it("Supprimer un rappel. - S", (done) => {

        chai.request(server).delete('/rappel/' + rappels[1]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("supprimer un rappel incorrect (avec un id inexistant). - E", (done) => {

        chai.request(server).delete('/rappel/665f18739d3e172be5daf092')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("supprimer un rappel incorrect (avec un id invalide). - E", (done) => {

        chai.request(server).delete('/rappel/123')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Supprimer un rappel sans être authentifier. - S", (done) => {

        chai.request(server).delete('/rappel/' + rappels[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("DELETE - /rappels", () => {

    it("Supprimer plusieurs rappels incorrects (avec un id inexistant). - E", (done) => {

        chai.request(server).delete('/rappels/66791a008843ab10ee8ad688&&66791a008843ab10ee8ad689')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Supprimer plusieurs rappels incorrects (avec un id invalide). - E", (done) => {

        chai.request(server).delete('/rappels').query({ id: ['123', '456'] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Supprimer plusieurs rappels. - S", (done) => {

        chai.request(server).delete('/rappels')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(rappels, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Supprimer plusieurs rappels sans être authentifier. - E", (done) => {

        chai.request(server).delete('/rappels')

            .query({ id: _.map(rappels, '_id') })
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