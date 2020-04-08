const schema = require("../schema/event")
const redis = require("../../redis/redis")
const redisKeys = { event: "event", events: "events" }

module.exports = {
    insertOne(event) { return insertOne(event) },
    del({ _id, idUser }) { return del({ _id, idUser }) },
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

async function del({ _id, idUser }) {
    try {
        const deletedCount = await schema.del(_id)
        console.log(`_id: ${_id} DELETED`)
        await deleteInArrayCache(redisKeys.events, _id)
        await deleteInArrayCache(`${redisKeys.events}${idUser}`, _id)
        return deletedCount
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
        console.log("REDIS - INSERTED EVENTS IN CACHE")
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
    finally { }
}

async function insertInArrayCache(key, event) {
    try {
        const arrayCache = await getArrayCache(key)
        if (arrayCache) {
            arrayCache.push(event)
            await redis.set(key, arrayCache)
            console.log(`REDIS - INSERTED IN ${key}`)
        }
        else console.log(`NOT ${key}`)
    }
    finally { }
}

async function deleteInArrayCache(key, _id) {
    try {
        const arrayCache = await getArrayCache(key)
        if (arrayCache) {
            const index = arrayCache.findIndex(obj => obj._id.toString() === _id.toString())
            arrayCache.splice(index, 1)
            await redis.set(key, arrayCache)
            console.log(`REDIS - DELETED IN ${key}`)
        }
        else console.log(`NOT ${key}`)
    }
    finally { }
}