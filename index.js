require("dotenv").config()
const express = require("express")
const socketio = require("socket.io")
const rootRoute = require("./rootRoute")

const server = express()
server.set("view engine", "ejs")
server.use(express.static(__dirname))
server.use("/", rootRoute)
const listen = server.listen(5890, () => console.log("5890"))
const io = socketio.listen(listen)

io.on("connection", socket => {
    console.log("CONNCT SOCKET")

    socket.on("disconnect", () => {
        console.log("DISCONECT SOCKET")
    })
    
    socket.on("test", (message) => {
        console.log(message)
    })
})

