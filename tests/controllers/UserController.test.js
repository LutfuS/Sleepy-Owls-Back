const UserService = require("../../services/UserService")
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')
chai.use(chaiHttp)
var users = []
var user = null
var token = ""



describe("POST - /user", () => {
    it("Ajouter un utilisateur. - S", (done) => {
        chai.request(server).post('/user').send({

            password: "fggsdqge",
            email: "johnu.us@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true
        }).end((err, res) => {
            expect(res).to.have.status(201)
            user = res.body
            //  users.push(res.body)
            done()
        });
    })
    it("Ajouter un utilisateur incorrect. (Sans email) - E", (done) => {
        chai.request(server).post('/user').send({



            password: "fggsdqge",
            personnel_consentement: true,
            alarme_vibration: false,
            conseil_statut: true
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un email existant) - E", (done) => {
        chai.request(server).post('/user').send({


            password: "fggsdqge",
            email: "johnu.us@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true,
        }).end((err, res) => {
            expect(res).to.have.status(405)

            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/user').send({


            password: "fggsdqge",
            email: "",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})
describe("POST - /users", () => {
    it("Ajouter des utilisateurs correct. - S", (done) => {
        chai.request(server).post('/users').send([
            {


                email: "aurebjfiol.mosini@gmail.com",
                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true
            },
            {


                email: "alexgiluhgandre.porteron@gmail.com",
                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true
            },
            {


                email: "Gege25@gmail.com",
                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true
            },
            {


                email: "ElPointeron25@gmail.com",
                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true
            }


        ]).end((err, res) => {
            users = [...users, ...res.body]
            // console.log(tab_id_users)
            expect(res).to.have.status(201)
            done()
        });
    })
    it("Ajouter des utilisateurs incorrect. (Sans email) - E", (done) => {
        chai.request(server).post('/users').send([
            {



                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true
            },
            {



                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        });
    })
    it("Ajouter des utilisateurs incorrect. (Avec un email existant) - E", (done) => {
        chai.request(server).post('/users').send([
            {


                email: "aurebjfiol.mosini@gmail.com",
                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true,
            },
            {


                email: "alexgiluandre.porteron@gmail.com",
                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        });
    })
    it("Ajouter des utilisateurs incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/users').send([
            {


                email: "",
                password: "fggsdqge",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true,
            },
            {


                email: "alexandre.porteron@gmail.com",
                password: "",
                personnel_consentement: true,
                alarme_vibration: true,
                conseil_statut: true,
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        });
    })
})



describe("POST -/login", () => {
    it("Authentifier un utilisateur correctement. -S", (done) => {
        chai.request(server).post('/login').send({

            password: "fggsdqge",
            email: "johnu.us@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true

        }).end((err, res) => {
            res.should.have.status(200)

            token = res.body.token
            // console.log(res, res)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec password incorrect)", (done) => {
        chai.request(server).post('/login').send({

            password: "fggsdq<hrge",
            email: "johnds<vu.uszsvqsvs@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true,

        }).end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Authentifier un utilisateur incorrect. -E(avec email incorrect)", (done) => {
        chai.request(server).post('/login').send({

            password: "fggsdqge",
            email: "johrseg(enu.us@gmail.com",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true

        }).end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
})


describe("GET -/user", () => {
    it("Chercher un utilisateur par les champs selectionnées -S", (done) => {
        chai.request(server).get('/user').auth(token, { type: 'bearer' }).query({ fields: ["email"], value: users[0].email })

            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Chercher un utilisateur avec un champ non autorisé -E", (done) => {
        chai.request(server).get('/user').auth(token, { type: 'bearer' })
            .query({ fields: "firstName", value: users[0].email })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un utilisateur sans aucunes query -E", (done) => {
        chai.request(server).get('/user/').auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un utilisateur inexistant -E", (done) => {
        chai.request(server).get('/user').auth(token, { type: 'bearer' })
            .query({ fields: ["email"], value: ["MathisleMoche"] })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un utilisateur sans authentification( par les champs sélectionnés) -E", (done) => {
        chai.request(server).get('/user')
            .query({ fields: ["email"], value: ["MathisleMoche"] })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})



describe("GET/:id - /user", () => {
    it("Chercher un utilisateur existant correct. - S", (done) => {
        chai.request(server).get('/user/' + users[0]._id)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                // console.log(token, { type: 'bearer' })
                done()
            })
    })
    it("Chercher un utilisateur non valide. - E", (done) => {

        chai.request(server).get('/user/' + "15572")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Chercher un utilisateur avec un id valide inexistant. - E", (done) => {

        chai.request(server).get("/user" + "66791cb82c6b5e01b4c1efd3")
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Chercher un utilisateur existant correct sans être authentifier. - E", (done) => {
        chai.request(server).get('/user/' + users[0]._id)

            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

})



describe("GET - /users_by_filters", () => {
    it("Chercher plusieurs utilisateurs. - S", (done) => {

        chai.request(server).get('/users_by_filters')
            .auth(token, { type: 'bearer' })
            .query({ page: 1, pageSize: 2 })
            .end((err, res) => {
                res.should.have.status(200)
                expect(res.body.results).to.be.an('array')

                done()
            })
    })
    it("Chercher plusieurs utilisateurs avec une query vide - S", (done) => {
        chai.request(server).get('/users_by_filters')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)

                done()
            })
    })
    it("Chercher plusieurs utilisateurs avec une query contenant une chaine de caractère - S", (done) => {
        chai.request(server).get('/users_by_filters')
            .auth(token, { type: 'bearer' })
            .query({ page: 1, pageSize: 2, q: 'lu' })
            .end((err, res) => {
                res.should.have.status(200)

                done()
            })
    })
    it("Chercher plusieurs utilisateurs avec une chaine de caractères dans page - E", (done) => {
        chai.request(server).get('/users_by_filters')
            .auth(token, { type: 'bearer' })
            .query({ page: 'une phrase', pageSize: 2 })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })

    })
    it("Chercher plusieurs utilisateurs sans être authentifier. - E", (done) => {

        chai.request(server).get('/users_by_filters')
            .query({ page: 1, pageSize: 2 })
            .end((err, res) => {
                res.should.have.status(401)
                // expect(res.body.results).to.be.an('array')

                done()
            })
    })
})


describe("PUT - /user", () => {
    it("Modifier un utilisateur correct. - S", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({

            email: "aurel.mosin1i@gmail.com",
            password: "fggsdqge",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true
        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("Modifier un utilisateur avec id incorrect. - E", (done) => {
        chai.request(server).put('/user/1654645').send({

            email: "aurel.mosini@gmail.com",
            password: "fggsdqge",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true,

        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un utilisateur avec id introuvable. - E", (done) => {
        chai.request(server).put('/user/66791cb82c6b5e01b4c1efd3').send({

            email: "aurel.mosini@gmail.com",
            password: "fggsdqge",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true
        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it("Modifier les paramètres d'un user. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({

            email: "aurel.mosini@gmail.com",
            password: "fggsdqge",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: false,
        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it("Modifier un utilisateur avec des champs requis vide. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({

            email: "",
            password: "fggsdqge",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true
        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un utilisateur avec champ unique existant. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({
            email: users[1].email
        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
    it("Modifier un utilisateur correct sans être authentifier. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({

            email: "aurel.mosini@gmail.com",
            password: "fggsdqge",
            personnel_consentement: true,
            alarme_vibration: true,
            conseil_statut: true
        })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
});
describe("PUT -/users", () => {
    it("Modifier plusieurs utilisateurs. -S", (done) => {
        chai.request(server).put('/users').query({ id: _.map(users, '_id') }).send({



            alarme_vibration: false,


        },



        ).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)


                done()
            })
    })
    it("Modifier plusieurs utilisateurs avec des id invalide. -E", (done) => {
        chai.request(server).put('/users').query({ id: ['234465465', '453564'] }).send({
            email: "aurel.mosini@gmail.com",

        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs utilisateurs avec des ids inexistants. -E", (done) => {
        chai.request(server).put('/users').query({ id: ['669f7f28cb2c096dea69b7b5', '66a8a9b72ade60f624c70d41'] }).send({
            alarme_vibration: false,

        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                // console.log(err)
                done()
            })
    })
    it("Modifier plusieurs utilisateurs avec un champ requis vide. -E", (done) => {
        chai.request(server).put('/users').query({ id: _.map(users, '_id') }).send({
            password: ""
        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs utilisateurs avec un champ unique existant. -E", (done) => {
        chai.request(server).put('/users').query({ id: _.map(users, '_id') }).send({
            email: users[0].email
        }).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
    it("Modifier plusieurs utilisateurs sans être authentifier. -E", (done) => {
        chai.request(server).put('/users').query({ id: _.map(users, '_id') }).send({
            email: "aurel.mosinyti@gmail.com",
        })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
})

describe("DELETE - /users", () => {


    it("Supprimer plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/users').auth(token, { type: 'bearer' }).query({ id: ['123', '456'] })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })

    it("Supprimer plusieurs utilisateurs sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/users')
            .query({ id: _.map(users, '_id') })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

    it("Supprimer plusieurs utilisateurs. - S", (done) => {
        chai.request(server).delete('/users')
            .auth(token, { type: 'bearer' }).query({ id: _.map(users, '_id') })
            .end((err, res) => {
                //  console.log(_.map(users, '_id'))
                res.should.have.status(200)
                done()
            })
    })
})


describe("DELETE - /user", () => {

    it("Supprimer un utilisateur incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/user/665f18739d3e172be5daf092').auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Supprimer un utilisateur incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/user/123').auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })

    it("Supprimer un utilisateur sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/user/' + users[1]._id)
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
    it("Supprimer un utilisateur. - S", (done) => {
        chai.request(server).delete('/user/' + user._id).auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})