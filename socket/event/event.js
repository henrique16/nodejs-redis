const socketio = require("socket.io")

module.exports = function(server) {
    const io = socketio(server)
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
}