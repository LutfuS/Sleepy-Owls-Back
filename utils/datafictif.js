
const { faker } = require('@faker-js/faker');

function createFakeData(id) {
    let Records = [

    ]

    const numRecords = faker.number.int({ min: 4, max: 15 }) * 3600000;
    for (let i = 0; i < numRecords; i++) {
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepRecord = {
            userId: id,
            sleepStart: sleepStart,
            sleepEnd: sleepEnd,
            sleepDuration: sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement(['snore in sleep', 'talk in sleep', 'move in sleep', 'wake up in the night'])


        };
        Records.push(sleepRecord)
        // await sleepRecord.save();
    }

    return Records
}

console.log(createFakeData())