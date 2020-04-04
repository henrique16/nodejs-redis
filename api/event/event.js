const express = require("express")
const server = express()
const eventService = require("../../mongodb/service/event")

server.post("/insert", async (req, res, next) => {
    try {
        const event = req.body
        const insertedEvent = await eventService.insert(event)
        res.status(200).send(insertedEvent)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

module.exports = server