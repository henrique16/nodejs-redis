const schema = require("../schema/event")
const redis = require("../../redis/redis")
const redisKeys = { events: "events" }

module.exports = {
    insertOne(event) { return insertOne(event) },
    // insertMany(events) { return insertMany(events) },
    del(event) { return del(event) },
    get() { return get() },
    getByUser(idUser) { return getByUser(idUser) }
}

async function insertOne(event) {
    try {
        const insertedEvent = await schema.insertOne(event)
        console.log(`INSERTED EVENT _id: ${insertedEvent._id}`)
        await insertInArrayCache(redisKeys.events, insertedEvent)
        await insertInArrayCache(`${redisKeys.events}${insertedEvent.idUser}`, insertedEvent)
        return insertedEvent
    }
    finally { }
}

// async function insertMany(events) {
//     try {
//         const insertedEvents = await schema.insertMany(events)
//         insertedEvents.forEach(async event => {
//             var keyExist = false
//             keyExist = await insertInArrayCache(redisKeys.events, event)
//             keyExist = await insertInArrayCache(`${redisKeys.events}${event.idUser}`, event)
//             console.log(keyExist)
//             if (!keyExist) return
//         });
//         return insertedEvents
//     }
//     finally { }
// }

async function del(event) {
    try {
        const deletedCount = await schema.del(event._id)
        if (deletedCount > 0) {
            console.log(`_id: ${event._id} DELETED`)
            await deleteInArrayCache(redisKeys.events, event._id)
            await deleteInArrayCache(`${redisKeys.events}${event.idUser}`, event._id)
        }
        else console.log(`_id: ${event._id} NOT EXIST`)
    }
    finally { }
}

async function get() {
    try {
        const eventsCache = await getArrayCache(redisKeys.events)
        if (eventsCache) {
            console.log("REDIS - GOT EVENTS CACHE")
            return eventsCache
        }
        const events = await schema.get()
        console.log("GOT EVENTS")
        await redis.set(redisKeys.events, events)
        console.log("REDIS - INSERTED EVENTS CACHE")
        return events
    }
    finally { }
}

async function getByUser(idUser) {
    const key = `${redisKeys.events}${idUser}`
    try {
        const eventsByUserCache = await getArrayCache(key)
        if (eventsByUserCache) {
            console.log(`REDIS - GOT USER ${idUser} EVENT AT CACHE`)
            return eventsByUserCache
        }
        const eventsByUser = await schema.getByUser(idUser)
        console.log(`GOT USER ${idUser} EVENT`)
        await redis.set(key, eventsByUser)
        console.log(`REDIS - USER EVENT ${idUser} INSERTED IN CACHE`)
        return eventsByUser
    }
    finally { }
}

async function getArrayCache(key) {
    try {
        const cache = await redis.get(key)
        if (cache) {
            const arrayCache = JSON.parse(cache)
            return arrayCache
        }
        return null
    }
    finally {}
}

async function insertInArrayCache(key, event) {
    try {
        const arrayCache = await getArrayCache(key)
        if (arrayCache) {
            arrayCache.push(event)
            await redis.set(key, arrayCache)
            console.log(`REDIS - INSERTED IN ${key}`)
            return true
        }
        else {
            console.log(`NOT ${key}`)
            return false
        }
    }
    finally { }
}

async function deleteInArrayCache(key, _id) {
    try {
        const arrayCache = await getArrayCache(key)
        if (arrayCache) {
            const index = arrayCache.findIndex(obj => obj._id === _id)
            arrayCache.splice(index, 1)
            await redis.set(key, arrayCache)
            console.log(`REDIS - DELETED IN ${key}`)
        }
        else console.log(`NOT ${key}`)
    }
    finally {}
}