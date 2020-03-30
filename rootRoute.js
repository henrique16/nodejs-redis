const express = require("express")
const server = express()
const event = require("./mongodb/schema/event")
server.get("/", async (req, res, next) => {
    try {
        const events = await event.get()
        res.render("home.ejs", { events })
    }
    catch (err) {
        return res.sendStatus(500)
    }
})
module.exports = server