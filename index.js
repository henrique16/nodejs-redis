require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const config = require("./config/index.json")
const socketio = require("socket.io")
const socket = require("./socket/socket")
const route = require("./route/route")
const api = require("./api/api")

const app = express()
app.use(bodyParser.json())
app.set("view engine", "ejs")
app.use(express.static(__dirname))
const server = app.listen(config.server.port, () => console.log(config.server.href))
const io = socketio.listen(server)
route(app, io)
api(app, io)
socket(io)