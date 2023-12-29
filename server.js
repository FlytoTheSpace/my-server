// Imports

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5500;

const path = require('path');
const fs = require('fs');
const os = require('os');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');

const { decode } = require('punycode');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { mergePDFs } = require("./mergepdfs");
const GenRandomChar = require("./assets/randomchars");
const authenticate = require('./assets/authenticate');
const { UIMSG_1 } = require('./assets/UI_messages');
const { updateMusicAPI } = require('./assets/MusicListAPI');
const { logprefix } = require('./assets/logs');
const { LocalIPv4 } = require('./assets/ip');

// Other
const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 1 });
updateMusicAPI();
let Accounts;


// Connecting to The Database
const mongodbURI = process.env.MONGODB_URI;

mongoose.connect(mongodbURI, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

const AccountsCollection = mongoose.model('Accounts', mongoose.Schema({
    username: String,
    email: String,
    password: String,
}), 'accounts');

// Middlewares

app.use(express.static(path.join(__dirname, "server")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/profileinfofetch', (req, res) => {
    try {
        let token = req.headers.authorization;
        let decodedToken = jwt.verify(token, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY)

        let decryptedUsername = LoginfoDecryptionKey.decrypt(decodedToken.username);
        let decryptedEmail = LoginfoDecryptionKey.decrypt(decodedToken.email);

        let ProfileInfo = {
            'username': decryptedUsername,
            'email': decryptedEmail
        }

        res.send(ProfileInfo)
    } catch (error) {
        console.log(error)
    }

})
// Requests
app.post('/merge', upload.array('pdfs', 2), async (req, res) => {
    try {
        const generatedPDFName = await mergePDFs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));
        res.redirect(`http://${LocalIPv4()}:${port}/public/${generatedPDFName}.pdf`);
    } catch (error) {
        console.error(`${logprefix('server')} + ${error}`);
        res.status(500).send(`${logprefix('server')} Internal Server Error`);
    }
});
app.post(`/registerSubmit`, async (req, res) => {
    try {

        // throwing errors upon empty
        {
            const usernameFieldEmpty = req.body.username == null || req.body.username == undefined;
            const emailFieldEmpty = req.body.email == null || req.body.password == undefined;
            const passwordFieldEmpty = req.body.password == null || req.body.password == undefined

            if (usernameFieldEmpty) {
                res.send("Username Field can't be empty")
            } else if (emailFieldEmpty) {
                res.send("Email Field can't be empty")
            } else if (passwordFieldEmpty) {
                res.send("Password Field can't be empty")
            }
        }

        // Encrypting Data
        const GeneratedSalt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, GeneratedSalt)
        const EncrytUsername = LoginfoDecryptionKey.encrypt(req.body.username)
        const EncrytEmail = LoginfoDecryptionKey.encrypt(req.body.email)

        const user = {
            username: EncrytUsername,
            email: EncrytEmail,
            password: hashedPassword
        };

        // Adding User to the Database 
        const newAccount = new AccountsCollection(user);
        newAccount.save();
        console.log('Registered New User', req.body.username);
        // Generating a Token
        const token = jwt.sign(user, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);


        // Assigning the token and Redirecting
        res.cookie('accessToken', token, {
            httpOnly: false,
            path: '/'
        }).status(201).send('Registered Your Account!');

    } catch (error) {
        console.error(`${logprefix('server')} ${error}`);
        res.status(500).send(`${logprefix('server')} Internal Server Error`);
    }
})
app.post(`/loginSubmit`, async (req, res) => {
    try {
        // if (req.headers.origin !== `http://${LocalIPv4()}:${port}/login`) {
        //     res.send('Unauthorized Connection denied')
        // } else {

        // Checking if the user exists
        let EmailMatchedAcc;
        for (const account of await AccountsCollection.find()) {
            if (LoginfoDecryptionKey.decrypt(account.email) == req.body.email) {
                EmailMatchedAcc = account._doc;
            }
        }
        if (EmailMatchedAcc === undefined || EmailMatchedAcc === null) {
            res.status(404).send("The User Doesn't exist!")
        } else {

            // If the user exists then:
            try {

                // Checking if Password Matches
                const PasswordsMatch = await bcrypt.compare(req.body.password, EmailMatchedAcc.password)

                if (PasswordsMatch) {

                    // Generating a Token
                    const token = jwt.sign(EmailMatchedAcc, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

                    // Assigning and Redirecting
                    res.cookie('accessToken', token, {
                        httpOnly: false,
                        path: '/'
                    }).status(202).send(`Successful Login!`);

                    console.log(`${logprefix('server')} ${LoginfoDecryptionKey.decrypt(EmailMatchedAcc.username)} has Logged in`)
                }
                // On Wrong Password
                else {
                    res.status(406).send("Incorrect Password!");
                }

                // Handling Errors while Passwords matching
            } catch (err) {
                console.log(`${logprefix('server')} ${err}`)
                res.status(500).send("Internal Server Error While Comparing Passwords!")
            }
        }
        // }
    } catch (error) {
        console.error(`${logprefix('server')} ${error}`);
        res.status(500).send("Internal Server Error!");
    }
})

// Routes


/* app.get(`/${process.env.API_ACCOUNTS_URL}`, (req, res)=>{
    fs.readFile('credientials/accounts.json', 'utf8', (err,data) => {
        res.json(JSON.parse(data))
    })
    console.log(`${logprefix('server')} Credientials has Been fetched!`)
}) */

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/administrator', (req, res) => {
    res.sendFile(path.join(__dirname, './server/admin.html'))
})
app.get('/alarm', (req, res) => {
    res.sendFile(path.join(__dirname, './server/alarm.html'))
})
app.get('/data', async (req, res) => {
    authenticate.byToken(req, res, 'strict', await AccountsCollection.find({ email: jwt.verify(req.cookies.accessToken, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).email}));
    try {
        res.sendFile(path.join(__dirname, './server/data.html'))
    } catch (err) {
        // if (err.message == "Cannot set headers after they are sent to the client"){}
        // else{console.log(err.message)}
        console.log(err)
    }
})
/* This is an Example of How to use Strict Mode
app.get('/data', (req, res) => {
    authenticate.byToken(req, res, 'strict');
    try{
        res.sendFile(path.join(__dirname, './server/data.html'))
    }catch(err){
        if (err.name == "Can't set headers after they are sent."){

        } else {
            console.log(err)
        }
    }
}) */
app.get('/experiments', (req, res) => {
    res.sendFile(path.join(__dirname, './server/experiments.html'))
})
app.get('/gradient-generator', (req, res) => {
    res.sendFile(path.join(__dirname, './server/gradient-generator.html'))
})
app.get('/html-notes', (req, res) => {
    res.sendFile(path.join(__dirname, './server/html-tutorial.html'))
})
app.get('/javascript-notes', (req, res) => {
    res.sendFile(path.join(__dirname, './server/javascript-tutorial.html'))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './server/login.html'))
})
app.get('/music', (req, res) => {
    res.sendFile(path.join(__dirname, './server/music.html'))
})
app.get('/musiclist', (req, res) => {
    updateMusicAPI();
    res.json(JSON.parse(fs.readFileSync('APIs/musiclist.json', 'utf8')))
})
app.get('/password-generator', (req, res) => {
    res.sendFile(path.join(__dirname, './server/password-generator.html'))
})
app.get('/pdf-merger', (req, res) => {
    res.sendFile(path.join(__dirname, './server/pdfmerger.html'))
})
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, './server/profile.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './server/register.html'))
})

// 404 Page

app.use((req, res, next) => {
    res.status(404).send(UIMSG_1("Error 404 Page Not Found;"));
});

// Starting Server
app.listen(port, () => {
    console.log(`${logprefix('server')} Server started on http://${LocalIPv4()}:${port}`);
});

(async()=>{module.exports = { AccountsCollection }})();