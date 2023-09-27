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

const getUserStatisticsByDate = async (userId, transactionsDate) => {
    const transactions = await getUsersTransactions(userId);
    const transactionsFilteredByDate = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth() + 1;
        const [year, month] = transactionsDate.split('-').map(Number);
        return transactionYear === year && transactionMonth === month;
    });
    let sumOfIncome = 0;
    let sumOfExpense = 0;

    for (const transaction of transactionsFilteredByDate) {
        if (transaction.type === 'income') {
            sumOfIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
            sumOfExpense += transaction.amount;
        }
    }
    return [transactionsFilteredByDate, sumOfIncome, sumOfExpense];
}

module.exports = {
    addTransaction,
    getTransactionById,
    getUsersTransactions,
    getUserStatisticsByDate,
}