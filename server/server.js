const express = require("express")
const socketio = require("socket.io")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const path = require("path")
const api = require("../api/api")
const socket = require("../socket/socket")
const route = require("../route/route")
const config = require("../config/index.json")

function init() {
    const app = express()
    const io = socketio()
    app.set("view engine", "ejs")
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(express.static(path.dirname(require.main.filename)))
    app.use("/", api.get(io))
    socket.connect(io)
    app.use("/", route.get())
    const server = app.listen(config.server.port, () => console.log(config.server.href))
    io.listen(server)
}

module.exports = {
    init() { return init() }
}