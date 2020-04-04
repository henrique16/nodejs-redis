const express = require("express")
const server = express()
const event = require("./mongodb/service/event")
server.get("/", async (req, res, next) => {
    try {
        const eventsByUser = await event.getByUser(-1)
        const events = await event.get()
        res.render("home/home.ejs", { eventsByUser: eventsByUser, events: events })
    }
    catch (err) {
        res.send("Bad")
    }
})
module.exports = server