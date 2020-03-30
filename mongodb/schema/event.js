const connector = require("../connector")
const redis = require("../../redis/redis")
const schema = {
    idUser: -1,
    idPlace: -1,
    eventName: "",
    description: "",
    activeOrDeleted: false,
    createdAt: new Date(),
    updateAt: new Date(),
    secretKey: "",
    isMeeting: false,
    isLive: false,
    isTest: false,
    isBeta: false
}
const redisKeys = { events: "events", myEvents: "myEvents" }

module.exports = {
    insert(event) { return insert(event) },
    get() { return get() }
}

function insert(event) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const result = await collection.insert(event)
            const insertedEvent = result.ops[0]
            mongoClient.close()
            const data = await redis.get(redisKeys.events)
            if(data) {
                console.log("redis")
                const eventsCache = JSON.parse(data)
                eventsCache.push(insertedEvent)
                await redis.set(redisKeys.events, eventsCache)
            }
            return resolve(insertedEvent)
        }
        catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

function get() {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await redis.get(redisKeys.events)
            if(result) {
                console.log("GET CACHE")
                const eventsCache = JSON.parse(result)
                return resolve(eventsCache)
            }
            console.log("MONGO")
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const events = await collection.find().limit(100).toArray()
            mongoClient.close()
            await redis.set(redisKeys.events, events)
            console.log("INSERT CACHE")
            return resolve(events)
        }
        catch (err) {
            console.log(err)
            reject(err)
        }
    })
}