const express = require("express")
const server = express()
const event = require("./mongodb/service/event")

server.get("/", async (req, res, next) => {
    try {
        const eventsByUser = await event.getByUser("10")
        console.log(eventsByUser)
        const events = await event.get()
        return res.render("home/home.ejs", { eventsByUser: eventsByUser, events: events })
    }
    catch (err) {
        return res.send(err)
    }
})
module.exports = server