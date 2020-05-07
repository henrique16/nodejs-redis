const event = require("../../../mongodb/schema/event")
const method = "insertOne"
const schema = {
    idUser: 2,
    idPlace: 3,
    name: "test nice 3"
}

if (!event[method]) return console.log("pass correct method")
event[method](schema)
    .then(r => console.log(r))
    .catch(e => console.log(e))