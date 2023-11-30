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
                const decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
                fs.readFile('credientials/accounts.json', 'utf8', async (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let Accounts = JSON.parse(data);
                        const EmailMatchedAcc = Accounts.find(acc => acc.email == decodedToken.email);
                        if (EmailMatchedAcc === undefined || EmailMatchedAcc === null) {
                            console.log("Invalid Token, The User Doesn't seems to exist")
                        } else {
                            try {
                                if (crypto.timingSafeEqual(Buffer.from(decodedToken.password), Buffer.from(EmailMatchedAcc.password))) {

                                    console.log(`[${new Date().toLocaleTimeString()}] Authenticated user: ${LoginfoDecryptionKey.decrypt(decodedToken.username)}`);
                                } else {
                                    console.log(decodedToken.password + "\n" + EmailMatchedAcc.password)
                                    console.log("Invalid Token, Incorrect Password");
                                }
                            } catch (err) {
                                console.log(`[${new Date().toLocaleTimeString()}] ${err}`)
                                console.log("Status: 500, Internal Server error while Authenticating with The Token")
                            }
                        }

                    }
                });
            }
        } catch (error) {
            console.log(`[${new Date().toLocaleTimeString()}] ${error}`)
        };
    }
}

module.exports = Authenticate