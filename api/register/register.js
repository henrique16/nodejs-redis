const userService = require("../../database/mongodb/service/user")
const cryptoJs = require("crypto-js")
const jsonwebtoken = require("jsonwebtoken")

const app = require("express")()

module.exports = function (app, io) {
    app.post("/register/login", async (req, res, next) => {
        try {
            const { acess, password } = req.body
            const urlRedirect = req.cookies.urlRedirect
            const user = await userService.getByAcess(acess)
            if (!user) { 
                console.log("Invalid acess")
                return res.status(403).send({ error: "Invalid acess" })
            }
            if (user.password.toString() !== password.toString()) {
                console.log("Invalid password")
                return res.status(403).send({ error: "Invalid password" })
            }
            const token = jsonwebtoken.sign({}, process.env.SECRET, { expiresIn: 30 })
            const _idCipher = cryptoJs.AES.encrypt(user._id.toString(), process.env.SECRET).toString()
            await userService.updateOne({ _id: user._id, token: token })
            res.clearCookie("urlRedirect")
                .cookie("_idCipher", _idCipher)
                .status(200)
                .send({ _idCipher: _idCipher, urlRedirect: urlRedirect })
        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    })
}