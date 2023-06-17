const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require('./models/userModel');
const OTP = require('./models/otpModel');
const Transaction = require("./models/transactionModel");

const app = express();
const PORT = 8080;
const uri = `mongodb+srv://giovanajohnson14:Gio202314@cluster0.jidxyct.mongodb.net/?retryWrites=true&w=majority`;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
const connect = async () => {
    try {
        await mongoose.connect(uri)
            .then(() => {
                console.log(`Successfully connected to DB...`);
            });
    } catch(err) {
        console.log('Error connecting to DB: ', err);
    }
}
connect();

// Endpoints
app.get('/user', async (req, res) => {

    try {
        const user = await User.findOne();

        if(user) {
            res.status(200).json({ user });
        }
    } catch(err) {
        res.status(500).json({ status: "invalid" })
    }
});

app.get('/signout', async (req, res) => {

    try {
        const user = await User.findOne();

        if(user) {
            await User.findByIdAndUpdate(user.id, { signOutCount: (user.signOutCount + 1) });
            res.status(200).json({ user });
        }
    } catch(err) {
        res.status(500).json({ status: "invalid" })
    }
});

app.post('/auth', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne();

        if(user) {
            await User.findByIdAndUpdate(user.id, { signInCount: (user.signInCount + 1) });
        }

        if(user && user.status === "blocked" || user && user.username === username && user.password === password) {
            res.status(200).json({ status: user.status });
        } else {
            res.status(200).json({ status: "invalid" });
        }
    } catch(err) {
        res.status(500).json({ status: "invalid" });
    }
});

app.post('/otp', async (req, res) => {
    const { otp } = req.body;
    try {
        const selectedOTP = await OTP.findOne();

        if(selectedOTP && selectedOTP.value === otp) {
            await OTP.findByIdAndDelete(selectedOTP.id).then(() => {
                res.status(200).json({ status: "valid" });
            });
        } else {
            res.status(200).json({ status: "invalid" });
        }
    } catch(err) {
        res.status(500).json({ message: err });
    }
});

app.get('/balance', async (req, res) => {
    try {
        const user = await User.findOne();

        if(user && user.balance) {
            res.status(200).json({balance: user.balance});
        } else {
            res.status(404).json({ message: 'Could not retrieve balance' });
        }
    } catch(err) {
        res.status(500).json({ message: err });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();

        if(transactions) {
            res.status(200).json({ transactions: transactions });
        } else {
            res.status(404).json({ message: 'Could not retrieve transactions' });
        }
    } catch(err) {
        res.status(500).json({ message: err });
    }
});

app.post('/execute', async (req, res) => {
    const { amount, beneficiary } = req.body;

    try{
        const user = await User.findOne();

        if(user) {
            const balance = (user.balance - amount);

            let fields = {
                transactionCount: (user.transactionCount + 1),
                balance
            };

            let message = 'active'

            if(user.transactionCount >= 2 || beneficiary === 'Carl Quedenfeld') {
                fields = {
                    ...fields,
                    status: 'blocked'
                }
                message = "blocked"
            }

            await User.findByIdAndUpdate(user.id, fields);
            await Transaction.create(req.body);

            res.status(200).json({ 
                success: true, 
                message,
                balance
            });
        }
    } catch(err) {
        res.status(500).json({ 
            success: false,
            message: "failed"
        });
    }
});


// Populate Data
app.post('/populateOTP', async (req, res) => {
    const values = [
        '978253', '556631', '631461',
        '576594', '714205', '647327',
        '775684', '781814', '828937'
    ];

    let addCount = 0
    let failed = false;

    for(let value of values) {
        await OTP.create({ value }).then(() => {
            addCount += 1;
        })
        .catch(err => {
            failed = true;
            res.status(500).json({ message: err });
        });
    }
    if (!failed) {
        res.status(200).json({ message: `${addCount} of ${values.length} OTPs added` });
    }
});

app.post('/populateTransaction', async (req, res) => {
    const transactions = [
        {
            date: '26/06/2021',
            description: 'Payment to MorphoMFG',
            beneficiary: 'MorphoMFG',
            amount: 98000,
            type: 'withdraw',
        },
        {
            date: '01/07/2021',
            description: 'Deposit from Wuxi Shipyard',
            beneficiary: 'Wuxi Shipyard',
            amount: 78000,
            type: 'deposit',
        },
        {
            date: '15/07/2021',
            description: 'Advance Draw Transfer to 9696',
            beneficiary: '9696',
            amount: 66000,
            type: 'withdraw',
        },
        {
            date: '30/07/2021',
            description: 'Deposit from ALMACO Group',
            beneficiary: 'ALMACO Group',
            amount: 246000,
            type: 'deposit',
        },
        {
            date: '12/08/2021',
            description: 'Payment Reversal',
            beneficiary: 'none',
            amount: 15000,
            type: 'deposit',
        },
        {
            date: '18/08/2021',
            description: 'Payment to IOE IMPaC Offshore',
            beneficiary: 'IOE IMPaC Offshore',
            amount: 102000,
            type: 'withdraw',
        },
        {
            date: '29/08/2021',
            description: 'Payment to Jiangsu Nanji Machinery',
            beneficiary: 'Jiangsu Nanji Machinery',
            amount: 12000,
            type: 'withdraw',
        },
        {
            date: '14/09/2021',
            description: 'Payment to TURBO-TECHNIK',
            beneficiary: 'TURBO-TECHNIK',
            amount: 75000,
            type: 'withdraw',
        },
        {
            date: '11/06/2022',
            description: 'Appleton Marine Inc',
            beneficiary: 'Appleton Marine Inc',
            amount: 2000,
            type: 'withdraw',
        },
        {
            date: '12/12/2022',
            description: 'Payment Reversal',
            beneficiary: 'none',
            amount: 900,
            type: 'deposit',
        },
        {
            date: '17/03/2023',
            description: 'CUSTOM SETTLEMENT',
            beneficiary: 'none',
            amount: 1900000,
            type: 'deposit',
        },
    ];

    let txnCount = 0;
    let failed = false;

    for(let transaction of transactions) {
        await Transaction.create(transaction).then(() => {
            txnCount += 1;
        })
        .catch(() => {
            failed = true;
            res.status(500).json({ message: err });
        })
    }

    if (!failed) {
        res.status(200).json({ message: `${txnCount} of ${transactions.length} transactions added` });
    }
});

app.post('/populateUser', async (req, res) => {
    await User.create(req.body).then((user) => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});