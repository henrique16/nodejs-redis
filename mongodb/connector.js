const MongoClient = require('mongodb').MongoClient
const uri = `mongodb+srv://dbhome:${process.env.password}@cluster0-tay0h.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true })
const conn = client.connect()
module.exports = conn