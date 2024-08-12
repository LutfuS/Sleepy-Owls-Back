require("../utils/database");

const mongoose = require("mongoose");

describe("UserService", () => {
  require("./services/UserService.test");

});

describe("UserController", () => {
  require("./controllers/UserController.test");
});

describe("RecordService", () => {
  require("./services/RecordService.test")
})

describe("RecordController", () => {
  require("./controllers/RecordController.test")
})

describe("SleepLogService", () => {
  require("./services/SleepLogService.test")
})

describe("SleepLogController", () => {
  require("./controllers/SleepLogController.test")
})
describe("API - Mongo", () => {
  it("vider les dbs. -S", () => {
    if (process.env.npm_lifecycle_event == 'test') {
      mongoose.connection.db.dropDatabase()
    }
  })
})