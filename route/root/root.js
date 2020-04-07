const jsonwebtoken = require("jsonwebtoken")
const eventService = require("../../mongodb/service/event")
// const app = require("express")()
// const io = require("socket.io")()

module.exports = function (app, io) {
    // app.use((req, res, next) => {
    //     console.log(req.ha)
    //     try {
    //         jsonwebtoken.verify(token, "secret")
    //         next()
    //     }
    //     catch (err) {
    //         res.redirect("/register")
    //     }
    // })
    app.get("/", async (req, res, next) => {
        try {
            const eventsByUser = await eventService.getByUser("10")
            const events = await eventService.get()
            res.status(200).render("root/root.ejs", { eventsByUser: eventsByUser, events: events })
        }
        catch (err) {
            res.status(500).send("Try later")
        }
    })
}