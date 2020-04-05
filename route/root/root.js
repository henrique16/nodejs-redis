const eventService = require("../../mongodb/service/event")

module.exports = function (server) {
    server.get("/", async (req, res, next) => {
        try {
            const eventsByUser = await eventService.getByUser("10")
            const events = await eventService.get()
            return res.render("home/home.ejs", { eventsByUser: eventsByUser, events: events })
        }
        catch (err) {
            return res.status(500).send("Try later")
        }
    })
}