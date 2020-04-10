const MongoClient = require('mongodb').MongoClient
const config = require("../../config/index.json")
const uri = config.mongodb.uri
const client = new MongoClient(uri, { useNewUrlParser: true })
const conn = client.connect()
module.exports = conn