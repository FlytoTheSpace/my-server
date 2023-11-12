// Imports
const express = require('express');
const app = express();
const port = 5500;

const path = require('path')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const {mergePDFs} = require("./mergepdfs")



// root
app.use(express.static(path.join(__dirname, "server")));
// Requests
app.post('/merge', upload.array('pdfs', 2), async (req, res, next)=>{
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    await mergePDFs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));
    res.redirect(`http://localhost:${port}/public/merged.pdf`)
    // res.send({data: req.files})
})

// Setting up Ports
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
    res.sendFile(path.join(__dirname,'./server/experiments.html'))
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
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,'./server/register.html'))
})

// Starting Server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})