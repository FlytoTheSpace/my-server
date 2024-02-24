const path = require('path')
const fs = require('fs')
const ROOT = require('./assets/root')
const GetABCChars = () => {
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    Count = 24

    for (let i = 0; i <= Count; i++) {
        console.log(chars[i])
    }
}
// GetABCChars()

// (async () => {
//     const Filetxt = fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8')
//     const File = Buffer.from(Filetxt)
//     console.log(File)
//     fs.writeFileSync(path.join(ROOT, 'config2.json'),File)
// })()

// const buf = Buffer.from("Hello World");
// console.log(buf) // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
// console.log(buf.toString('utf8')); // "Hello Wolrd"

// buf.write("Hi", 0); // Overwrites the buffer with "Hi" at the beginning
// console.log(buf) // <Buffer 48 69 6c 6c 6f 20 57 6f 72 6c 64>
// console.log(buf.toString('utf8')) // Hillo World

/*
const crypto = require('crypto');

const accounts = []

function genSalt(length=16){
    return crypto.randomBytes(length/2)
        .toString('hex')
}
function hash(message, salt){
    return crypto.scryptSync(message, salt, 64)
        .toString('base64')
}

function register(username, password){
    if (!(username || password)) throw new Error("Can't login without a username or Password");
    
    const salt = genSalt(16);
    const hashedPassword = hash(password, salt)

    const user = {
        username: username,
        password: `${salt}:${hashedPassword}`
    }

    accounts.push(user)
    console.log("Successfully Registered")
}

function login(username, password){
    if(!(username || password)) throw new Error("Can't login without a username or Password");

    let matchedAccount = accounts.find(account=>account.username===username)
    if (!matchedAccount) throw new Error("Account doesn't exist");

    const [salt, MatchedAccountPassword] = matchedAccount.password.split(':')

    if(crypto.timingSafeEqual(
        Buffer.from(hash(password, salt)),
        Buffer.from(MatchedAccountPassword)
    )) return console.log("Successful Login!")
    throw new Error("Incorrect Password")
}
const salt = genSalt(16)
console.log(hash("Hello, World", salt), salt)
register("Dave", "123")
// login("James", "124") // Error: Account doesn't exist
// login("Dave", "124") // Error: Incorrect Password
login("Dave", "123") // Successful Login!

const crypto = require('crypto');

function hash(message, key){
    return crypto.createHmac('sha256', key)
        .update(message)
        .digest('base64');
}

const key = 'mySecretKey'
const key2 = 'mySecretKey2'
const message = "Hello, World";

console.log(hash(message, key)) // tdZ533m1DhFqLpIb7y3ze14+JfNsQdp0z6nS/ES/bUQ=
console.log(hash(message, key)) // tdZ533m1DhFqLpIb7y3ze14+JfNsQdp0z6nS/ES/bUQ=
console.log(hash(message, key2)) // JrHKS77Nefa2nQ61UJX87nWbSy25ye+3vkPEh4uOA+0=
*/

const crypto = require('crypto');

// Generate a key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048 , // Length of Keys in Bits
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem' // Base64
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem' // Base64
    }
});

// Signing
const message = "Hello, World"
const signature = crypto.createSign('rsa-sha256')
    .update(message)
    .sign(privateKey, 'base64')

// Your publicKey, signature and message should be sent to the client
// Verifing
console.log('signature ',signature)

const isVerified = crypto.createVerify('rsa-sha256')
    .update(message)
    .verify(publicKey, signature, 'base64')

console.log(isVerified) // true