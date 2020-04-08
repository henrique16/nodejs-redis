const connector = require("../connector")
const mongodb = require("mongodb")
const schema = {
    idUser: -1,
    idPlace: -1,
    eventName: "",
    description: "",
}

module.exports = {
    insertOne(event) { return insertOne(event) },
    get() { return get() },
    getByUser(idUser) { return getByUser(idUser) },
    del(_id) { return del(_id) }
}

function insertOne(event) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const result = await collection.insertOne(event)
            const insertedEvent = result.ops[0]
            return resolve(insertedEvent)
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
    })
}

function del(_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const result = await collection.deleteOne({ _id: new mongodb.ObjectID(_id) })
            const deletedCount = result.deletedCount
            if (!deletedCount) return new Error(`_id: ${_id} NOT EXIST`)
            return resolve(deletedCount)
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
    })
}

function get() {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const events = await collection.find().limit(100).toArray()
            return resolve(events)
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
    })
}

function getByUser(idUser) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("event")
            const eventsByUser = await collection.find({idUser: idUser}).toArray()
            return resolve(eventsByUser)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}