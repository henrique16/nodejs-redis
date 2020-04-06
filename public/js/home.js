window.onload = function () {
    socket = io.connect('http://localhost:5890')
    socket.on("newEvent", event => newEvent(event))
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

const component = {
    event(event) {
        const div = document.createElement("div")
        div.id = `event${event._id}`
        const html = (
            `<span>${event.idUser}</span>
             <span>${event.idPlace}</span>
             <span>${event.eventName}</span>
             <span>${event.description}</span>`
        )
        div.innerHTML = html
        return div
    }
}

function renderCreateEvent() {
    const createEvent = document.getElementById("createEvent")
    if (createEvent) {
        createEvent.remove()
        return
    }
    const div = document.createElement("div")
    div.innerHTML = modal.createEvent
    document.body.appendChild(div)
}

function newEvent(event) {
    const events = document.getElementById("events")
    if(events) {
        events.appendChild(component.event(event))
    }
}

async function insertEvent() {
    const event = {}
    const nodeArray = document.getElementsByClassName("insert")
    const insertArray = Array.apply(null, nodeArray)
    insertArray.forEach(element => {
        event[element.id] = element.value
    });
    try {
        await fetch("/event/insert", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        })
    }
    catch (err) {
        alert("Try later")
    }
}