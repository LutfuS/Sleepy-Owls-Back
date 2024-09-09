//Import des librairies
const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const Config = require("./config");
const Logger = require("./utils/logger").pino;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')

// Configuration Swagger
const swaggerOptions = require('./swagger.json');
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// app.use('/api-docs', swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs));
//Création de notre application express.js
const app = express();

app.use(cors())
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

//Sert les fichiers statiques depuis le dossier public
app.use(express.static('public'));

// Déclaration des controller pour utilisateurs
const UserController = require("./controllers/UserController");

const SleepLogController = require("./controllers/SleepLogController")
const NotificationController = require("./controllers/NotificationController")
const RappelController = require("./controllers/RappelController")

// Déclaration des middleware
const DataBaseMiddleWare = require("./middlewares/database");
const LoggerMiddleware = require('./middlewares/logger')
//Déclaration des middleware à express
app.use(bodyParser.json(), LoggerMiddleware.addLogger)
/*--------------Création des routes -----------------*/
// Création du endpoint / login pour connecter un utilisateur
app.post('/login', DataBaseMiddleWare.CheckConnexion, UserController.loginUser)


//Création endpoint/ user pour l'ajout d'un utilisateur
app.post("/user", DataBaseMiddleWare.CheckConnexion, UserController.addOneUser);

app.post("/users", DataBaseMiddleWare.CheckConnexion, UserController.addManydUser);

app.get("/user/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUserById);

// app.get("/users", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findManyUsers);

// Création du endpoint /users_by_filters pour la récupération de plusieurs utilisateurs
app.get('/users_by_filters', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findManyUsers)

app.put("/user/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.updateOneUser);

app.put("/users", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.updateManyUser);

app.delete("/user/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.deleteOneUser);

app.delete("/users", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.deleteManyUsers);

app.get("/user", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUser)






// Création des endpoint pour les sleepLog


app.get("/generateData/:id", SleepLogController.generateData)

app.post("/sleepLog", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.createOneSleepLog);

app.post("/sleepLogs", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.createManySleepLogs);

app.get("/sleepLog/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findOneSleepLogById);

app.get('/sleepLogs_by_filters', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findManySleepLogs)

app.get('/sleepLogs', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findManySleepLogsById)

app.put("/sleepLog/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.updateOneSleepLog);

app.put("/sleepLogs", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.updateManySleepLogs);

app.delete("/sleepLog/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.deleteOneSleepLog);

app.delete("/sleepLogs", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.deleteManySleepLogs);

app.get("/sleepLog", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), SleepLogController.findOneSleepLog)


// Création des endpoint pour les notifications


app.post("/notification", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.createOneNotification);

app.post("/notifications", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.createManyNotifications);

app.get("/notification/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.findOneNotificationById);

app.get('/notifications_by_filters', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.findManyNotifications)

app.get('/notifications', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.findManyNotificationsById)

app.put("/notification/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.updateOneNotification);

app.put("/notifications", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.updateManyNotifications);

app.delete("/notification/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.deleteOneNotification);

app.delete("/notifications", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.deleteManyNotifications);

app.get("/notification", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), NotificationController.findOneNotification)

// Création des endpoint pour les notifications


app.post("/rappel", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.createOneRappel);

app.post("/rappels", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.createManyRappels);

app.get("/rappel/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.findOneRappelById);

app.get('/rappels_by_filters', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.findManyRappels)

app.get('/rappels', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.findManyRappelsById)

app.put("/rappel/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.updateOneRappel);

app.put("/rappels", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.updateManyRappels);

app.delete("/rappel/:id", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.deleteOneRappel);

app.delete("/rappels", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.deleteManyRappels);

app.get("/rappel", DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), RappelController.findOneRappel)


// 2e chose à faire : Créer le server avec app.listen
app.listen(Config.port, () => {
  Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

// Logout
app.post('/logout', DataBaseMiddleWare.CheckConnexion, passport.authenticate('jwt', { session: false }), UserController.logoutUser)
module.exports = app
