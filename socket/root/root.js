// const io = require("socket.io")()

module.exports = function (io) {
    io.on("connection", socket => {
        console.log("connect socket")

        socket.on("setIdUser", idUser => { 
            socket.idUser = idUser
        })

        socket.on("disconnect", () => console.log("disconnect socket"))
    })
}