const connector = require("../connector")
const mongodb = require("mongodb")
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

module.exports = {
    insert(event) { return insert(event) },
    get() { return get() },
    getByUser(idUser) { return getByUser(idUser) },
    del(_id) { return del(_id) }
}

function insert(event) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const result = await collection.insert(event)
            const insertedEvent = result.ops[0]
            mongoClient.close()
            return resolve(insertedEvent)
        }
        catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

function del(_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            await collection.deleteOne({ _id: new mongodb.ObjectID(_id) })
            mongoClient.close()
            return resolve()
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
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const events = await collection.find().limit(100).toArray()
            mongoClient.close()
            return resolve(events)
        }
        catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

function getByUser(idUser) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const eventsByUser = await collection.find({idUser: idUser}).toArray()
            mongoClient.close()
            return resolve(eventsByUser)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}