// Imports
const express = require('express');
const app = express();
const port = 5500;

const path = require('path')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const {mergePDFs, PDFname} = require("./mergepdfs")
// require('dotenv').config();



// Accepts
app.use(express.static(path.join(__dirname, "server")));
app.use(express.json());
const users = [];


// Requests
app.post('/merge', upload.array('pdfs', 2), async (req, res) => {
    try {
        const generatedPDFName = await mergePDFs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));
        res.redirect(`http://localhost:${port}/public/${generatedPDFName}.pdf`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.post('/users', (req, res)=>{
    try{
        const user = {
            username: req.body.username, 
            email: req.body.email,
            password: req.body.password
        };
        users.push(user)
        console.log('User added:', user)
        res.status(201).send()
        console.log(users)

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

// Routes
app.get('/users', (req, res)=>{
    res.json(users);
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./index.html'))
})
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/account.html'))
})
app.get('/administrator', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/admin.html'))
})
app.get('/alarm', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/alarm.html'))
})
app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/data.html'))
})
app.get('/experiments', (req, res) => {
    res.sendFile(path.join(__dirname, './server/experiments.html'))
})
app.get('/gradient-generator', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/gradient-generator.html'))
})
app.get('/html-notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/html-tutorial.html'))
})
app.get('/javascript-notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/javascript-tutorial.html'))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/login.html'))
})
app.get('/password-generator', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/password-generator.html'))
})
app.get('/pdf-merger', (req, res) => {
    res.sendFile(path.join(__dirname, './server/pdfmerger.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/register.html'))
})

// Starting Server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})