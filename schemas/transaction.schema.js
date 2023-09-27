const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    type: {
        type:String,
        required: [true, 'Type is required'],
    },
    category: {
        type:String,
        required: [true, 'Category is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    },
    comment: {
        type: String,
        default: null,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
})

const Transaction = mongoose.model('transactions', TransactionSchema);
module.exports = Transaction;