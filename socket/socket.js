// const sockeio = require("socket.io")
// const io = sockeio()
const root = require("./root/root")

module.exports = function (io) {
    root(io)
}