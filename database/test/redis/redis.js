const redis = require("../../redis/redis")
const method = "get"

if (!redis[method]) return console.log("pass correct method")
redis[method]("events")
    .then(r => console.log(r))
    .catch(e => console.log(e))