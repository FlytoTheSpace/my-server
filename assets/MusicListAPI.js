const fs = require('fs');

const updateMusicAPI = ()=>{
    const MusicAPI = []
    const files = fs.readdirSync('./server/assets/sounds/music/')
    files.forEach(file => {
        MusicAPI.push({
            name: file.replace(/\..../g, ''),
            song: `./assets/sounds/music/${file}`
        })
    });
    const MusicAPIOld = JSON.parse(fs.readFileSync('APIs/musiclist.json', 'utf8'));

    if((MusicAPI !== MusicAPI)){
        console.log(`${new Date().toLocaleTimeString()} Updating Music API`)
        fs.writeFileSync('APIs/musiclist.json', JSON.stringify(MusicAPI), 'utf8')
    }
}

module.exports = {updateMusicAPI}