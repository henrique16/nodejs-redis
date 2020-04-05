const eventService = require("../../mongodb/service/event")

module.exports = function (server) {
    server.post("/event/insert", async (req, res, next) => {
        try {
            const event = req.body
            const insertedEvent = await eventService.insertOne(event)
            res.status(200).send(insertedEvent)
        }
        catch (err) {
            res.status(500).send(err)
        }
    })
}