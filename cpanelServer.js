const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')
const bodyParser = require('body-parser');
const spawn = require('cross-spawn');
const {setInterval} = require('timers/promises');
const {logprefix} = require('./assets/logs');

// for Logging

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'cpanel/')))
app.use(express.json());

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'cpanel/index.html'));
})
app.post('/requests', (req, res)=>{
    if (req.headers.origin == `http://${LocalIPv4()}:${PORT}`) {
        if(req.body.action == 'StartServer'){

            console.log(`${logprefix('cpanel')} Starting The Server...`);
            const args = []
            const npmStartProcess = spawn('bash', ['npm start', ...args], {
                stdio: 'inherit', // Inherit stdio from the parent process (show npm start output in the terminal)
                shell: true,      // Use shell to execute the command
            });
            npmStartProcess.on('exit', (code) => {
                console.log(`${logprefix('cpanel')} npm start process exited with code ${code}`);
            });
            
        } else if (req.body.action == 'StopServer'){
            console.log(`${logprefix('cpanel')} Stop The Server`);
        } else {
            res.send('Unknown Action');
        }
    } else {
        res.send('UnAuthorized Access')
    }
})

app.listen(PORT, '0.0.0.0' , ()=>{
    console.log(`${logprefix('cpanel')} Control Panel started on http://${LocalIPv4()}:${PORT}`)
})