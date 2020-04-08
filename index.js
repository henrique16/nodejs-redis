require("dotenv").config()
const express = require("express")
const socketio = require("socket.io")
const bodyParser = require("body-parser")
const api = require("./api/api")
const socket = require("./socket/socket")
const route = require("./route/route")
const config = require("./config/index.json")

const app = express()
const io = socketio()
app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(express.static(__dirname))
api(app, io)
socket(io)
route(app, io)
const server = app.listen(config.server.port, () => console.log(config.server.href))
io.listen(server)

const schema = {
    _id: "5e8dfc251aa61026f41958a4",
    token: "OK"
}
const a = require("./mongodb/service/user")
a.getById("5e8dfc251aa61026f41958a4").then(r => console.log(r))
.catch(e => console.log(e))
