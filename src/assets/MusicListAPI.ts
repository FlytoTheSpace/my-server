const fs = require('fs');
const path = require('path')
const updateMusicAPI = ()=>{
    const MusicAPI = []
    const files = fs.readdirSync('./client/static/assets/sounds/music/')
    files.forEach(file => {
        MusicAPI.push({
            name: file.replace(/\..../g, ''),
            song: `./assets/sounds/music/${file}`
        })
    });
    const MusicAPIOld = JSON.parse(fs.readFileSync(path.join(__dirname, '../APIs/musiclist.json'), 'utf8'));
    
    for(let i = 0; i<MusicAPI.length; i++){
        if (MusicAPIOld[i].song !== MusicAPI[i].song){
            MusicAPIOld[i].song = MusicAPI[i].song

            console.log(`${new Date().toLocaleTimeString()} Updating Music API`)
            fs.writeFileSync('APIs/musiclist.json', JSON.stringify(MusicAPIOld), 'utf8')
            
        } else if (MusicAPIOld[i].name !== MusicAPI[i].name){
            MusicAPIOld[i].name = MusicAPI[i].name

            console.log(`[${new Date().toLocaleTimeString()}] Updating Music API`)
            fs.writeFileSync('APIs/musiclist.json', JSON.stringify(MusicAPI), 'utf8')

        }
    }
}

module.exports = {updateMusicAPI}