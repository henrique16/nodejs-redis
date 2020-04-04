const schema = require("../schema/event")
const redis = require("../../redis/redis")
const redisKeys = { events: "events" }

module.exports = {
    insert(event) { return insert(event) },
    get() { return get() },
    getByUser(idUser) { return getByUser(idUser) },
    del(_id) { return del(_id) }
}

function insert(event) {
    return schema.insert(event).then(insertedEvent => {
        console.log(`INSERTED EVENT _id: ${insertedEvent._id}`)
        redis.get(redisKeys.events).then(eventsCache => {
            if (eventsCache) {
                const eventsCacheJson = JSON.parse(eventsCache)
                eventsCacheJson.push(insertedEvent)
                redis.set(redisKeys.events, eventsCacheJson).then(() => console.log("REDIS - UPDATED EVETNS CACHE"))
            }
        })
        return insertedEvent
    })
}

function del(_id) {
    return schema.del(_id).then(() => {
        console.log(`_id: ${_id} DELETED`)
        redis.get(redisKeys.events).then(eventsCache => {
            if (eventsCache) {
                const eventsCacheJson = JSON.parse(eventsCache)
                const index = eventsCacheJson.findIndex(event => event._id === _id)
                eventsCacheJson.splice(index, 1)
                if(eventsCacheJson.length > 0) {
                    redis.set(redisKeys.events, eventsCacheJson).then(() => console.log("REDIS - UPDATED EVETNS CACHE"))
                }
            }
        })
    })
}

function get() {
    return redis.get(redisKeys.events).then(eventsCache => {
        if (eventsCache) {
            console.log("REDIS - GOT EVENTS CACHE")
            const eventsCacheJson = JSON.parse(eventsCache)
            return eventsCacheJson
        }
        return schema.get().then(events => {
            redis.set(redisKeys.events, events).then(() => console.log("REDIS - INSERTED EVENTS CACHE"))
            console.log("GOT EVENTS")
            return events
        })
    })
}

function getByUser(idUser) {
    const key = `${redisKeys.events}${idUser}`
    return redis.get(key).then(eventsByUserCache => {
        if (eventsByUserCache) {
            const eventsByUserCacheJson = JSON.parse(eventsByUserCache)
            console.log(`REDIS - GOT USER ${idUser} EVENT AT CACHE`)
            return eventsByUserCacheJson
        }
        return schema.getByUser(idUser).then(eventsByUser => {
            console.log(`GOT USER ${idUser} EVENT`)
            redis.set(key, eventsByUser).then(() => {
                console.log(`REDIS - USER EVENT ${idUser} INSERTED IN CACHE`)
            })
            return eventsByUser
        })
    })
}