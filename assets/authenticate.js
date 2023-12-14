const { UIMSG_1 } = require('./UI_messages');

// Import required modules
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');

// Load environment variables from .env file

require('dotenv').config();

// Initialize LoginfoDecryptionKey using Cryptr
const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 1 });

const Authenticate = {
    byToken: (request, response, mode) => {
        try {
            const token = request.cookies.accessToken;
            if (token == undefined || token == "null") {
                if(mode == 'strict'){
                    response.send('Account Required to access this page')
                } else{
                    console.log("error: token is undefined")
                }
            } else {
                try {
                    const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

                    fs.readFile('credientials/accounts.json', 'utf8', async (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let Accounts = JSON.parse(data);
                            const EmailMatchedAcc = Accounts.find(acc => acc.email == decodedToken.email);

                            if (EmailMatchedAcc === undefined || EmailMatchedAcc === null) {
                                if (mode == 'strict') {
                                    try {
                                        response.send("Access Denied, Invalid Token")
                                    } catch (error) {
                                        if (error.message == "Can't set headers after they are sent.") { }
                                        else { console.log(error) };
                                    }
                                }
                            } else {
                                try {
                                    if (crypto.timingSafeEqual(Buffer.from(decodedToken.password), Buffer.from(EmailMatchedAcc.password))) {
                                    } else {
                                        if (mode == 'strict') {
                                            try {
                                                response.send("Access Denied, Invalid Token")
                                            } catch (error) {
                                                if (error.message == "Can't set headers after they are sent.") { }
                                                else { console.log(error) };
                                            }
                                        }
                                    }
                                } catch (err) {
                                    console.log(`[${new Date().toLocaleTimeString()}] ${err}`)
                                    console.log("Status: 500, Internal Server error while Authenticating with The Token")
                                }
                            }

                        }
                    });
                } catch (error) {
                    try {
                        if (mode == 'strict') {
                            response.send(UIMSG_1(error.message))
                        }
                    } catch (error) {
                        if (error.message == "Can't set headers after they are sent.") { }
                        else { console.log(error) };
                    }
                }
            }
        } catch (error) {
            console.log(`[${new Date().toLocaleTimeString()}] ${error}`)
        };
    }
}

module.exports = Authenticate