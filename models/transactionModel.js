const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const transactionSchema = Schema(
    {
        date: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        beneficiary: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Transaction = model('Transaction', transactionSchema);
module.exports = Transaction;