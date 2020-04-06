const eventService = require("../../mongodb/service/event")

module.exports = function (app, io) {
    app.post("/insertEvent", async (req, res, next) => {
        try {
            const event = req.body
            const insertedEvent = await eventService.insertOne(event)
            const connected = io.sockets.connected
            Object.keys(connected).forEach(socketId => {
                const idUser = connected[socketId].idUser
                if (idUser === insertedEvent.idUser) {
                    io.to(`${socketId}`).emit("newEventByUser", insertedEvent)
                }
            });
            io.emit("newEvent", insertedEvent)
            res.status(200).send("OK")
        }
        catch (err) {
            res.status(500).send(err)
        }
    })
}