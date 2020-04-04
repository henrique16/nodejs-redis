require("dotenv").config()
const express = require("express")
const socketio = require("socket.io")
const bodyParser = require("body-parser")
const rootRoute = require("./rootRoute")
const eventRoute = require("./route/event")
const apiEvent = require("./api/event/event")

const server = express()
server.use(bodyParser.json())
server.set("view engine", "ejs")
server.use(express.static(__dirname))
server.use("/", rootRoute)
server.use("/event", eventRoute)
server.use("/event", apiEvent)
const listen = server.listen(5890, () => console.log("5890"))
const io = socketio.listen(listen)

const schema = {
    idUser: "10",
    idPlace: "2",
    eventName: "abc",
    description: "abc",
}
const a = require("./mongodb/service/event")
async function ab() {
    // await a.del({ _id: "5e88ad91d25f1e122811c264" })
    a.getByUser("10").then(r => console.log(r))
    .catch(e => console.log(e))
    a.get().then(re => console.log(re))
    .catch(err => console.log(err))
}
ab()

io.on("connection", socket => {
    console.log("CONNCT SOCKET")

    socket.on("disconnect", () => {
        console.log("DISCONECT SOCKET")
    })
    
    socket.on("test", (message) => {
        console.log(message)
    })
})

