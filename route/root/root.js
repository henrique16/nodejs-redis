const eventService = require("../../database/mongodb/service/event")
const cryptoJs = require("crypto-js")
const userService = require("../../database/mongodb/service/user")
const jsonwebtoken = require("jsonwebtoken")

const app = require("express")()
const io = require("socket.io")()

module.exports = function (app, io) {
    this.idUser = null
    app.use(async (req, res, next) => {
        try {
            const _idCipher = req.cookies._idCipher || null
            if (!_idCipher) throw new Error("is not authenticated")
            const bytes = cryptoJs.AES.decrypt(_idCipher, process.env.SECRET)
            const _id = bytes.toString(cryptoJs.enc.Utf8)
            const user = await userService.getById(_id)
            const token = user.token
            jsonwebtoken.verify(token, process.env.SECRET)
            next()
        }
        catch (err) {
            console.log(err)
            res.cookie("urlRedirect", "/").redirect("/register")
        }
    })
    app.get("/", async (req, res, next) => {
        try {
            const eventsByUser = await eventService.getByUser("10")
            const events = await eventService.get()
            res.status(200).render("root/root.ejs", { eventsByUser: eventsByUser, events: events })
        }
        catch (err) {
            console.log(err)
            res.status(500).send("Try later")
        }
    })
}