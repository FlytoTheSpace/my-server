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
const upload = require('../common/storage')
const apiLimiter = require('../common/ratelimit')

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

const {
    byTokenAuthPages,
    byTokenAdminOnlyAuthPages,
    byTokenAPIAuthPages,
    byTokenAdminOnlyAPIAuthPages
} = JSON.parse(fs.readFileSync(path.join(__dirname, 'pages.json'), 'utf8'))
const { LoginfoDecryptionKey } = require('../common/KEYS')

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

// Function to set storage configuration dynamically


const Files = fs.readdirSync(path.join(Root, 'client/routes/'))
const HtmlFiles = Files.filter(file => path.extname(file) === '.html')


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