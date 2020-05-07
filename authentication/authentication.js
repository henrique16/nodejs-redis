const jsonwebtoken = require("jsonwebtoken")
const config = require("../config/index.json")

const user_ = { id: 123 }

const token = {
    verify(token) {
        return jsonwebtoken.verify(token, config.secret)
    },
    get(expiresIn) {
        return jsonwebtoken.sign({}, config.secret, { expiresIn: expiresIn })
    }
}

async function validate(idUser) {
    try {
        if (!idUser) throw new Error("is not authenticated")
        const user = user_.id
        token.verify(user.token)
    }
    catch (error) {
        console.log(error)
        return error
    }
}

module.exports = {
    token: token,
    validate(idUser) { return validate(idUser) }
}