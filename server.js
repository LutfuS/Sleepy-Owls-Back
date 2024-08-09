//Import des librairies
const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const Config = require("./config");
const Logger = require("./utils/logger").pino;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuration Swagger
const swaggerOptions = require('./swagger.json');
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// app.use('/api-docs', swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs));
//Création de notre application express.js
const app = express();
//Déclaration du middlewares à express

app.use(bodyParser.json());
// demarrage de la database
require("./utils/database");
/*Ajout de module de login */
const passport = require('./utils/passport')
/* Passport init */
var session = require('express-session')

app.use(session({
  secret: Config.secret_cookie,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


app.use(passport.initialize())
app.use(passport.session())

// Déclaration des controller pour utilisateurs
const UserController = require("./controllers/UserController");
const RecordController = require("./controllers/RecordController")
const SleepLogController = require("./controllers/SleepLogController")

// Déclaration des middleware
const DataBaseMiddleWare = require("./middlewares/database");
const LoggerMiddleware = require('./middlewares/logger')
//Déclaration des middleware à express
app.use(bodyParser.json(), LoggerMiddleware.addLogger)
/*--------------Création des routes -----------------*/
// Création du endpoint / login pour connecter un utilisateur
app.post('/login', DataBaseMiddleWare.CheckConnexion, UserController.loginUser)


//Création endpoint/ user pour l'ajout d'un utilisateur
app.post("/user", DataBaseMiddleWare.CheckConnexion, UserController.AddOneUser);

app.post("/users", DataBaseMiddleWare.CheckConnexion, UserController.AddManydUser);

app.get("/user/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUserById);

// app.get("/users", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findManyUsers);

// Création du endpoint /users_by_filters pour la récupération de plusieurs utilisateurs
app.get('/users_by_filters', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findManyUsers)

app.put("/user/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.UpdateOneUser);

app.put("/users", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.UpdateManyUser);

app.delete("/user/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.DeleteOneUser);

app.delete("/users", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.deleteManyUsers);

app.get("/user", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUser)



// Création des endpoint pour les records
app.get("/generateData/:id", RecordController.generateData)

app.post("/record", DataBaseMiddleWare.CheckConnexion, RecordController.createOneRecord);

app.post("/records", DataBaseMiddleWare.CheckConnexion, RecordController.createManyRecords);

app.get("/record/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.findOneRecordById);

app.get('/records_by_filters', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.findManyRecords)

app.get('/records', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.findManyRecordsById)

app.put("/record/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.updateOneRecord);

app.put("/records", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.updateManyRecords);

app.delete("/record/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.deleteOneRecord);

app.delete("/records", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.deleteManyRecords);

app.get("/record", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RecordController.findOneRecord)


// Création des endpoint pour les sleepLog


app.post("/sleepLog", DataBaseMiddleWare.CheckConnexion, SleepLogController.createOneSleepLog);

app.post("/sleepLogs", DataBaseMiddleWare.CheckConnexion, SleepLogController.createManySleepLogs);

app.get("/sleepLog/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findOneSleepLogById);

app.get('/sleepLogs_by_filters', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findManySleepLogs)

app.get('/sleepLogs', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findManySleepLogsById)

app.put("/sleepLog/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.updateOneSleepLog);

app.put("/sleepLogs", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.updateManySleepLogs);

app.delete("/sleepLog/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.deleteOneSleepLog);

app.delete("/sleepLog", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.deleteManySleepLogs);

app.get("/sleepLog", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findOneSleepLog)


// 2e chose à faire : Créer le server avec app.listen
app.listen(Config.port, () => {
  Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

// Logout
app.post('/logout', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.logoutUser)
module.exports = app
