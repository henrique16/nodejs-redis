require("dotenv").config()
const express = require("express")
const server = express()
const rootRoute = require("./rootRoute")
const io = require('socket.io')()
io.of("event").on("connection", socket => {
    console.log("CONNCT EVENT SOCKET")
    console.log(socket)

    socket.on("disconnect", () => {
        console.log("DISCONECT EVENT SOCKET")
    })

    socket.on("test", (message) => {
        console.log(message)
    })
})
server.set("view engine", "ejs")
server.use("/", rootRoute)
// const schema = {
//     idUser: -1,
//     idPlace: -1,
//     eventName: "",
//     description: "",
//     activeOrDeleted: false,
//     createdAt: new Date(),
//     updateAt: new Date(),
//     secretKey: "",
//     isMeeting: false,
//     isLive: false,
//     isTest: false,
//     isBeta: false
// }
// const event = require("./mongodb/service/event")
// event.del("5e866ca7c156c506a4e243ef").then(t => console.log(t))
// .catch(errr => console.log(errr))
// event.get().then(r => console.log(r))
// .catch(e => console.log(e))

server.listen(3000, () => console.log("3000"))
