import env from './dotenv';
import { UIMSG_1 } from './UI_messages';

// Import required modules
import fs from 'fs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Cryptr from 'cryptr';
import SendMSG from './sendmsg';
import { logprefix } from './logs';
import mongoose from 'mongoose';
import { AccountsCollection, userDataCollection } from './database';
import { LoginfoDecryptionKey } from '../common/KEYS';
import { TokenPayload, AuthenticateInterface } from './interfaces';

const findAccountByEmail = <T extends { _doc?: TokenPayload }>(
    email: string,
    collection: T[]
): T | undefined => {
    for (const account of collection) {
        // Checking if the user exists in the database
        const decryptedEmail = LoginfoDecryptionKey.decrypt(account._doc?.email || '').trim();
        
        if (decryptedEmail === email.trim()) {
            return account;
        }
    }
    return undefined;
};

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
const MainAuthentication = async (req: any, res: any, callBack: Function, APIverison:boolean = false, callBackNeedsAccount:boolean = false) => {
    try {
        const Collection: any = await AccountsCollection.find();
        const token = req.cookies.accessToken;

        if (!token) return SendMSG(`Account Required to Access The Requested Page`, 401, res, APIverison)
        if (!(Authenticate as AuthenticateInterface).isValidAccount(token)) return SendMSG(`Your Token is Corrupted`, 401, res, APIverison)

        // If The Token is Provided Then
        const decodedToken: any = jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY'));

        let EmailMatchedAcc: any = findAccountByEmail(LoginfoDecryptionKey.decrypt((decodedToken as TokenPayload).email), Collection)

        if (!EmailMatchedAcc) return SendMSG(`Invalid Token, User Doesn't exist`, 401, res, APIverison)

        // If The User Exists Then
        try {
            const PasswordsMatch = crypto.timingSafeEqual(
                Buffer.from((EmailMatchedAcc as TokenPayload).password),
                Buffer.from((decodedToken as TokenPayload).password)
            );

            if (PasswordsMatch) return (callBackNeedsAccount) ? callBack(EmailMatchedAcc) : callBack();

            return SendMSG(`Invalid Token, Incorrect Password`, 401, res, APIverison)

        } catch (error2) {
            return SendMSG(`Internal Server Error, while Authentication!`, 500, res, APIverison)
        }

    } catch (error1: any) {
        try { return SendMSG(error1.message, 403, res, APIverison) } catch (e) { }
    }
}

const Authenticate: object = {
    /**
    * Checks If The Account is Valid Returns Boolean
    * @param  {string} token The Token
    * @return {boolean}      
    */
    // Validation Methods
    isTokenCorrupt: async (token: string) => {
        try{
            jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY'));
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
    isValidAccount: async (token: string) => { // Checks If the Account is valid Returns Boolean
        try {
            if (!token) return false;
            // If The Token is Provided Then
            const decodedToken = jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY'));
            
            const Collection: any = await AccountsCollection.find()

            const EmailMatchedAcc = findAccountByEmail(LoginfoDecryptionKey.decrypt((decodedToken as TokenPayload).email).trim(), Collection)

            // If no Account Found
            if (!EmailMatchedAcc) return false;

            // If The User Exists Then
            try {
                const PasswordsMatch = crypto.timingSafeEqual(
                    Buffer.from((EmailMatchedAcc as TokenPayload).password),
                    Buffer.from((decodedToken as TokenPayload).password)
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
    isAdmin: async (token: string) => {
        if (!token) return false
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY'));
        } catch (error) {
            return false
        }

        if (await (Authenticate as AuthenticateInterface).isValidAccount(token)) {
            const Collection: any = await AccountsCollection.find();
            let MatchedAccount: any = findAccountByEmail(LoginfoDecryptionKey.decrypt((decodedToken as TokenPayload).email), Collection)

            
            return ((MatchedAccount as TokenPayload).role.toLowerCase() == "admin")? true: false
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
    byToken: async (req: any, res: any, next: Function) => { // Token Authentication
        MainAuthentication(req, res, next, false);
    },
    /**
    * Middleware for Cookie Based Token Authentication Administrators Only
    * @param  {object} req The Response Object
    * @param  {object} res The Request Object
    * @param {Function} callBack Callback Function to run Upon Success
    * @return {null}      
    */
    byTokenAdminOnly: async (req: any, res: any, next: Function) => { // Token Authentication for Admins Only
        await MainAuthentication(req, res, (Account: object) => {
            ((Account as TokenPayload).role.toLowerCase() == "admin") ?
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
    byTokenAPI: async (req: any, res: any, next: Function) => {
        await MainAuthentication(req, res, next, true);
    },
    /**
    * Middleware for Cookie Based Token Authentication API version Administrators Only
    * @param  {object} req The Response Object
    * @param  {object} res The Request Object
    * @param {Function} callBack Callback Function to run Upon Success
    * @return {null}      
    */
    byTokenAdminOnlyAPI: async (req: any, res: any, next: Function) => {
        await MainAuthentication(req, res, (Account: object) => {
            ((Account as TokenPayload).role.toLowerCase() == "admin") ?
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
    none: (req: any, res: any, next: Function) => { // No Authentication 
        next();
    }
}
export default Authenticate