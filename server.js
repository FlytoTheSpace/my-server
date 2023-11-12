const express = require('express');
const path = require('path')
const app = express();
const port = 5500;
app.use(express.static(path.join(__dirname, "server")));


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