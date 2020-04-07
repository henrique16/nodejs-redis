const eventService = require("../../mongodb/service/event")

module.exports = function (app, io) {
    app.post("/insertEvent", async (req, res, next) => {
        try {
            const event = req.body
            const insertedEvent = await eventService.insertOne(event)

            //#region issue only to the user
            const connected = io.sockets.connected
            const keys = Object.keys(connected)
            for (let index = 0; index < keys.length; index++) {
                const socketId = keys[index]
                const idUser = connected[socketId].idUser
                if (idUser === insertedEvent.idUser) {
                    io.to(`${socketId}`).emit("newEventByUser", insertedEvent)
                }
            }
            //#endregion

            io.emit("newEvent", insertedEvent)
            res.status(200).send("OK")
        }
        catch (err) {
            res.status(500).send(err)
        }
    })

    app.post("/deleteEvent", async (req, res, next) => {
        try {
            const { _id, idUser } = req.body
            await eventService.del({ _id: _id, idUser: idUser })

            //#region issue only to the user
            const connected = io.sockets.connected
            const keys = Object.keys(connected)
            for (let index = 0; index < keys.length; index++) {
                const socketId = keys[index]
                const auxIdUser = connected[socketId].idUser
                if (auxIdUser === idUser) {
                    io.to(`${socketId}`).emit("deletedEventByUser", _id)
                }
            }
            //#endregion
            
            io.emit("deletedEvent", _id)
            res.status(200).send("OK")
        }
        catch (err) {
            res.status(500).send(err)
        }
    })
}