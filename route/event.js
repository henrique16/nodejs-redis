const express = require("express")
const server = express()

server.get("/", (req, res, next) => {
    try {
        res.render("event/event.ejs")
    }
    catch (err) {
        res.send(err)
    }
})

module.exports = server