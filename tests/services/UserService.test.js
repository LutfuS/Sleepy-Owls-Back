const UserService = require("../../services/UserService");
const chai = require("chai");
let expect = chai.expect;
const _ = require("lodash");
var id_user_valid = "";
var tab_id_users = [];
var users = []


describe("addOneUser", () => {
    it("Utilisateur correct. - S", (done) => {
        var user = {

            email: "eduard.dupont@gmail.com",
            username: "edupot",
            password: "fggsdqge"
        };
        UserService.addOneUser(user, null, function (err, value) {
            expect(value).to.be.a("object");
            expect(value).to.haveOwnProperty("_id");
            id_user_valid = value._id;
            users.push(value)
            done();
        });
    });
    it("Utilisateur incorrect. (Sans email) - E", (done) => {
        var user_no_valid = {


            username: "eduqhqwegqehsg548pot",
            password: "fggsdqge"
        };
        UserService.addOneUser(user_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
            expect(err).to.haveOwnProperty("fields");
            expect(err["fields"]).to.haveOwnProperty("email");
            expect(err["fields"]["email"]).to.equal(
                "Path `email` is required."
            );

            done();
        });
    });
});

describe("addManyUsers", () => {
    it("Utilisateurs à ajouter, non valide. - E", (done) => {
        var users_tab_error = [
            {

                email: "edouard.dupont2@gmail.com",
                username: "edupont1",
                password: "fggsdqge"
            },
            {

                email: "edouard.dupon2t@gmail.com",
                username: "",
                password: "fggsdqge",
                testing: true,

            },
            {

                email: "edouard.dupont3@gmail.com",
                username: "edupont3",
                password: "fggsdqge",
                testing: true,

            },
            {

                email: "edouard.dupont4@gmail.com",
                password: "fggsdqge"
            },
        ];

        UserService.addManyUsers(users_tab_error, null, function (err, value) {
            expect(err).to.exist;
            done();
        });
    });
    it("Utilisateurs à ajouter, valide. - S", (done) => {
        var users_tab = [
            {

                email: "edouard.dupont7@gmail.com",
                username: "edupont7",
                password: "fggsdqge"
            },
            {

                email: "edouard.dupont8@gmail.com",
                username: "La8",
                password: "fggsdqge",
                testing: true,

            },
            {

                email: "edouard.dupont9@gmail.com",
                username: "edupont10",
                password: "fggsdqge",
                testing: true,

            },
        ];

        UserService.addManyUsers(users_tab, null, function (err, value) {
            tab_id_users = _.map(value, "_id");
            users = [...value, ...users]
            expect(value).to.have.lengthOf(3);
            done();
        });
    });
});
describe("findOneUser", () => {
    it("Chercher un utilisateur par les champs selectionnées -S.", (done) => {
        UserService.findOneUser(["email", "username"], users[0].username, null, function (err, value) {
            expect(value).to.haveOwnProperty('password')
            done()
        })
    })
    it("Chercher un utilisateur avec un champ non autorisé -E.", (done) => {
        UserService.findOneUser(["email", "firstName"], users[0].username, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un utilisateur sans tableau de champ -E.", (done) => {
        UserService.findOneUser("username", users[0].username, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un utilisateur inexistant -E.", (done) => {
        UserService.findOneUser(["email"], "users[0].username", null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })

})

describe("findOneUserById", () => {
    it("Chercher un utilisateur existant correct. - S", (done) => {
        UserService.findOneUserById(id_user_valid, null, function (err, value) {
            expect(value).to.be.a("object");
            expect(value).to.haveOwnProperty("_id");
            expect(value).to.haveOwnProperty("email");
            done();
        });
    });
    it("Chercher un utilisateur non-existant correct. - E", (done) => {
        UserService.findOneUserById("100", null, function (err, value) {
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err["type_error"]).to.equal("no-valid");
            done();
        });
    });
});


describe("findManyUsersById", () => {
    it("Chercher des utilisateurs existant correct. - S", (done) => {
        UserService.findManyUsersById(tab_id_users, null, function (err, value) {
            expect(value).to.have.lengthOf(3);
            done();
        });
    });
});

describe("updateOneUser", () => {
    it("Modifier un utilisateur correct. - S", (done) => {
        UserService.updateOneUser(
            id_user_valid,
            {
                email: "edouard.dupont11@gmail.com",
                username: "edupont11",
                password: "eqfdf"
            },
            null, function (err, value) {
                expect(value).to.be.a("object");
                expect(value).to.haveOwnProperty("_id");
                expect(value).to.haveOwnProperty("email");
                expect(value).to.haveOwnProperty("username");
                expect(value["email"]).to.be.equal("edouard.dupont11@gmail.com");
                expect(value["username"]).to.be.equal("edupont11");
                done();
            }
        );
    });
    it("Modifier un utilisateur avec id incorrect. - E", (done) => {
        UserService.updateOneUser(
            "1200",
            {
                email: "edouard.dupont7@gmail.com",
                username: "edupont7"
            },
            null, function (err, value) {
                expect(err).to.be.a("object");
                expect(err).to.haveOwnProperty("msg");
                expect(err).to.haveOwnProperty("type_error");
                expect(err["type_error"]).to.be.equal("no-valid");
                done();
            }
        );
    });
    it("Modifier un utilisateur avec des champs requis vide. - E", (done) => {
        UserService.updateOneUser(
            id_user_valid,
            {
                email: "",
                username: "edupont7"
            },
            null, function (err, value) {
                expect(value).to.be.undefined;
                expect(err).to.haveOwnProperty("msg");
                expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
                expect(err).to.haveOwnProperty("fields");
                expect(err["fields"]).to.haveOwnProperty("email");
                expect(err["fields"]["email"]).to.equal(
                    "Path `email` is required."
                );
                done();
            }
        );
    });
});

// describe("updateManyUsers", () => {
//     it("Modifier plusieurs utilisateurs correctement. - S", (done) => {
//         UserService.updateManyUsers(
//             tab_id_users,
//             {
//                 email: "john",
//                 username: "john",

//             },
//             null, function (err, value) {
//                 console.log(err, value)
//                 expect(value).to.haveOwnProperty("modifiedCount");
//                 expect(value).to.haveOwnProperty("matchedCount");
//                 expect(value["matchedCount"]).to.be.equal(tab_id_users.length);
//                 expect(value["modifiedCount"]).to.be.equal(tab_id_users.length);
//                 done();
//             }
//         );
//     });
//     it("Modifier plusieurs utilisateurs avec id incorrect. - E", (done) => {
//         UserService.updateManyUsers(
//             "1200",
//             {
//                 email: "edouard.dupont7@gmail.com",
//                 username: "edupont7"
//             },
//             null, function (err, value) {
//                 expect(err).to.be.a("object");
//                 expect(err).to.haveOwnProperty("msg");
//                 expect(err).to.haveOwnProperty("type_error");
//                 expect(err["type_error"]).to.be.equal("no-valid");
//                 done();
//             }
//         );
//     });
//     it("Modifier plusieurs utilisateurs avec des champs requis vide. - E", (done) => {
//         UserService.updateManyUsers(
//             tab_id_users,
//             {
//                 email: "",
//                 username: "edupont7"
//             },
//             null, function (err, value) {
//                 expect(value).to.be.undefined;
//                 expect(err).to.haveOwnProperty("msg");
//                 expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
//                 expect(err).to.haveOwnProperty("fields");
//                 expect(err["fields"]).to.haveOwnProperty("email");
//                 expect(err["fields"]["email"]).to.equal(
//                     "Path `email` is required."
//                 );
//                 done();
//             }
//         );
//     });
// });

describe("deleteOneUser", () => {
    it("Supprimer un utilisateur correct. - S", (done) => {
        UserService.deleteOneUser(id_user_valid, null, function (err, value) {
            expect(value).to.be.a("object");
            expect(value).to.haveOwnProperty("_id");
            expect(value).to.haveOwnProperty("email");
            expect(value).to.haveOwnProperty("username");
            done();
        });
    });
    it("Supprimer un utilisateur avec id incorrect. - E", (done) => {
        UserService.deleteOneUser("1200", null, function (err, value) {
            expect(err).to.be.a("object");
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err["type_error"]).to.be.equal("no-valid");
            done();
        });
    });
    it("Supprimer un utilisateur avec un id inexistant. - E", (done) => {
        UserService.deleteOneUser(
            "665f18739d3e172be5daf092",
            null, function (err, value) {
                expect(err).to.be.a("object");
                expect(err).to.haveOwnProperty("msg");
                expect(err).to.haveOwnProperty("type_error");
                expect(err["type_error"]).to.be.equal("no-found");
                done();
            }
        );
    });
});

describe("deleteManyUsers", () => {
    it("Supprimer plusieurs utilisateurs avec id incorrect. - E", (done) => {
        UserService.deleteManyUsers("1200", null, function (err, value) {
            expect(err).to.be.a("object");
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err["type_error"]).to.be.equal("no-valid");
            done();
        });
    });
    it("Supprimer plusieurs utilisateurs correctement. - S", (done) => {
        UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
            expect(value).to.be.a("object");
            expect(value).to.haveOwnProperty("deletedCount");
            expect(value["deletedCount"]).is.equal(tab_id_users.length);
            done();
        });
    });
});
