const event = require("./event/event")

module.exports = function (app, io) {
    event(app, io)
}