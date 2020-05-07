const connector = require("../connector")
const mongodb = require("mongodb")
const db = "base"
const collection = "event"
const schema = {
    idUser: null,
    idPlace: null,
    name: null
}

function insertOne(event) {
    return new Promise(async (resolve, reject) => {
        var mongoClient
        try {
            mongoClient = await connector.getConnect()
            const result = await mongoClient.db(db).collection(collection).insertOne(event)
            const insertedEvent = result.ops[0]
            return resolve(insertedEvent)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
        finally {
            if (mongoClient) mongoClient.close()
        }
    })
}

function del(_id) {
    return new Promise(async (resolve, reject) => {
        var mongoClient
        try {
            mongoClient = await connector.getConnect()
            const id = new mongodb.ObjectID(_id)
            const result = await mongoClient.db(db).collection(collection).deleteOne({ _id: id })
            const deletedCount = result.deletedCount
            if (!deletedCount) return new Error(`_id: ${_id} NOT EXIST`)
            return resolve(deletedCount)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
        finally {
            if (mongoClient) mongoClient.close()
        }
    })
}

function get() {
    return new Promise(async (resolve, reject) => {
        var mongoClient
        try {
            mongoClient = await connector.getConnect()
            const events = await mongoClient.db(db).collection(collection).find().limit(100).toArray()
            return resolve(events)
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
        finally {
            if (mongoClient) mongoClient.close()
        }
    })
}

function getByUser(idUser) {
    return new Promise(async (resolve, reject) => {
        var mongoClient
        try {
            mongoClient = await connector.getConnect()
            const eventsByUser = await mongoClient.db(db).collection(collection).find({ idUser: idUser }).toArray()
            return resolve(eventsByUser)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
        finally {
            if (mongoClient) mongoClient.close()
        }
    })
}

module.exports = {
    insertOne(event) { return insertOne(event) },
    del(_id) { return del(_id) },
    get() { return get() },
    getByUser(idUser) { return getByUser(idUser) }
}