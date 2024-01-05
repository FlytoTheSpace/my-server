require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');

const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 1
});

const getUserID = (token)=>{
    const userID = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).userID;
    return userID;
}
const getUsername = (token)=>{
    const Username = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).username;
    return Username;
}
const getEmail = (token)=>{
    const Email = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).email;
    return Email;
}
const getRole = (token)=>{
    const Role = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).role;
    return Role;
}

module.exports = { getUserID, getUsername, getEmail, getRole }