require("dotenv").config()
const express = require("express")
const server = express()
const rootRoute = require("./rootRoute")
server.set("view engine", "ejs")
server.use("/", rootRoute)
server.listen(3000, () => console.log("3000"))
