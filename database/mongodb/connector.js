const MongoClient = require('mongodb').MongoClient
const config = require("../../config/index.json")

function getConnect() {
    const uri = config.mongodb.uri
    const client = new MongoClient(uri, { useNewUrlParser: true })
    return client.connect()
}

module.exports = {
    getConnect() { return getConnect() }
}