const express = require('express');
const path = require('path')
const app = express();
const port = 5500;
app.use(express.static(path.join(__dirname, "server")));
app.use(express.static(path.join(__dirname, "node_modules")));

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
    res.sendFile(path.join(__dirname,'./alarm.html'))
})
app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname,'./data.html'))
})
app.get('/gradient-generator', (req, res) => {
    res.sendFile(path.join(__dirname,'./gradient-generator.html'))
})
app.get('/html-notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./html-tutorial.html'))
})
app.get('/javascript-notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./javscript-tutorial.html'))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'./login.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,'./register.html'))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})