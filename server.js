const express = require('express');
const path = require('path')
const app = express();
const port = 5500;
app.use(express.static(path.join(__dirname, "assets")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./index.html'))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})