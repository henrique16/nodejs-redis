const express = require("express")

function get() {
    const route = express()
    
    route.use(async (req, res, next) => {
    })

    //#region root
    route.get("/", async (req, res, next) => {
    })
    //#endregion

    //#region register
    route.get("/register", (req, res, next) => {
    })
    //#endregion

    return route
}

module.exports = {
    get() { return get() }
}