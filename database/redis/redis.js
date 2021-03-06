const { promisify } = require("util")
const redis = require("redis")

function set(key, array) {
    return new Promise(async (resolve, reject) => {
        const redisClient = redis.createClient()
        try {
            const setAsync = promisify(redisClient.set).bind(redisClient)
            const data = JSON.stringify(array)
            await setAsync(key, data)
            await expire(key, redisClient)
            return resolve("OK")
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
        finally {
            redisClient.quit()
        }
    })
}

function del(key) {
    return new Promise(async (resolve, reject) => {
        const redisClient = redis.createClient()
        try {
            const delAsync = promisify(redisClient.del).bind(redisClient)
            const result = await delAsync(key)
            if (!result) return new Error("key not found")
            return resolve("OK")
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
        finally {
            redisClient.quit()
        }
    })
}

function get(key) {
    return new Promise(async (resolve, reject) => {
        const redisClient = redis.createClient()
        try {
            const getAsync = promisify(redisClient.get).bind(redisClient)
            const result = await getAsync(key)
            return resolve(result)
        }
        catch (err) {
            console.log(err)
            return reject(err)
        }
        finally {
            redisClient.quit()
        }
    })
}

function expire(key, redisClient) {
    return new Promise(async (resolve, reject) => {
        try {
            const expireAsync = promisify(redisClient.expire).bind(redisClient)
            const result = await ttl(key, redisClient)
            if (result > 0) {
                await expireAsync(key, result)
                return resolve("OK")
            }
            await expireAsync(key, 30 * 60)
            return resolve("OK")
        }
        catch (err) {
            return reject(err)
        }
    })
}

function ttl(key, redisClient) {
    return new Promise(async (resolve, reject) => {
        try {
            const ttlAsync = promisify(redisClient.ttl).bind(redisClient)
            const result = await ttlAsync(key)
            return resolve(result)
        }
        catch (err) {
            return reject(err)
        }
    })
}

module.exports = {
    set(key, array) { return set(key, array) },
    del(key) { return del(key) },
    get(key) { return get(key) }
}