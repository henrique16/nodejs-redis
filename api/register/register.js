// const app = require("express")()
const jsonwebtoken = require("jsonwebtoken")

module.exports = function (app, io) {
    app.post("/register/login", (req, res, next) => {
        const user = req.body.user
        const password = req.body.password
        if(user !== "gabriel") res.status(500).send("invalid user")
        if(password !== "123") res.status(500).send("invalid password")
        const token = jsonwebtoken.sign({ id: "10" }, "secret", { expiresIn: 30 })
        res.status(200).send("OK")
    })
}