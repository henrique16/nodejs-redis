module.exports = function (app, io) {
    app.get("/event", (req, res, next) => {
        try {
            res.send("event")
        }
        catch (err) {
            res.status(500).send(err)
        }
    })
}