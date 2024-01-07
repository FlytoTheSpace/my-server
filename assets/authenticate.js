require('dotenv').config();
const { UIMSG_1 } = require('./UI_messages');

// Import required modules
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const { logprefix } = require('./logs');
const mongoose = require('mongoose');

// Connecting to The Database
const mongodbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ServerDB';

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


// Template for Authentication Can be Extended Further
const OAuth = async (req, res, callBack, APIverison, callBackNeedsAccount)=>{
    try {
        const Collection = await AccountsCollection.find();
        const token = req.cookies.accessToken;

        if (!token) {
            if (!APIverison) {
                res.status(401).send(UIMSG_1(`Account Required to Access The Requested Page`))
            } else {
                res.status(401).send(`Account Required to Access The Requested Page`);
            }
        } else if (token && !(await Authenticate.validateAccount(token))) {
            if (!APIverison) {
                res.status(401).send(UIMSG_1(`Your Token is Corrupted`))
            } else {
                res.status(401).send(`Your Token is Corrupted`)
            }
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
                if (!APIverison) {
                    res.status(404).send(UIMSG_1(`Invalid Token, User Doesn't exist`))
                } else {
                    res.status(404).send(`Invalid Token, User Doesn't exist`)
                }
                
            } else {
                // If The User Exists Then
                try {
                    const PasswordsMatch = crypto.timingSafeEqual(Buffer.from(EmailMatchedAcc.password), Buffer.from(decodedToken.password));
                    if (PasswordsMatch) {
                        if (callBackNeedsAccount){
                            callBack(EmailMatchedAcc);
                        } else {
                            callBack();
                        }
                    } else if (!PasswordsMatch) {
                        if (!APIverison) {
                            res.status(401).send(UIMSG_1("Invalid Token, Incorrect Password"));
                        } else {
                            res.status(401).send("Invalid Token, Incorrect Password");
                        }
                    }
                } catch (error2) {
                    if (!APIverison) {
                        res.status(500).send(UIMSG_1("Internal Server Error, while Authentication!"))
                    } else {
                        res.status(500).send(UIMSG_1("Internal Server Error, while Authentication!"))
                    }
                }
            }
        }
    } catch (error1) {
        try {
            if (!APIverison) {
                res.status(403).send(UIMSG_1(error1.message))
            } else {
                res.status(403).send(error1.message)
            }
        } catch (error) { }
    }
}

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
    validateAccount: async (token) => { // Validates The Account Return Boolean
        try {
            if (!token) {
                return false;
            }
            // If The Token is Provided Then
            const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

            let EmailMatchedAcc;
            for (const account of await AccountsCollection.find()) {
                // Checking if the user exists in the database
                if (LoginfoDecryptionKey.decrypt(account._doc.email).trim() == LoginfoDecryptionKey.decrypt(decodedToken.email).trim()) {
                    EmailMatchedAcc = account._doc;
                };
            };

            if (!EmailMatchedAcc) {
                return false
            }

            // If The User Exists Then
            try {
                const PasswordsMatch = crypto.timingSafeEqual(Buffer.from(EmailMatchedAcc.password), Buffer.from(decodedToken.password));
                if (PasswordsMatch) {
                    return true
                } else if (!PasswordsMatch) {
                    return false
                } else {
                    console.log("Something Went Wrong")
                    return false
                }
            } catch (error2) {
                console.log(error2.message)
                return false
            }
            
        } catch (error1) {
            console.log(error1.message)
            return false
        }
    },
    isAdmin: async (token)=>{
        if(!token){
            return false
        }
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
        } catch (error) {
            return false
        }
        if(await Authenticate.validateAccount(token)){
            if (decodedToken.role.toLowerCase() == "admin") {
                return true
            } else {
                false
            }
        } else {
            return false
        }
        
    },
    byToken: async (req, res, next) => { // Middleware for Authentication (no Manual work)
        OAuth(req, res, next, false);
    },
    byTokenAdminOnly: async (req, res, next) => { // Middleware for Authentication (no Manual work)
        await OAuth(req, res, (Account)=>{
            if (Account.role.toLowerCase() == "admin") {
                next();
            } else {
                res.status(401).send(UIMSG_1("You're Not an Admin"));
            }
        }, false, true)
    },
    byTokenAPI: async (req, res, next)=>{
        await OAuth(req, res, next, true);
    },
    byTokenAdminOnlyAPI: async (req, res, next) => { // Middleware for Authentication (no Manual work)
        await OAuth(req, res, (Account)=>{
            if (Account.role.toLowerCase() == "admin") {
                next();
            } else {
                res.status(401).send("You're Not an Admin");
            }
        }, true, true)
    },
    none: (req, res, next)=>{
        next();
    }
}

module.exports = Authenticate