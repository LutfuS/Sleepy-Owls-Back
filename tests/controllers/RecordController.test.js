const UserService = require('../../services/UserService')
const RecordService = require('../../services/RecordService')
const { faker } = require('@faker-js/faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')

chai.use(chaiHttp)
var records = []
var tab_id_users = []
var token = ""


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
describe("POST -/login", () => {
    it("Authentifier un utilisateur correctement. -S", (done) => {
        chai.request(server).post('/login').send({
            username: "dwarf1554Slayer",
            password: "fggsdqge",
            email: "johnu.us@gmail.com"

        }).end((err, res) => {
            res.should.have.status(200)

            token = res.body.token
            // console.log(res.body.token)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec password incorrect)", (done) => {
        chai.request(server).post('/login').send({
            username: "john",
            password: "fggsdq<hrge",
            email: "johnds<vu.uszsvqsvs@gmail.com"

        }).end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec username incorrect)", (done) => {
        chai.request(server).post('/login').send({
            username: "johzeqfcdcqn",
            password: "fggsdqge",
            email: "johnu.us@gmail.com"

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
        RecordService.createManyRecords(sleepData, null, function (err, value) {
            //    console.log(err, value);
            done();
        });
    });
});










describe("POST - /record", () => {
    it("Créer un record. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).post('/record')

            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)

            })
            .end((err, res) => {

                expect(res).to.have.status(201)
                records.push(res.body)
                done()
            });
    })
    it("Ajouter un record incorrect. (Sans user_id) - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).post('/record')

            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),



            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })

    it("Ajouter un record incorrect. (Avec un champ vide) - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).post('/record')

            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement([""]),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)

            }).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            })
    })

})


describe("POST - /records", () => {
    it("Créer des records correct. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).post('/records')

            .send([
                {
                    sleepStart,
                    sleepEnd,
                    sleepDuration,
                    sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                    sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                    user_id: rdm_user(tab_id_users)

                },
                {
                    sleepStart,
                    sleepEnd,
                    sleepDuration,
                    sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                    sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                    user_id: rdm_user(tab_id_users)


                }
            ]).end((err, res) => {
                records = [...records, ...res.body]
                expect(res).to.have.status(201)
                done()
            });
    })
    it("Ajouter des records incorrect. (user_id) - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).post('/records')
            .send([
                {
                    sleepStart,
                    sleepEnd,
                    sleepDuration,
                    sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                    sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),


                },
                {


                    sleepStart,
                    sleepEnd,
                    sleepDuration,
                    sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                    sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),


                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })

    it("Ajouter des records incorrect. (Avec un champ vide) - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).post('/records')

            .send([
                {
                    sleepStart,
                    sleepEnd,
                    sleepDuration,
                    sleepQuality: faker.helpers.arrayElement([""]),
                    sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                    user_id: rdm_user(tab_id_users)


                },
                {
                    sleepStart,
                    sleepEnd,
                    sleepDuration,
                    sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                    sleepSound: faker.helpers.arrayElement([""]),
                    user_id: rdm_user(tab_id_users)

                }
            ]).end((err, res) => {
                expect(res).to.have.status(405)
                done()
            });
    })

})






describe("GET -/record", () => {
    it("Chercher un record par les champs selectionnées -S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

        chai.request(server).get('/record')
            .auth(token, { type: 'bearer' })
            .query({ fields: ["user_id"], value: records[0].user_id })

            .end((err, res) => {
                console.log(token)
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher un record avec un champ non autorisé -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/record')
            .auth(token, { type: 'bearer' })
            .query({ fields: "ajy", value: records[0].user_id })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un record sans aucunes query -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/record/')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un record inexistant -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/record').query({ fields: ["sleepQuality"], value: ["MathisleMoche"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un record par les champs selectionnées sans être authentifier -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

        chai.request(server).get('/record')

            .query({ fields: ["user_id"], value: records[0].user_id })

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /records", () => {
    it("Chercher plusieurs records valides. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/records')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(records, '_id') })
            .end((err, res) => {

                res.should.have.status(200)

                done()
            })
    })
    it("Chercher plusieurs records avec id invalide. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

        chai.request(server).get('/records')
            .query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs records non trouvé. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

        chai.request(server).get('/records').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs records valides sans être authentifier. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/records')
            .query({ id: _.map(records, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("GET - /record/:id", () => {
    it("Chercher un record existant correct par id. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/record/' + records[0]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher un record non valide par id invalide. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/record/' + "15572")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un record avec un id valide inexistant. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

        chai.request(server).get("/record" + "66791cb82c6b5e01b4c1efd3")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un record existant correct par id sans être authentifier. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/record/' + records[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("GET - /records/:id", () => {
    it("Chercher plusieurs records valides. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/records')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(records, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher plusieurs records avec id invalide. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

        chai.request(server).get('/records').query({ id: ["12313435", "132135464"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher plusieurs records non trouvé. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);

        chai.request(server).get('/records').query({ id: ["66791cb82c6b5e01b4c1efd3", "66791cb82c6b5e01b4c1efd4"] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher plusieurs records valides sans être authentifier. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).get('/records')
            .query({ id: _.map(records, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

})



describe("PUT - /record", () => {
    it("Modifier un record correct. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/record/' + records[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("Modifier un record avec id incorrect. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/record/1654645').auth(token, { type: 'bearer' })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)
            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un record avec id introuvable. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/record/66791cb82c6b5e01b4c1efd3').auth(token, { type: 'bearer' })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)
            })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it("Modifier un record avec des champs requis vide. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/record/' + records[0]._id)
            .auth(token, { type: 'bearer' })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement([""]),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)

            })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un record correct sans être authentifier. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/record/' + records[0]._id)
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)
            })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

});
describe("PUT -/records", () => {
    it("Modifier plusieurs records. -S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/records')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(records, '_id') })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in seep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)

            }).end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Modifier plusieurs records avec des id invalide. -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/records')
            .auth(token, { type: 'bearer' })
            .query({ id: ['234465465', '453564'] })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)
            }).end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs records avec des ids inexistants. -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/records')
            .auth(token, { type: 'bearer' })
            .query({ id: ['66791cb82c6b5e01b4c1efd5', '66791cb82c6b5e01b4c1efd7'] })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)
            }).end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Modifier plusieurs records avec un champ requis vide. -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/records').
            auth(token, { type: 'bearer' })
            .query({ id: _.map(records, '_id') })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement([""]),
                user_id: rdm_user(tab_id_users)
            })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs records sans être authentifier. -E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).put('/records')

            .query({ id: _.map(records, '_id') })
            .send({
                sleepStart,
                sleepEnd,
                sleepDuration,
                sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
                sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night']),
                user_id: rdm_user(tab_id_users)

            }).end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})
describe("DELETE - /record", () => {
    it("Supprimer un record. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/record/' + records[1]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("supprimer un record incorrect (avec un id inexistant). - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/record/665f18739d3e172be5daf092')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("supprimer un record incorrect (avec un id invalide). - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/record/123')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Supprimer un record sans être authentifier. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/record/' + records[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("DELETE - /records", () => {

    it("Supprimer plusieurs records incorrects (avec un id inexistant). - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/records/66791a008843ab10ee8ad688&&66791a008843ab10ee8ad689')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Supprimer plusieurs records incorrects (avec un id invalide). - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/records').query({ id: ['123', '456'] })
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Supprimer plusieurs records. - S", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/records')
            .auth(token, { type: 'bearer' })
            .query({ id: _.map(records, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Supprimer plusieurs records sans être authentifier. - E", (done) => {
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        chai.request(server).delete('/records')

            .query({ id: _.map(records, '_id') })
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