// Imports

const express = require('express');
const app = express();
const port = 5500;

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { mergePDFs } = require("./mergepdfs");
const GenRandomChar = require("./assets/randomchars");
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');


require('dotenv').config(); // Credientials

// Other

const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 1 });

const authorizebyToken = (request) => {
    try {
        const token = request.cookies.accessToken;
        if (token == undefined || token == "null") {
            console.log("error: token is undefined")
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
                                console.log(decodedToken.password + "\n" + EmailMatchedAcc.password )
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

// Accepts
app.use(express.static(path.join(__dirname, "server")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Requests
app.post('/merge', upload.array('pdfs', 2), async (req, res) => {
    try {
        const generatedPDFName = await mergePDFs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));
        res.redirect(`http://localhost:${port}/public/${generatedPDFName}.pdf`);
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] + ${error}`);
        res.status(500).send(`[${new Date().toLocaleTimeString()}] Internal Server Error`);
    }
});
app.post(`/registerSubmit`, async (req, res) => {
    try {
        const GeneratedSalt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, GeneratedSalt)
        const EncrytUsername = LoginfoDecryptionKey.encrypt(req.body.username)
        const EncrytEmail = LoginfoDecryptionKey.encrypt(req.body.email)

        const user = {
            username: EncrytUsername,
            email: EncrytEmail,
            password: hashedPassword
        };
        res.status(201).send()
        fs.readFile('credientials/accounts.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data);
                obj.push(user); //add some data
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('credientials/accounts.json', json, 'utf8', () => { });

                const token = jwt.sign(EmailMatchedAcc, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
                res.cookie('accessToken', token, {
                    httpOnly: true,
                    path: '/'
                });
            }
        });

    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ${error}`);
        res.status(500).send(`[${new Date().toLocaleTimeString()}] Internal Server Error`);
    }
})
app.post(`/loginSubmit`, (req, res) => {
    try {

        fs.readFile('credientials/accounts.json', 'utf8', async (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let Accounts = JSON.parse(data);
                let EmailMatchedAcc = Accounts.find(acc => LoginfoDecryptionKey.decrypt(acc.email) == req.body.email);
                if (EmailMatchedAcc === undefined || EmailMatchedAcc === null) {
                    res.status(404).send("Status: 404, The User Doesn't seems to exist")
                } else {
                    try {
                        if (await bcrypt.compare(req.body.password, EmailMatchedAcc.password)) {

                            const token = jwt.sign(EmailMatchedAcc, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY);
                            res.cookie('accessToken', token, {
                                httpOnly: true,
                                path: '/'
                            });
                            res.status(201).send("Successful Login");
                        } else {
                            res.status(401).send("Incorrect Password");
                        }
                    } catch (err) {
                        console.log(`[${new Date().toLocaleTimeString()}] ${err}`)
                        res.status(500).send("Status: 500, Internal Server error. pls try again later...")
                    }
                }

            }
        });
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ${error}`);
        res.status(500).send(`[${new Date().toLocaleTimeString()}] Internal Server Error`);
    }
})

// Routes
/* app.get(`/${process.env.API_ACCOUNTS_URL}`, (req, res)=>{
    fs.readFile('credientials/accounts.json', 'utf8', (err,data) => {
        res.json(JSON.parse(data))
    })
    console.log(`[${new Date().toLocaleTimeString()}] Credientials has Been fetched!`)
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
app.get('/data', (req, res) => {
    authorizebyToken(req);
    res.sendFile(path.join(__dirname, './server/data.html'))
})
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
app.get('/password-generator', (req, res) => {
    res.sendFile(path.join(__dirname, './server/password-generator.html'))
})
app.get('/pdf-merger', (req, res) => {
    res.sendFile(path.join(__dirname, './server/pdfmerger.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './server/register.html'))
})

// Starting Server
app.listen(port, () => {
    console.log(`[${new Date().toLocaleTimeString()}] Server started on http://localhost:${port}`)
})