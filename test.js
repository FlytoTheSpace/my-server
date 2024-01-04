const Cryptr = require('cryptr');

const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 1
});

console.log(LoginfoDecryptionKey.decrypt('y7qqazcsDiV5eLyhPI04waHkt/NPhB1jUyzJ9JiUl7pm30QNzbvo/dhcsA=='));