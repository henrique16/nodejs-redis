const register = require("./register/register")
const root = require("./root/root")
const event = require("./event/event")

module.exports = function (app, io) {
    register(app, io)
    root(app, io)
    event(app, io)
}