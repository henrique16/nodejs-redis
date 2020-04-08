const connector = require("../connector")
const mongodb = require("mongodb")
const schema = {
    acess: null,
    password: null,
    token: null
}

module.exports = {
    insertOne(user) { return insertOne(user) },
    updateOne(user) { return updateOne(user) },
    get() { return get() },
    getById(_id) { return getById(_id) },
    getByAcess(acess) { return getByAcess(acess) },
    del(_id) { return del(_id) }
}

function insertOne(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("user")
            const result = await collection.insertOne(user)
            const insertedUser = result.ops[0]
            return resolve(insertedUser)
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
    })
}

function updateOne(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedUser = {}
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("user")
            const result = await collection.find({ _id: new mongodb.ObjectID(user._id) }).toArray()
            const userInBase = result[0]
            const keys = Object.keys(schema)
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index]
                const type = typeof (user[key])
                if (type === "undefined") {
                    updatedUser[key] = userInBase[key]
                }
                else updatedUser[key] = user[key]
            }
            const filter = { _id: new mongodb.ObjectID(user._id) }
            const query = { $set: updatedUser }
            await collection.updateOne(filter, query, { upsert: true })
            updatedUser._id = userInBase._id
            return resolve(updatedUser)
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
            const collection = mongoClient.db("base").collection("user")
            const users = await collection.find().toArray()
            return resolve(users)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}

function getById(_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("user")
            const result = await collection.find({ _id: new mongodb.ObjectID(_id) }).toArray()
            const user = result[0]
            return resolve(user)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}

function getByAcess(acess) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("user")
            const result = await collection.find({ acess: acess }).toArray()
            const userByAcess = result[0]
            return resolve(userByAcess)
        }
        catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}

function del(_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const mongoClient = await connector
            const collection = mongoClient.db("base").collection("user")
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