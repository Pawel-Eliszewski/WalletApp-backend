const Transaction = require('../schemas/transaction.schema');

const addTransaction = async (type, category, amount, date, comment, owner) => {
    return Transaction.create({type, category, amount, date, comment, owner});
}

const getTransactionById = async (transactionId) => {
    return Transaction.findOne({transactionId});
}

const getUsersTransactions = async (userId) => {
    return Transaction.find({userId});
}

module.exports = {
    addTransaction,
    getTransactionById,
    getUsersTransactions
}