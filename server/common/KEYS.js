const Cryptr = require('cryptr');
const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 1
});
module.exports = { LoginfoDecryptionKey }