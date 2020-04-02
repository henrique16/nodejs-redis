const MongoClient = require('mongodb').MongoClient
const uri = `mongodb://localhost:27017`
const client = new MongoClient(uri, { useNewUrlParser: true })
const conn = client.connect()
module.exports = conn