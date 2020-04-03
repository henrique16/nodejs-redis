const express = require("express")
const server = express()
const event = require("./mongodb/schema/event")
server.get("/", async (req, res, next) => {
    res.render("home.ejs")
})
module.exports = server