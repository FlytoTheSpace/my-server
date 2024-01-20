require('dotenv').config()
const express = require('express');
const router = express.Router();

// Built in Modules
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

// NPM Modules
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const multer = require('multer');
const rateLimit = require('express-rate-limit');

// Local Modules
const Assets = require('../assets/')
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
const { UIMSG_1 } = UI_messages


let mergePDFs;
(async () => {
    mergePDFs = await (await import("../scripts/merge.mjs")).mergePDFs;
})();

const { resolveSoa } = require('dns');


// Other

const LoginfoDecryptionKey = new Cryptr(process.env.ACCOUNTS_LOGINFO_DECRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 1
});
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
                const uploadPath = path.join(__dirname, `../../cloud/${UserID}/`);

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

const Files = fs.readdirSync(path.join(Root, 'client/routes/'))
const HtmlFiles = Files.filter(file => path.extname(file) === '.html')

const byTokenAuthPages = [
    'data',
    'cloud'
]

let Length = HtmlFiles.length

const isEquals = (baseVariable, ...args) => {
    return args.some(arg => baseVariable == arg);
}

for (let i = 0; i < Length; i++) {
    const filewithoutExt = HtmlFiles[i].replace('.html', '') // works file
    const file = HtmlFiles[i] // works fine

    isEquals(filewithoutExt, ...byTokenAuthPages)
    // Special Pages
    if (filewithoutExt == 'index') {
        router.get(`/`, Authenticate.none, (req, res) => {
            res.sendFile(path.join(Root, `client/routes/${file}`))
        })
    }
    else if (filewithoutExt == 'admin') {
        router.get(`/${process.env.ADMIN_PANEL_URL}`, Authenticate.byTokenAdminOnly, (req, res) => {
            res.sendFile(path.join(Root, `client/routes/${file}`))
        })
    }
    // Token Authentication Pages
    else if (isEquals(filewithoutExt, ...byTokenAuthPages)) {
        router.get(`/${filewithoutExt}`, Authenticate.byToken, async (req, res) => {
            res.sendFile(path.join(Root, `client/routes/${file}`));
        })
    }
    // No Authentication Pages
    else {
        router.get(`/${filewithoutExt}`, Authenticate.none, (req, res) => {
            res.sendFile(path.join(Root, `client/routes/${file}`))
        })
    }

}

module.exports = router;