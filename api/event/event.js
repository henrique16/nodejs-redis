const eventService = require("../../mongodb/service/event")

module.exports = function (app, io) {
    app.post("/event/insert", async (req, res, next) => {
        try {
            const event = req.body
            const insertedEvent = await eventService.insertOne(event)
            io.emit("newEvent", insertedEvent)
            res.status(200).send("OK")
        }
        catch (err) {
            res.status(500).send(err)
        }
    })
}