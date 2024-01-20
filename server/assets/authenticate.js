require('dotenv').config();
const { UIMSG_1 } = require('./UI_messages');

// Import required modules
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const SendMSG = require('./sendmsg')
const { logprefix } = require('./logs');
const mongoose = require('mongoose');
const { AccountsCollection, userDataCollection } = require('./database')
const { LoginfoDecryptionKey } = require('../common/KEYS')

// Send An Error
/**
 * @FlytoTheSpace
 * @param {string} msg Request Object.
 * @param {number} statusCode Response Object.
 * @param {Function} res Callback Function to run Upon Success.
 * @param {boolean} [API=false] API version?. Default: false
 * @return {} Code to send Error Message
*/

// Template for Authentication Can be Extended Further
/**
 * @FlytoTheSpace
 * @param {object} req Request Object.
 * @param {object} res Response Object.
 * @param {Function} callBack Callback Function to run Upon Success.
 * @param {boolean} [APIverison=false] API version?. Default: false
 * @param {boolean} [callBackNeedsAccount=false] Callback Function Needs Matched Account?. Default: false
 * @return {Promise<void>} Returns Nothing
*/
const MainAuthentication = async (req, res, callBack, APIverison = false, callBackNeedsAccount = false) => {
    try {
        const Collection = await AccountsCollection.find();
        const token = req.cookies.accessToken;

        if (!token) return SendMSG(`Account Required to Access The Requested Page`, 401, res, APIverison)
        if (!Authenticate.isValidAccount(token)) return SendMSG(`Your Token is Corrupted`, 401, res, APIverison)

        // If The Token is Provided Then
        const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

        let EmailMatchedAcc;
        for (const account of Collection) {
            // Checking if the user exists in the database
            if (LoginfoDecryptionKey.decrypt(account._doc.email).trim() == LoginfoDecryptionKey.decrypt(decodedToken.email).trim()) {
                EmailMatchedAcc = account._doc;
            };
        };
        if (!EmailMatchedAcc) return SendMSG(`Invalid Token, User Doesn't exist`, 401, res, APIverison)

        // If The User Exists Then
        try {
            const PasswordsMatch = crypto.timingSafeEqual(
                Buffer.from(EmailMatchedAcc.password),
                Buffer.from(decodedToken.password)
            );

            if (PasswordsMatch) return (callBackNeedsAccount) ? callBack(EmailMatchedAcc) : callBack();

            return SendMSG(`Invalid Token, Incorrect Password`, 401, res, APIverison)

        } catch (error2) {
            return SendMSG(`Internal Server Error, while Authentication!`, 500, res, APIverison)
        }

    } catch (error1) {
        try { return SendMSG(error1.message, 403, res, APIverison) } catch (e) { }
    }
}

const Authenticate = {
    /**
    * Checks If The Account is Valid Returns Boolean
    * @param  {string} token The Token
    * @return {boolean}      
    */
    // Validation Methods
    isTokenCorrupt: async (token) => {
        try{
            jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
            return false
        } catch {
            return true
        }
    },
    /**
    * Checks If The Account is Valid Returns Boolean
    * @param  {string} token The Token
    * @return {boolean}      
    */
    // Validation Methods
    isValidAccount: async (token) => { // Checks If the Account is valid Returns Boolean
        try {
            if (!token) return false;
            // If The Token is Provided Then
            const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

            let EmailMatchedAcc;

            for (const account of await AccountsCollection.find()) {
                // Checking if the user exists in the database
                if (
                    LoginfoDecryptionKey.decrypt(account._doc.email).trim() == LoginfoDecryptionKey.decrypt(decodedToken.email).trim()
                ) {
                    EmailMatchedAcc = account._doc;
                };
            };

            // If no Account Found
            if (!EmailMatchedAcc) return false

            // If The User Exists Then
            try {
                const PasswordsMatch = crypto.timingSafeEqual(
                    Buffer.from(EmailMatchedAcc.password),
                    Buffer.from(decodedToken.password)
                );
                // Passwords Match
                if (PasswordsMatch) return true
                // If Passwords doesn't match
                return false

            } catch (error2) {
                return false
            }

        } catch (error1) {
            return false
        }
    },
    /**
    * Checks If The User is An Admin Returns Boolean
    * @param  {string} token The Token
    * @return {boolean}      
    */
    isAdmin: async (token) => {
        if (!token) return false
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
        } catch (error) {
            return false
        }

        if (Authenticate.isValidAccount(token)) {
            let MatchedAccount;
            for (const account of await AccountsCollection.find()) {
                if (
                    LoginfoDecryptionKey.decrypt(account._doc.email) ==
                    LoginfoDecryptionKey.decrypt(decodedToken.email)
                ) {
                    MatchedAccount = account._doc;
                }
            }

            
            return (MatchedAccount.role.toLowerCase() == "admin")? true: false
        } else {
            return false
        }

    },
    // Middlewares
    /**
    * Middleware for Cookie Based Token Authentication
    * @param  {object} req The Response Object
    * @param  {object} res The Request Object
    * @param {Function} callBack Callback Function to run Upon Success
    * @return {null}      
    */
    byToken: async (req, res, next) => { // Token Authentication
        MainAuthentication(req, res, next, false);
    },
    /**
    * Middleware for Cookie Based Token Authentication Administrators Only
    * @param  {object} req The Response Object
    * @param  {object} res The Request Object
    * @param {Function} callBack Callback Function to run Upon Success
    * @return {null}      
    */
    byTokenAdminOnly: async (req, res, next) => { // Token Authentication for Admins Only
        await MainAuthentication(req, res, (Account) => {
            (Account.role.toLowerCase() == "admin") ?
                next():
                SendMSG("You're Not an Admin", 401, res, false)
        }, false, true)
    },
    /**
    * Middleware for Cookie Based Token Authentication API version
    * @param  {object} req The Response Object
    * @param  {object} res The Request Object
    * @param {Function} callBack Callback Function to run Upon Success
    * @return {null}      
    */
    byTokenAPI: async (req, res, next) => {
        await MainAuthentication(req, res, next, true);
    },
    /**
    * Middleware for Cookie Based Token Authentication API version Administrators Only
    * @param  {object} req The Response Object
    * @param  {object} res The Request Object
    * @param {Function} callBack Callback Function to run Upon Success
    * @return {null}      
    */
    byTokenAdminOnlyAPI: async (req, res, next) => {
        await MainAuthentication(req, res, (Account) => {
            (Account.role.toLowerCase() == "admin") ?
                next() :
                SendMSG("You're Not an Admin", 401, res, true)
        }, true, true)
    },
    // Other

    /**
    * No Authentication
    * @param  {object} req The Response Object
    * @param  {object} res The Request Object
    * @param {Function} callBack Callback Function to run Upon Success
    * @return {null}      
    */
    none: (req, res, next) => { // No Authentication 
        next();
    }
}

module.exports = Authenticate