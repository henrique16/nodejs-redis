// const io = require("socket.io")()
const cryptoJs = require("crypto-js")

module.exports = function (io) {
    io.on("connection", socket => {
        console.log("connect socket")

        socket.on("setIdUserCipher", _idCipher => { 
            const bytes = cryptoJs.AES.decrypt(_idCipher, process.env.SECRET)
            const _id = bytes.toString(cryptoJs.enc.Utf8)
            socket._id = _id
        })

        socket.on("disconnect", () => console.log("disconnect socket"))
    })
}