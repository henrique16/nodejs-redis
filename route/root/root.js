const jsonwebtoken = require("jsonwebtoken")
const eventService = require("../../mongodb/service/event")
const app = require("express")()

module.exports = function (app1, io) {
    app.use((req, res, next) => {
        const token = req.headers["www-authenticate"]
        try {
            jsonwebtoken.verify(token, "secret")
            next()
        }
        catch (err) {
            req.
            console.log(req.headers["access-control-allow-origin"])
            res.redirect("/register")
        }
    })
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