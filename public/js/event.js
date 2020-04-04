window.onload = function () {
    var socket = io.connect('http://localhost:5890');
    socket.emit('test', { my: 'data' })
}

const schema = {
    idUser: -1,
    idPlace: -1,
    eventName: "",
    description: "",
}

async function insert() {
    const event = {}
    const nodeArray = document.getElementsByClassName("insert")
    const insertArray = Array.apply(null, nodeArray)
    insertArray.forEach(element => {
        event[element.id] = element.value
    });
    const body = JSON.stringify(event)
    console.log(body)
    const response = await fetch("/event/insert", { 
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    const result = await response.json()
    console.log(result)
}

function comeBack() {

}