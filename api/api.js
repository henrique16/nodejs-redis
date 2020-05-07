const express = require("express")

function get(io) {
    const api = express()

    //#region register
    api.post("/register/login", async (req, res, next) => {
    })
    //#endregion

    //#region event
    api.post("/event/insert", async (req, res, next) => {
    })

    api.post("/event/delete", async (req, res, next) => {
    })
    //#endregion

    return api
}

module.exports = {
    get(io) { return get(io) }
}