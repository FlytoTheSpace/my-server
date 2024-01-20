const multer = require('multer');
const jwt = require('jsonwebtoken')
const path = require('path')
const { Root } = require('../assets/')
const fs = require('fs')
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        if (req.path === '/mergepdfs') {
            cb(null, 'uploads/pdfs/');
        } else if (req.path === '/cloudFilesUpload') {
            try {
                const UserID = jwt.verify(req.cookies.accessToken, process.env.ACCOUNTS_TOKEN_VERIFICATION_KEY).userID
                const uploadPath = path.join(Root, `/cloud/${UserID}/`);

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

module.exports = upload