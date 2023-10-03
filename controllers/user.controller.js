const User = require('../schemas/user.schema');

const findUserByEmail = async (email) => {
    return User.findOne({email});
}
const findUserById = async (userId) => {
    return User.findOne({_id: userId});
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

const handleUserBalance = async (type, amount, owner) => {
    const user = await findUserById(owner);
    if (!user) {
        return {message: "User not found"};
    }
    let balance = user.balance;
    if (type === 'income') {
        balance += amount;
    } else if (type === 'expense') {
        balance -= amount;
    }
    return User.updateOne({_id: owner}, {balance: balance});
};

const getUserBalance = async (owner) => {
    const user = await findUserById(owner);
    return user.balance;
};

const updateUserBalance = async(owner, balance) => {
    return User.updateOne({_id: owner}, {balance: balance});
}

module.exports = {
    findUserByEmail,
    registerUser,
    authenticateUser,
    setToken,
    findUserById,
    handleUserBalance,
    getUserBalance,
    updateUserBalance,
}