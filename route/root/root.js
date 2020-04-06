const eventService = require("../../mongodb/service/event")

module.exports = function (app, io) {
    app.get("/", async (req, res, next) => {
        try {
            const eventsByUser = await eventService.getByUser("10")
            const events = await eventService.get()
            res.status(200).render("home/home.ejs", { eventsByUser: eventsByUser, events: events })
        }
        catch (err) {
            res.status(500).send("Try later")
        }
    })
}


