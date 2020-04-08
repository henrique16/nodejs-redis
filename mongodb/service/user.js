const schema = require("../schema/user")
const redis = require("../../redis/redis")
const redisKeys = { user: "user", users: "users" }

module.exports = {
    insertOne(user) { return insertOne(user) },
    updateOne(user) { return updateOne(user) },
    get() { return get() },
    getById(_id) { return getById(_id) },
    getByAcess(acess) { return getByAcess(acess) },
    del(_id) { return del(_id) }
}

async function insertOne(user) {
    try {
        const insertedUser = await schema.insertOne(user)
        console.log(`INSERTED USER _id: ${insertedUser._id}`)
        await insertInArrayCache(redisKeys.users, insertedUser)
        return insertedUser
    }
    finally { }
}

async function updateOne(user) {
    try {
        const updatedUser = await schema.updateOne(user)
        await updateInArrayCache(redisKeys.users, updatedUser)
        await updateInArrayCache(`${redisKeys.user}${updatedUser._id}`, updatedUser)
        return updatedUser
    }
    finally { }
}

async function get() {
    try {
        const usersCache = await getArrayCache(redisKeys.users)
        if (usersCache) {
            console.log("REDIS - GOT USERS CACHE")
            return usersCache
        }
        const users = await schema.get()
        console.log("GOT USERS")
        await redis.set(redisKeys.users, users)
        console.log("REDIS - INSERTED USERS IN CACHE")
        return users
    }
    finally { }
}

async function getById(_id) {
    try {
        const key = `${redisKeys.user}${_id}`
        const userCache = await getArrayCache(key)
        if (userCache) {
            console.log(`REDIS - GOT USER ${_id} IN CACHE`)
            return userCache[0]
        }
        const user = await schema.getById(_id)
        console.log(`GOT USER ${user._id}`)
        await redis.set(key, [user])
        console.log(`REDIS - INSERTED USER ${user._id} IN CACHE`)
        return user
    }
    finally { }
}

async function getByAcess(acess) {
    try {
        const user = await schema.getByAcess(acess)
        return user
    }
    finally { }
}

async function del(_id) {
    try {
        const deletedCount = await schema.del(_id)
        console.log(`_id: ${_id} DELETED`)
        await deleteInArrayCache(redisKeys.users, _id)
        await deleteInArrayCache(`${redisKeys.user}${_id}`, _id)
        return deletedCount
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

async function insertInArrayCache(key, user) {
    try {
        const arrayCache = await getArrayCache(key)
        if (arrayCache) {
            arrayCache.push(user)
            await redis.set(key, arrayCache)
            console.log(`REDIS - INSERTED IN ${key}`)
        }
        else console.log(`NOT ${key}`)
    }
    finally { }
}

async function updateInArrayCache(key, user) {
    try {
        const arrayCache = await getArrayCache(key)
        if (arrayCache) {
            const index = arrayCache.findIndex(el => el._id.toString() === user._id.toString())
            arrayCache.splice(index, 1)
            arrayCache.push(user)
            await redis.set(key, arrayCache)
            console.log(`REDIS - UPDATED IN ${key}`)
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