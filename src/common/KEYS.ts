require('dotenv').config();
import Cryptr from 'cryptr';

// export const ACCOUNTS_TOKEN_VERIFICATION_KEY: any = process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY

export const LoginfoDecryptionKey = new Cryptr(ACCOUNTS_LOGINFO_DECRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 1
});
