const express = require('express')
const router = express.Router()
require('dotenv').config()
const auth = require("../../middlewares/auth");
const {addTransaction, getTransactionById} = require('../../controllers/transaction.controller')
router.post('/', auth, async (req, res, next) => {
    try {
        const {type, category, amount, date, comment, owner} = req.body;
        const createdTransaction = await addTransaction(type, category, amount, date, comment, owner);
        res.json({
            status: 'Success',
            code: 200,
            data: createdTransaction._id
        })
    } catch (err) {
        next(err);
    }
})

module.exports = router;