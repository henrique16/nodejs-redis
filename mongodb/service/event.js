const schema = require("../schema/event")
const redis = require("../../redis/redis")
const redisKeys = { events: "events", myEvents: "myEvents" }

module.exports = {
    insert(event) { return insert(event) },
    get() { return get() }
}

async function insert(event) {
    return schema.insert(event).then(insertedEvent => {
        console.log(`INSERT EVENT _id: ${insertedEvent._id}`)
        redis.get(redisKeys.events).then(eventsCache => {
            if(eventsCache) {
                const eventsCacheJson = JSON.parse(eventsCache)
                eventsCacheJson.push(insertedEvent)
                redis.set(redisKeys.events, eventsCacheJson).then(() => console.log("REDIS - UPDATE EVETNS CACHE"))
            }
        })
        return insertedEvent
    })
}

async function get() {
    return redis.get(redisKeys.events).then(eventsCache => {
        console.log(eventsCache)
        if(eventsCache) {
            console.log("REDIS - GET EVENTS CACHE")
            const eventsCacheJson = JSON.parse(eventsCache)
            return eventsCacheJson
        }
        return schema.get().then(events => {
            redis.set(redisKeys.events, events).then(() => console.log("REDIS - INSERT EVENTS CACHE"))
            console.log("GET EVENTS")
            return events
        })
    })
}