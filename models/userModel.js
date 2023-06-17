const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'username field required']
        },
        password: {
            type: String,
            required: [true, 'password field required']
        },
        transactionCount: {
            type: Number,
            required: [true, 'transactionCount field required']
        },
        balance: {
            type: Number,
            required: [true, 'balance field required']
        },
        status: {
            type: String,
            required: [true, 'status field required']
        },
        signInCount: {
            type: Number,
            required: [true, 'signInCount field required']
        },
        signOutCount: {
            type: Number,
            required: [true, 'signOutCount field required']
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;