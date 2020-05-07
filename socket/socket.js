function connect(io) {
    io.on("connection", socket => {
        console.log("connect socket")

        socket.on("disconnect", () => console.log("disconnect socket"))
    })
}

module.exports = {
    connect(io) { return connect(io) }
}