const redis = require("redis")
const { promisify } = require("util")

module.exports = {
    set(key, array) { return set(key, array) },
    get(key) { return get(key) },
    del(key) { return del(key) }
}

function set(key, array) {
    return new Promise(async (resolve, reject) => {
        const redisClient = redis.createClient()
        const setAsync = promisify(redisClient.set).bind(redisClient)
        const data = JSON.stringify(array)
        try {
            await setAsync(key, data)
            await expire(key)
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
        const delAsync = promisify(redisClient.del).bind(redisClient)
        try {
            await delAsync(key)
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
        const getAsync = promisify(redisClient.get).bind(redisClient)
        try {
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

function expire(key) {
    return new Promise(async (resolve, reject) => {
        const redisClient = redis.createClient()
        const expireAsync = promisify(redisClient.expire).bind(redisClient)
        try {
            const result = await ttl(key)
            if(result > 0) {
                await expireAsync(key, result)
                return resolve("OK")
            }
            await expireAsync(key, 10)
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

function ttl(key) {
    return new Promise(async (resolve, reject) => {
        const redisClient = redis.createClient()
        const ttlAsync = promisify(redisClient.ttl).bind(redisClient)
        try {
            const result = await ttlAsync(key)
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