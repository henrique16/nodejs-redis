module.exports = function (io) {
    io.on("connection", socket => {
        console.log("connect socket")
        
        socket.on("disconnect", () => console.log("disconnect socket"))
    })
}