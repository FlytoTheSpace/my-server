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
const Assets = require('./assets/')
const {
    Authenticate,
    Broadcast,
    Database,
    GetFunctions,
    Ip,
    Logs,
    MusicListAPI,
    Randomchars,
    Root,
    UI_messages
} = Assets;


const { calculateBroadcastAddress, broadcastMessage } = Broadcast;
const { AccountsCollection, userDataCollection } = Database;
const { getUserID, getUsername, getEmail, getRole } = GetFunctions;
const { LocalIPv4 } = Ip
const { logprefix } = Logs
const { updateMusicAPI } = MusicListAPI;
const { UIMSG_1 } = UI_messages
const upload = require('./common/storage')

const {
    byTokenAuthPages,
    byTokenAdminOnlyAuthPages,
    byTokenAPIAuthPages,
    byTokenAdminOnlyAPIAuthPages
} = JSON.parse(fs.readFileSync(path.join(__dirname, './routes/pages.json'), 'utf8'))

let mergePDFs;
(async ()=>{
    mergePDFs = await (await import("./scripts/merge.mjs")).mergePDFs;
})();

const { deleteOldFiles } = require('./scripts/clean');
const { resolveSoa } = require('dns');
const { LoginfoDecryptionKey } = require('./common/KEYS')

// Other
const udpPort = 3001; // UDP port for broadcasting
const subnetMask = '255.255.255.0';

setInterval(deleteOldFiles, 30 * 60 * 1000);
updateMusicAPI(); // Updating Music API
app.set('trust proxy', 1); 
const apiLimiter = require('./common/ratelimit')

// Middlewares

app.use(express.static(path.join(__dirname, "../client/static")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// API's

app.post('/mergepdfs', upload.array('pdfs', 2), async (req, res) => {
    try {
        const generatedPDFName = await mergePDFs(
            path.join(__dirname,'..', req.files[0].path),
            path.join(__dirname,'..', req.files[1].path)
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

// Require route files
const Pages = require('./routes/pages');
// You can require other route files here

// Use the routes
app.use('/', Pages);


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