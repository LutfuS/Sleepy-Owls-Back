
const { faker } = require('@faker-js/faker');

function createFakeData(id) {
    let Records = [

    ]

    const numRecords = faker.number.int({ min: 4, max: 15 }) * 3600000;
    for (let i = 0; i < numRecords; i++) {
        const sleepStart = faker.defaultRefDate(30);
        const sleepEnd = new Date(sleepStart.getTime() + sleepDuration);
        const sleepDuration = faker.number.int({ min: 4, max: 15 }) * 3600000;
        const sleepSound = {
        }
        const sleepRecord = {
            user_id: id,
            sleepStart: sleepStart,
            sleepEnd: sleepEnd,
            sleepDuration: sleepDuration,
            sleepQuality: faker.helpers.arrayElement(['Poor', 'Average', 'Good', 'Excellent']),
            sleepSound: faker.helpers.arrayElement({

            })


        };
        Records.push(sleepRecord)
        // await sleepRecord.save();
    }

    return Records
}

console.log(createFakeData())


const sounds = {
    'Ronflement': 'public\son\man_breathing_asleep-75120.mp3',
    'Somniloquie': 'public\son\sleep-talking-wav-68027.mp3',
    'Chuchotement': 'public\son\shushing-150148.mp3',
    'Reveil': 'public\son\man-waking-up-from-sleep-6338.mp3',
    'Respirations': 'public\son\man_breathing_asleep-75120.mp3'
}

const soundKey = faker.helpers.arrayElement(Object.keys(sounds))

const sleepSound = sounds[soundKey]