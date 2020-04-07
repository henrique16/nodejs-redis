module.exports = function (app, io) {
    app.get("/register", (req, res, next) => {
        res.render("register/register.ejs")
    })
}