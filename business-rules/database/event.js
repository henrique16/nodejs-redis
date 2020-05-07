const schema = require("../../database/mongodb/schema/event")
const redis = require("../../database/redis/redis")
const redisKeys = { event: "event", events: "events" }

/**
 * @param {*} event  { idUser: null, idPlace: null, eventName: null, description: null }
 */
// Insert in mongodb and if there is cache, update the cache
function insertOne(event) {
    return schema.insertOne(event)
        .then(insertedEvent => {
            console.log(`INSERTED EVENT _id: ${insertedEvent._id}`)
            insertInArrayCache(redisKeys.events, insertedEvent)
            insertInArrayCache(`${redisKeys.events}${insertedEvent.idUser}`, insertedEvent)
            return insertedEvent
        })
        .catch(error => error)
}

// Delete event on mongodb and if there is cache, update the cache
async function del({ _id, idUser }) {
    try {
        const deletedCount = await schema.del(_id)
        console.log(`_id: ${_id} DELETED`)
        await deleteInArrayCache(redisKeys.events, _id)
        await deleteInArrayCache(`${redisKeys.events}${idUser}`, _id)
        return deletedCount
    }
    catch (error) {
        return error
    }
}

// 1- Tries to get all events in the cache, if it exists in the cache, retrieves the events
// 2- If the events are not in the cache, get all the events from mongodb and insert them in the cache
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
    catch (error) {
        return error
    }
}

// 1- Tries to get user events in the cache, if it exists in the cache, retrieves the user events
// 2- If the user events are not in the cache, get the user events from mongodb and insert them in the cache
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
    catch (error) {
        return error
    }
}

/**
 * @param {*} key key in redis
 */
// Get events in redis from the key
async function getArrayCache(key) {
    try {
        const cache = await redis.get(key)
        if (cache) {
            const arrayCache = JSON.parse(cache)
            return arrayCache
        }
        return null
    }
    catch (error) {
        return error
    }
}

/**
 * @param {*} key key in redis
 * @param {*} event { idUser: null, idPlace: null, eventName: null, description: null }
 */
// Try to get the key in the redis, if it exists, insert the new event in the redis array
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
    catch (error) {
        return error
    }
}

/**
 * @param {*} key key in redis
 * @param {*} _id mongodb event key
 */
// Try to get the key in the redis, if it exists, delete the event in the redis array
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
    catch (error) {
        return error
    }
}

module.exports = {
    insertOne(event) { return insertOne(event) },
    del({ _id, idUser }) { return del({ _id, idUser }) },
    get() { return get() },
    getByUser(idUser) { return getByUser(idUser) }
}