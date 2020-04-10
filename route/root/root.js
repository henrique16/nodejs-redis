const jsonwebtoken = require("jsonwebtoken")
const eventService = require("../../database/mongodb/service/event")

const app = require("express")()
const io = require("socket.io")()

module.exports = function (app, io) {
    app.use((req, res, next) => {
        try {
            // jsonwebtoken.verify(token, "secret")
            const _id = req.cookies._id || ""
            console.log(_id)
            if (_id.toString() !== "123") {
                return res.cookie("urlRedirect", `${req.url}`).redirect("/register")
            }
            next()
        }
        catch (err) {
            res.cookie("urlRedirect", `${req.url}`).redirect("/register")
        }
    })
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