const root = require("./root/root")
const event = require("./event/event")

module.exports = function (server) {
    root(server)
    event(server)
}