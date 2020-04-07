const register = require("./register/register")
const root = require("./root/root")

module.exports = function (app, io) {
    register(app, io)
    root(app, io)
}