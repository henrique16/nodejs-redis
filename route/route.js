const root = require("./root/root")
const event = require("./event/event")

module.exports = function (app, io) {
    root(app, io)
    event(app, io)
}