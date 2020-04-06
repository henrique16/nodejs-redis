const socket = io.connect('http://localhost:5890')
socket.on("newEventByUser", event => newEventByUser(event))
socket.on("newEvent", event => newEvent(event))

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
    eventByUser(event) {
        const div = document.createElement("div")
        div.id = `eventsByUser${event._id}`
        const html = (
            `<span>${event.idUser}</span>
             <span>${event.idPlace}</span>
             <span>${event.eventName}</span>
             <span>${event.description}</span>`
        )
        div.innerHTML = html
        return div
    },
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

function newEventByUser(event) {
    const eventsByUser = document.getElementById("eventsByUser")
    if (eventsByUser) {
        eventsByUser.appendChild(component.eventByUser(event))
    }
}

function newEvent(event) {
    const events = document.getElementById("events")
    if (events) {
        events.appendChild(component.event(event))
    }
}

async function insertEvent() {
    const event = {}
    const nodeArray = document.getElementsByClassName("insert")
    const insertArray = Array.apply(null, nodeArray)
    for (let index = 0; index < insertArray.length; index++) {
        const element = insertArray[index];
        event[element.id] = element.value
    }
    try {
        await fetch("/insertEvent", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        })
    }
    catch (err) {
        alert("Try later")
    }
}

async function del(event) {
    const element = event.target
    const _id = element.getAttribute("_id")
    const idUser = element.getAttribute("idUser")
    try {
        await fetch("/deleteEvent", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, idUser: idUser })
        })
    }
    catch (err) {
        alert("Try later")
    }
}