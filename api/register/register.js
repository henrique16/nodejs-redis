// const app = require("express")()
const jsonwebtoken = require("jsonwebtoken")

module.exports = function (app, io) {
    app.post("/register/login", (req, res, next) => {
        console.log("PASSEIII")
        const user = req.body.user
        const password = req.body.password
        const redirect = req.body.password
        console.log(redirect)
        if(user !== "gabriel") res.status(500).send("invalid user")
        if(password !== "123") res.status(500).send("invalid password")
        const token = jsonwebtoken.sign({}, "secret", { expiresIn: 10 })
        req.headers["www-authenticate"] = token
        res.redirect(redirect)
    })
}