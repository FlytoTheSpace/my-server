// Imports

require('dotenv').config();

// Express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;

// Built in Modules
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

// NPM Modules
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const { decode } = require('punycode');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

// Local Modules
const GenRandomChar = require("./assets/randomchars");
const Authenticate = require('./assets/authenticate');
const { UIMSG_1 } = require('./assets/UI_messages');
const { updateMusicAPI } = require('./assets/MusicListAPI');
const { logprefix } = require('./assets/logs');
const { LocalIPv4 } = require('./assets/ip');
const { getUserID, getUsername, getEmail, getRole } = require('./assets/getFunctions');
const { mergePDFs } = require("./scripts/mergepdfs");
const { deleteOldFiles } = require('./scripts/clean');
const { resolveSoa } = require('dns');
const { calculateBroadcastAddress, broadcastMessage } = require('./assets/broadcast')


// Other
const udpPort = 3001; // UDP port for broadcasting
const subnetMask = '255.255.255.0';

setInterval(deleteOldFiles, 30 * 60 * 1000);

const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 1
});
updateMusicAPI(); // Updating Music API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
// Function to set storage configuration dynamically
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        if (req.path === '/mergepdfs') {
            cb(null, 'uploads/pdfs/');
        } else if (req.path === '/cloudFilesUpload') {
            try {
                const UserID = jwt.verify(req.cookies.accessToken, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).userID
                const uploadPath = path.join(__dirname, `../cloud/${UserID}/`);

                cb(null, uploadPath);

                fs.mkdirSync(uploadPath, { recursive: true });
            } catch (error) {
                console.error('Error during directory creation:', error);
                cb(error);
            }
        } else {
            cb(new Error('Invalid upload path'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }); // Uploads

// Database
const mongodbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ServerDB';

mongoose.connect(mongodbURI, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log(`${logprefix("Database")} Connected to MongoDB!`);
});

const AccountsCollection = mongoose.model('Accounts', mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userID: Number,
    role: String
}), 'accounts');
const userDataCollection = mongoose.model('userData', mongoose.Schema({
    userID: Number,
    preferences: Object,
    profilepic: String,
    bio: String
}), 'userData');

// Middlewares

app.use(express.static(path.join(__dirname, "../client/static")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// API's

app.post('/mergepdfs', upload.array('pdfs', 2), async (req, res) => {
    try {
        const generatedPDFName = await mergePDFs(
            path.join(__dirname, req.files[0].path),
            path.join(__dirname, req.files[1].path)
        );

        res.redirect(`http://${LocalIPv4()}:${PORT}/public/${generatedPDFName}.pdf`);
    } catch (error) {
        console.error(`${logprefix('server')} ${error}`);
        res.status(500).send(`${logprefix('server')} Internal Server Error`);
    }
});
app.post(`/registerSubmit`, apiLimiter, async (req, res) => {
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

        // Function for Registering Account
        const RegisterAcc = async () => {
            let UsernameOccupied;
            let EmailAccountExists;
            for (const account of await AccountsCollection.find()) {

                // Checking if The Username is Occupied
                if (LoginfoDecryptionKey.decrypt(account._doc.username).toLowerCase() == req.body.username.toLowerCase()) {
                    UsernameOccupied = true;
                }
                // Checking if The Account already exists
                if (LoginfoDecryptionKey.decrypt(account._doc.email).toLowerCase() == req.body.email.toLowerCase()) {
                    EmailAccountExists = true
                }
            }

            if (UsernameOccupied) { // If The Username is Occupied

                res.status(406).send("Username Occupied!")

            } else if (EmailAccountExists) { // If The Account already exists

                res.status(406).send("An acount with this Email already Exists!")

            } else if (!UsernameOccupied && !EmailAccountExists) { // If It Passes all The Checks


                // Encrypting User Data
                const EncrytUsername = LoginfoDecryptionKey.encrypt(req.body.username.toLowerCase())
                const EncrytEmail = LoginfoDecryptionKey.encrypt(req.body.email.toLowerCase())
                
                const userID = Math.floor(Math.random() * 10000000000);

                // Hasing Password
                const GeneratedSalt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(req.body.password, GeneratedSalt)

                // Storing user Data
                const user = {
                    username: EncrytUsername,
                    email: EncrytEmail,
                    password: hashedPassword,
                    userID: userID,
                    role: "member"
                };

                // Adding User to the Database 
                const newAccount = new AccountsCollection(user);
                newAccount.save();
                console.log(`${logprefix("Database")} Registered New User ${req.body.username.toLowerCase()}`);

                // Generating a Token
                const token = jwt.sign(user, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);

                const { theme } = req.cookies

                const userData = {
                    userID: userID,
                    preferences: {
                        theme: theme
                    },
                    profilepic: './assets/images/icons/account_dark.png',
                    bio: ''
                }
                
                console.log(`type: ${userData}\n content: ${userData}`)
                console.dir(`depth: ${userData}`)

                // Collecting Data
                const newUserData = new userDataCollection(userData);
                newUserData.save();

                // Assigning the token and Redirecting
                const expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);

                res.cookie('accessToken', token, {
                    expires: expirationDate,
                    httpOnly: true,
                    path: '/'
                })
                res.status(201).send("Successfully Registered!");
            } else {
                res.status(500).send("Internal Server Error!")
            }
        }

        let decodedToken;
        let corrupted = false;
        try {
            decodedToken = jwt.verify(req.cookies.accessToken, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
        } catch (error) {
            console.log(error);
            corrupted = true;
        }

        // Checking for cases of corruption

        if (req.cookies.accessToken && corrupted) { // If The Token is corrupt

            req.cookies.accessToken = ''; // Reseting The Token
            RegisterAcc()
        } else if (req.cookies.accessToken && !corrupted) { // If The User is already Logged in

            res.status(406).send("You can't register, you're Already Logged in")
        } else if (!req.cookies.accessToken) { // If The User is not logged in

            RegisterAcc()
        }

    } catch (error) {
        console.error(`${logprefix('server')} ${error}`);
        try {
            res.status(500).send(`${logprefix('server')} Internal Server Error`);
        } catch (error) { }
    }

})
app.post(`/loginSubmit`, apiLimiter, async (req, res) => {
    try {
        // if (req.headers.origin !== `http://${LocalIPv4()}:${PORT}/login`) {
        //     res.send('Unauthorized Connection denied')
        // } else {

        // Checking if the user exists
        let EmailMatchedAcc;
        for (const account of await AccountsCollection.find()) {
            if (LoginfoDecryptionKey.decrypt(account._doc.email) == req.body.email) {
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
                    // If all The test Passes
                    
                    // Generating a Token
                    const token = jwt.sign(EmailMatchedAcc, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
                    
                    
                    let UserIDMatchedData;
                    for (const account of await userDataCollection.find()) {
                        if (account._doc.userID === EmailMatchedAcc.userID) {
                            UserIDMatchedData = account._doc;
                        }
                    }

                    const expirationDate = new Date();
                    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

                    // Setting user preferences
                    for (let key in UserIDMatchedData.preferences) {
                        res.cookie(key, UserIDMatchedData.preferences[key]);
                    };
                    
                    // Assigning and Redirecting
                    res.cookie('accessToken', token, {
                        expires: expirationDate,
                        httpOnly: true,
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
app.get('/profileinfofetch', Authenticate.byToken, (req, res) => {
    try {
        let token = req.cookies.accessToken;
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
app.post('/cloudFilesUpload', Authenticate.byToken, upload.any(), (req, res) => {
    if (!req.files) {
        res.status(400).send('No files were uploaded.');
    } else {
        res.status(201).redirect('/cloud');
    }
})
app.get('/cloudFiles', Authenticate.byTokenAPI, (req, res) => {
    try {
        const UserID = jwt.verify(req.cookies.accessToken, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).userID;
        const LoadFiles = () => {
            files = fs.readdirSync(path.join(__dirname, `../cloud/${UserID}`));
            const ReponseObject = []
            files.forEach(fileName => {
                ReponseObject.push({
                    name: fileName,
                    path: `/${fileName}`
                })
            })
            res.json(ReponseObject);
        }
        try {
            LoadFiles()
        } catch (err) {
            if (err.message.includes('no such file or directory')) {
                fs.mkdirSync(path.join(__dirname, `../cloud/${UserID}/`))
                LoadFiles()
            } else {
                console.log(err)
            }
        }

    } catch (error) {
        console.log(`${logprefix('Server')} ${error}`)
        res.send(error)
    }
})
app.get('/cloudFileActions', Authenticate.byToken, async (req, res) => {
    try {

        const FilePath = req.headers.path
        if (req.headers.action.toLowerCase() == "getfile") {
            res.sendFile(path.join(__dirname, `../cloud/${getUserID(req.cookies.accessToken)}`, FilePath));
        } else if (req.headers.action.toLowerCase() == "delete") {
            fs.unlinkSync(path.join(__dirname, `../cloud/${getUserID(req.cookies.accessToken)}`, FilePath));
            res.status(201).send("Succefully Deleted The Requested File!")
        }
    } catch (error) {
        console.log(`${logprefix('Server')} ${error}`)

        try { res.json([error]) } catch (err) { }
    }
})
app.get('/isAccValid', async (req, res) => {
    res.status(201).json({ isAccValid: await Authenticate.isValidAccount(req.cookies.accessToken) })
})
app.get('/isAdmin', Authenticate.byTokenAPI, async (req, res) => {
    res.status(201).json({ isAdmin: await Authenticate.isAdmin(req.cookies.accessToken) })
})
app.get('/adminDashboardURL', apiLimiter, Authenticate.byTokenAdminOnlyAPI, (req, res) => {
    res.status(201).send(process.env.ADMIN_PANEL_URL);
})

// Pages

/* app.get(`/${process.env.API_ACCOUNTS_URL}`, (req, res)=>{
    fs.readFile('credientials/accounts.json', 'utf8', (err,data) => {
        res.json(JSON.parse(data))
    })
    console.log(`${logprefix('server')} Credientials has Been fetched!`)
}) */

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/index.html'));
});
app.get(`/${process.env.ADMIN_PANEL_URL}`, Authenticate.byTokenAdminOnly, (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/admin.html'))
})
app.get('/alarm', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/alarm.html'))
})
app.get('/cloud', Authenticate.byToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/cloud.html'));
})
app.get('/data', Authenticate.byToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/data.html'));
})
app.get('/experiments', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/experiments.html'))
})
app.get('/gradient-generator', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/gradient-generator.html'))
})
app.get('/html-notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/html-tutorial.html'))
})
app.get('/javascript-notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/javascript-tutorial.html'))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/login.html'))
})
app.get('/music', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/music.html'))
})
app.get('/musiclist', (req, res) => {
    updateMusicAPI();
    res.json(JSON.parse(fs.readFileSync('APIs/musiclist.json', 'utf8')))
})
app.get('/password-generator', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/password-generator.html'))
})
app.get('/pdf-merger', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/pdfmerger.html'))
})
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/profile.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/static/register.html'))
})

// 404 Page
app.use((req, res, next) => {
    res.status(404).send(UIMSG_1("Error 404 Page Not Found;"));
});

// Starting Server
app.listen(PORT, () => {
    console.log(`${logprefix('server')} Server started on http://${LocalIPv4()}:${PORT}`);
    broadcastMessage(`${logprefix('server')} Server started on http://${LocalIPv4()}:${PORT}`);
});
udpServer.bind(() => {
    udpServer.setBroadcast(true);
});