const jsonwebtoken = require("jsonwebtoken")
const userService = require("../../database/mongodb/service/user")

const app = require("express")()

module.exports = function (app, io) {
    app.post("/register/login", async (req, res, next) => {
        try {
            const acess = req.body.acess
            const password = req.body.password
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
            const token = jsonwebtoken.sign({ _id: user._id }, "secret", { expiresIn: 30 })
            await userService.updateOne({ _id: user._id, token: token })
            res.clearCookie("urlRedirect")
                .cookie("_id", 123)
                .status(200)
                .send({ urlRedirect: urlRedirect })
        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    })
}