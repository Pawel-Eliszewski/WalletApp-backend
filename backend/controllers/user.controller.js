const User = require('../schemas/user.schema');

const findUserByEmail = async (email) => {
    return User.findOne({email});
}

const findUserById = async (userId) => {
    return User.findOne({userId});
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
    findUserByEmail,
    registerUser,
    authenticateUser,
    setToken,
    findUserById
}