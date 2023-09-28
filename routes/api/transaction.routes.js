const express = require('express');
const router = express.Router();
require('dotenv').config();
const auth = require("../../middlewares/auth");
const {addTransaction, getTransactionById, updateTransaction} = require('../../controllers/transaction.controller');
const {handleUserBalance, getUserBalance} = require('../../controllers/user.controller');
router.post('/', auth, async (req, res, next) => {
    try {
        const {type, category, amount, date, comment, owner} = req.body;
        const createdTransaction = await addTransaction(type, category, amount, date, comment, owner);
        if (type === 'income' || type === 'expense') {
            await handleUserBalance(type, amount, owner);
            const balance = await getUserBalance(owner);
            res.json({
                status: 'Success',
                code: 200,
                transactionID: createdTransaction._id,
                userBalance: balance
            })
        } else {
            res.json({
                status: 'Failure',
                code: 400,
                message: 'Wrong transaction type'
            })
        }

    } catch (err) {
        next(err);
    }
})

router.get('/category/:transactionId', auth, async (req, res, next) => {
    try {
        const {transactionId} = req.query;
        const transaction = await getTransactionById(transactionId);
        if (transaction) {
            res.json({
                status: 'Success',
                code: 200,
                data: transaction
            })
        } else {
            res.json({
                status: "Not found",
                code: 404,
                message: "Given transaction does not exist"
            })
        }
    } catch (err) {
        next(err);
    }
})

router.patch('/', auth, async (req, res, next) => {
    try {
        const {transactionId, type, category, amount, date, comment, owner} = req.body;
        const updateResult = await updateTransaction(transactionId, type, category, amount, date, comment, owner);
        if (updateResult.nModified > 0) {
            res.json({
                status: 'Success',
                code: 200,
                message: 'Transaction updated successfully'
            })
        } else {
            res.json({
                status: 'Failure',
                code: 400,
                message: 'Transaction not found or not updated'
            })
        }
    } catch (err) {
        next(err);
    }
})

module.exports = router;