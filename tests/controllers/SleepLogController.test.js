const UserService = require('../../services/UserService')
const SleepLogService = require('../../services/SleepLogService')
const RecordService = require('../../services/RecordService')
const { faker } = require('@faker-js/faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../../server')
let should = chai.should();
const _ = require('lodash')

chai.use(chaiHttp)
var sleepLogs = []
var tab_id_users = []
var token = ""

const logDate = faker.defaultRefDate(30);
const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
const rating = faker.number.int({ min: 1, max: 5 })

const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
const sleepStart = faker.defaultRefDate(30);
const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

let users = [
    {
        firstName: "luf",
        lastName: "Us",
        username: "dwarf1554Slayer",
        email: "lutfu.usxwx@gmail.com",
        password: "fggsdqge"
    },

    {
        firstName: "lulu",
        lastName: "brg",
        username: "maidenle57545ss",
        email: "maidenxwxwless@gmail.com",
        password: "fggsdqge"
    },
    {
        firstName: "lgfnuf",
        lastName: "Udhngsdh",
        username: "dwargfjdnfSlgff313bayer",
        email: "lutgfdnfhfgxwx.us@gmail.com",
        password: "fggsdqge"
    },

    {
        firstName: "ldfxbfulu",
        lastName: "bbfcxrg",
        username: "mashfbidenl3344ess",
        email: "maideshfbvnlsqsqsxwess@gmail.com",
        password: "fggsdqge"
    }
]

describe("Gestion des utilisateurs.", () => {

    it("Création de users", (done => {
        UserService.addManyUsers(users, null, function (err, value) {
            console.log(err, value)
            tab_id_users = _.map(value, '_id')

            done()
        })

    }))

})

function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

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
        RecordService.createManyRecords(sleepData, null, function (err, value) {
            console.log(err, value);
            done();
        });
    });
});


describe("POST -/login", () => {
    it("Authentifier un utilisateur correctement. -S", (done) => {
        chai.request(server).post('/login').send({
            username: "dwarf1554Slayer",
            password: "fggsdqge",
            email: "johnu.us@gmail.com"


        }).end((err, res) => {
            res.should.have.status(200)
            token = res.body.token
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec email incorrect)", (done) => {
        chai.request(server).post('/login').send({
            username: "john",
            password: "fggsdqge",
            email: "johqgenu.us@gmail.com"


        }).end((err, res) => {
            res.should.have.status(401)

            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec username incorrect)", (done) => {
        chai.request(server).post('/login').send({
            username: "jozsgsetghn",
            password: "fggsdqge",
            email: "johnu.us@gmail.com"


        }).end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
})










describe("POST - /sleepLog", () => {
    it("Créer un sleepLog. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLog')

            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            })
            .end((err, res) => {

                expect(res).to.have.status(201)
                sleepLogs.push(res.body)
                done()
            });
    })
    it("Ajouter un sleepLog incorrect. (Sans user_id) - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLog')

            .auth(token, { type: 'bearer' })
            .send({

                logDate,
                note,
                rating,



            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })

    it("Ajouter un sleepLog incorrect. (Avec un champ vide) - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement([""])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLog')

            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })
    it("Ajouter un sleepLog. (sans être authentifier) - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLog')


            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            }).end((err, res) => {
                expect(res).to.have.status(401)
                done()
            })
    })

})


describe("POST - /sleepLogs", () => {
    it("Créer des sleepLogs correct. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLogs')

            .auth(token, { type: 'bearer' })
            .send([
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


                }
            ]).end((err, res) => {
                sleepLogs = [...sleepLogs, ...res.body]
                expect(res).to.have.status(201)
                done()
            });
    })
    it("Ajouter des sleepLogs incorrect. (user_id) - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLogs')

            .auth(token, { type: 'bearer' })
            .send([
                {

                    logDate,
                    note,
                    rating,

                },
                {



                    logDate,
                    note,
                    rating,

                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })

    it("Ajouter des sleepLogs incorrect. (Avec un champ vide) - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement([""])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLogs')

            .auth(token, { type: 'bearer' })
            .send([
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

                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })
    it("Ajouter un sleepLog. (sans être authentifier) - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).post('/sleepLog')


            .send([{
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            }
            ]
            ).end((err, res) => {
                expect(res).to.have.status(401)
                done()
            })
    })

})


describe("GET -/sleepLog", () => {
    it("Chercher un sleepLog par les champs selectionnées -S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })

        chai.request(server).get('/sleepLog')
            .auth(token, { type: 'bearer' })
            .query({ fields: ["user_id"], value: sleepLogs[0].user_id })

            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher un sleepLog avec un champ non autorisé -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLog')
            .auth(token, { type: 'bearer' })
            .query({ fields: "ajy", value: sleepLogs[0].user_id })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un sleepLog sans aucunes query -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLog/')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un sleepLog inexistant -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLog').query({ fields: ["note"], value: ["MathisleMoche"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un sleepLog par les champs selectionnées sans être authentifier -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })

        chai.request(server).get('/sleepLog')

            .query({ fields: ["user_id"], value: sleepLogs[0].user_id })

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /sleepLogs", () => {
    it("Chercher plusieurs sleepLogs valides. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLogs')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(sleepLogs, '_id') })
            .end((err, res) => {

                res.should.have.status(200)

                done()
            })
    })
    it("Chercher plusieurs sleepLogs avec id invalide. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })

        chai.request(server).get('/sleepLogs')
            .query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs sleepLogs non trouvé. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })

        chai.request(server).get('/sleepLogs').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs sleepLogs valides sans être authentifier. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLogs')
            .query({ id: _.map(sleepLogs, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("GET - /sleepLog/:id", () => {
    it("Chercher un sleepLog existant correct par id. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLog/' + sleepLogs[0]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher un sleepLog non valide par id invalide. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLog/' + "15572")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un sleepLog avec un id valide inexistant. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })

        chai.request(server).get("/sleepLog" + "66791cb82c6b5e01b4c1efd3")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un  sleepLog existant correct par id sans être authentifier. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLog/' + sleepLogs[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /sleepLogs/:id", () => {
    it("Chercher plusieurs sleepLogs by id valides. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLogs')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(sleepLogs, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher plusieurs sleepLogs avec id invalide. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })

        chai.request(server).get('/sleepLogs').query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs sleepLogs non trouvé. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })

        chai.request(server).get('/sleepLogs').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs sleepLogs valides sans être authentifier. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).get('/sleepLogs')
            .query({ id: _.map(sleepLogs, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

})



describe("PUT - /sleepLog", () => {
    it("Modifier un sleepLog correct. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLog/' + sleepLogs[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("Modifier un sleeLog avec id incorrect. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLog/1654645').auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un sleepLog avec id introuvable. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLog/66791cb82c6b5e01b4c1efd3').auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it("Modifier un sleepLog avec des champs requis vide. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLog/' + sleepLogs[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note: "",
                rating,

            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un sleepLog correct sans être authentifier. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLog/' + sleepLogs[0]._id)
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

});
describe("PUT -/sleepLogs", () => {
    it("Modifier plusieurs sleepLogs. -S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLogs')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(sleepLogs, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,
            }).end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Modifier plusieurs sleepLogs avec des id invalide. -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLogs')
            .auth(token, { type: 'bearer' })
            .query({ id: ['234465465', '453564'] })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            }).end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs sleepLogs avec des ids inexistants. -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLogs')
            .auth(token, { type: 'bearer' })
            .query({ id: ['66791cb82c6b5e01b4c1efd5', '66791cb82c6b5e01b4c1efd7'] })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,

            }).end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Modifier plusieurs sleepLogs avec un champ requis vide. -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLogs').
            auth(token, { type: 'bearer' })
            .query({ id: _.map(sleepLogs, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note: "",
                rating,
            })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs sleepLogs sans être authentifier. -E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).put('/sleepLogs')

            .query({ id: _.map(sleepLogs, '_id') })
            .send({
                user_id: rdm_user(tab_id_users),
                logDate,
                note,
                rating,


            }).end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("DELETE - /sleepLogs", () => {

    it("Supprimer plusieurs sleepLog incorrects (avec un id inexistant). - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLog/66791a008843ab10ee8ad688', "66791a008843ab10ee8ad689")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Supprimer plusieurs sleepLogs incorrects (avec un id invalide). - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLogs').query({ id: ['1235wgbd74&&451wdbd176', "jcdrtujrt55"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                console.log(err)
                done()
            })
    })
    it("Supprimer plusieurs sleepLogs. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLogs')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(sleepLogs, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                // console.log({ id: _.map(sleepLogs, '_id') })
                done()
            })
    })
    it("Supprimer plusieurs sleepLogs sans être authentifier. - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLogs')

            .query({ id: _.map(sleepLogs, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("DELETE - /sleepLog", () => {
    it("Supprimer un sleepLog. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLog/' + sleepLogs[0]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                // res.should.have.status(200)
                console.log(err)
                done()
            })
    })
    it("supprimer un sleepLog incorrect (avec un id inexistant). - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLog/665f18739d3e172be5daf092')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("supprimer un sleepLog incorrect (avec un id invalide). - E", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLog/123')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Supprimer un sleepLog sans être authentifier. - S", (done) => {
        const logDate = faker.defaultRefDate(30);
        const note = faker.helpers.arrayElement(["Je suis parti dormir tard hier", "J'ai eu du mal à m'endormir", "J'ai eu une bonne nuit de sommeil", "J'ai eu plusieurs paralysie du sommeil cette nuit"])
        const rating = faker.number.int({ min: 1, max: 5 })
        chai.request(server).delete('/sleepLog/' + sleepLogs[0]._id)

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