const User = require('../schemas/user.schema');

const findUser = async (email) => {
    return User.findOne({email});
}
const registerUser = async (email, password) => {
    return User.create({email, password});
}

const authenticateUser = async (email, password) => {
    return User.findOne({email, password});
}

const setToken = async (email, token) => {
    return User.updateOne({email}, {token});
}

module.exports = {
    findUser,
    registerUser,
    authenticateUser,
    setToken,
}