window.onload = function () {
    var socket = io.connect('http://localhost:5890');
    socket.emit('test', { my: 'data' })
}

const modal = {
    createEvent: (
        `<div id="createEvent">
            <div>
                <input id="idUser" class="insert" type="text" placeholder="idUser">
            </div>
            <div>
                <input id="idPlace" class="insert" type="text" placeholder="idPlace">
            </div>
            <div>
                <input id="eventName" class="insert" type="text" placeholder="eventName">
            </div>
            <div>
                <input id="description" class="insert" type="text" placeholder="description">
            </div>
            <div>
                <input id="insertEvent" type="submit" value="Insert" onclick="insertEvent()">
            </div>
        </div>`
    )
}

function renderCreateEvent() {
    const createElement = document.getElementById("createEvent")
    if(createElement) {
        createElement.remove()
        return
    }
    const div = document.createElement("div")
    div.innerHTML = modal.createEvent
    document.body.appendChild(div)
}

async function insertEvent() {
    const event = {}
    const nodeArray = document.getElementsByClassName("insert")
    const insertArray = Array.apply(null, nodeArray)
    insertArray.forEach(element => {
        event[element.id] = element.value
    });
    const response = await fetch("/event/insert", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    const insertedEvent = await response.json()
}