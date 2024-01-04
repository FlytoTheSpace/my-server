const { UIMSG_1 } = require('./UI_messages');

// Import required modules
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const { logprefix } = require('./logs');
const mongoose = require('mongoose');

// Connecting to The Database
const mongodbURI = process.env.MONGODB_URI;

mongoose.connect(mongodbURI, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log(`${logprefix("Authentication")} Connected to MongoDB!`);
});

const AccountsCollection = mongoose.model('accounts', mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userID: Number
}), 'accounts');
// Load environment variables from .env file


require('dotenv').config();

// Initialize LoginfoDecryptionKey using Cryptr
const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 1
});

const Authenticate = {
    byTokenManual: async (request, response, strictMode, callBack) => { // For Manual Authentication
        try {
            const CallBackFunc = callBack
            const token = request.cookies.accessToken;

            if (!request.cookies.accessToken && strictMode) {
                response.send(UIMSG_1(`Account Required to Access The Requested Page`))
            } else {
                // If The Token is Provided Then
                const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

                let EmailMatchedAcc;
                for (const account of Collection) {
                    // Checking if the user exists in the database
                    if (LoginfoDecryptionKey.decrypt(account._doc.email).trim() == LoginfoDecryptionKey.decrypt(decodedToken.email).trim()) {
                        EmailMatchedAcc = account._doc;
                    };
                };

                if (!EmailMatchedAcc) {
                    response.status(404).send(UIMSG_1(`Invalid Token, User Doesn\'t exist`))
                } else {
                    // If The User Exists Then
                    try {
                        const PasswordsMatch = crypto.timingSafeEqual(Buffer.from(EmailMatchedAcc.password), Buffer.from(decodedToken.password));
                        if (PasswordsMatch) {
                            CallBackFunc();
                        } else if (!PasswordsMatch) {
                            if (strictMode) {
                                response.status(401).send(UIMSG_1("Invalid Token, Incorrect Password"));
                            }
                        }
                    } catch (error2) {
                        if (strictMode) {
                            response.status(500).send(UIMSG_1("Internal Server Error, while Authentication!"))
                        }
                    }
                }
            }
        } catch (error1) {
            if (strictMode) {
                try {
                    response.status(403).send(UIMSG_1(error1.message))
                } catch (error) {

                }
            }
        }
    },
    validateAccount: async (token, Collection) => { // Validates The Account Return Boolean
        try {
            if (!token) {
                return false;
            } else {
                // If The Token is Provided Then
                const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

                let EmailMatchedAcc;
                for (const account of Collection) {
                    // Checking if the user exists in the database
                    if (LoginfoDecryptionKey.decrypt(account._doc.email).trim() == LoginfoDecryptionKey.decrypt(decodedToken.email).trim()) {
                        EmailMatchedAcc = account._doc;
                    };
                };

                if (!EmailMatchedAcc) {
                    return false
                } else {
                    // If The User Exists Then
                    try {
                        const PasswordsMatch = crypto.timingSafeEqual(Buffer.from(EmailMatchedAcc.password), Buffer.from(decodedToken.password));
                        if (PasswordsMatch) {
                            return true
                        } else if (!PasswordsMatch) {
                            return false
                        }
                    } catch (error2) {
                        console.log(error2.message)
                        return false
                    }
                }
            }
        } catch (error1) {
            console.log(error1.message)
            return false
        }
    },
    byToken: async (req, res, next) => { // Middleware for Authentication (no Manual work)
        try {
            const Collection = await AccountsCollection.find();
            const token = req.cookies.accessToken;

            if (!req.cookies.accessToken) {
                res.send(UIMSG_1(`Account Required to Access The Requested Page`))
            } else {
                // If The Token is Provided Then
                const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

                let EmailMatchedAcc;
                for (const account of Collection) {
                    // Checking if the user exists in the database
                    if (LoginfoDecryptionKey.decrypt(account._doc.email).trim() == LoginfoDecryptionKey.decrypt(decodedToken.email).trim()) {
                        EmailMatchedAcc = account._doc;
                    };
                };
                if (!EmailMatchedAcc) {
                    res.status(404).send(UIMSG_1(`Invalid Token, User Doesn\'t exist`))
                } else {
                    // If The User Exists Then
                    try {
                        const PasswordsMatch = crypto.timingSafeEqual(Buffer.from(EmailMatchedAcc.password), Buffer.from(decodedToken.password));
                        if (PasswordsMatch) {
                            next();
                        } else if (!PasswordsMatch) {
                            res.status(401).send(UIMSG_1("Invalid Token, Incorrect Password"));
                        }
                    } catch (error2) {
                        res.status(500).send(UIMSG_1("Internal Server Error, while Authentication!"))
                    }
                }
            }
        } catch (error1) {
            try {res.status(403).send(UIMSG_1(error1.message))} catch (error) {}
        }
    },
    byTokenAdminOnly: async (req, res, next) => { // Middleware for Authentication (no Manual work)
        try {
            const Collection = await AccountsCollection.find();
            const token = req.cookies.accessToken;

            if (!req.cookies.accessToken) {
                res.send(UIMSG_1(`Account Required to Access The Requested Page`))
            } else {
                // If The Token is Provided Then
                const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

                let EmailMatchedAcc;
                for (const account of Collection) {
                    // Checking if the user exists in the database
                    if (LoginfoDecryptionKey.decrypt(account._doc.email).trim() == LoginfoDecryptionKey.decrypt(decodedToken.email).trim()) {
                        EmailMatchedAcc = account._doc;
                    };
                };
                if (!EmailMatchedAcc) {
                    res.status(404).send(UIMSG_1(`Invalid Token, User Doesn\'t exist`))
                } else {
                    // If The User Exists Then
                    try {
                        const PasswordsMatch = crypto.timingSafeEqual(Buffer.from(EmailMatchedAcc.password), Buffer.from(decodedToken.password));
                        if (PasswordsMatch) {
                            if(EmailMatchedAcc.role == "admin"){
                                next();
                            } else{
                                res.status(401).send(UIMSG_1("You're Not an Admin"));
                            }
                        } else if (!PasswordsMatch) {
                            res.status(401).send(UIMSG_1("Invalid Token, Incorrect Password"));
                        }
                    } catch (error2) {
                        res.status(500).send(UIMSG_1("Internal Server Error, while Authentication!"))
                    }
                }
            }
        } catch (error1) {
            try { res.status(403).send(UIMSG_1(error1.message)) } catch (error) { }
        }
    }
}

module.exports = Authenticate