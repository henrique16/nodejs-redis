const event = require("../../database/event")
const method = "insertOne"
const schema = {
    idUser: 2,
    idPlace: 4,
    name: "test nice 4"
}

if (!event[method]) return console.log("pass correct method")
event[method]()
    .then(r => console.log(r))
    .catch(e => console.log(e))