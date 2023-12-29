const main = async ()=>{
    const Library = document.getElementById('Library');

    const FetchSongs = await fetch(location.href.replace('music', 'musiclist'));
    const Songs = await FetchSongs.json();
    for(let i = 0; i<Songs.length; i++){
        Library.insertAdjacentHTML('beforeend', `<div class="songItem" data-index="${i}" data-banner="${Songs[i].banner}" data-song="${Songs[i].song}">
                        <img class="songBanner" src="${Songs[i].banner || './assets/images/icons/music_icon.png'}" alt="">
                        <p class="songName">
                            ${(Songs[i].name.length > 15) ? Songs[i].name.slice(0, 15) + "..." : Songs[i].name}
                        </p>
                    </div>`)
    }
    let Music = new Audio(Songs[0].song)
    const songItems = Array.from(document.getElementsByClassName('songItem'));
    const masterPlay = document.getElementById('masterPlay');

    const progressBar = document.getElementById('progressBar');
    const masterDuration = document.getElementById('masterDuration');
    const masterPlayed = document.getElementById('masterPlayed');

    const playPause = (titleElement) => {
        if (Music.paused) {
            Array.from(document.getElementsByClassName('songName')).forEach(title => {
                title.style.color = "white"
            })
            Music.play()
            masterPlay.firstElementChild.src = "./assets/images/icons/pause.svg"
            try {
                titleElement.style.color = "lime"
            } catch (err) { };
            setTimeout(() => {
                masterDuration.innerHTML = formatTime(parseInt(Music.duration));
            }, 500);
        } else if (!(Music.paused)) {
            Music.pause()
            masterPlay.firstElementChild.src = "./assets/images/icons/play.svg"
            try {
                titleElement.style.color = "white"
            } catch (err) { };
            setTimeout(() => {
                masterDuration.innerHTML = formatTime(parseInt(Music.duration));
            }, 500);
        } else {
            console.warn("something went wrong")
        }
    }
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        // Use template literals to format the time
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

        return formattedTime;
    }
    const updateProgressBar = () => {
        const progress = parseInt(Music.currentTime / Music.duration * 100)
        progressBar.value = progress
    }

    // Events
    progressBar.addEventListener('change', () => {
        Music.currentTime = progressBar.value * Music.duration / 100
    })
    Music.addEventListener("timeupdate", (e) => {
        updateProgressBar();
        masterPlayed.innerHTML = formatTime(parseInt(Music.currentTime));
    });

    masterPlay.addEventListener('click', () => {
        playPause();
    })
    songItems.forEach(songItem => {
        songItem.addEventListener('click', ()=>{

            // Formating The SRC
            let formatedMusicSRC = `./${Music.src.replace(location.href.replace('music', ''), '').replace(/%20/g, ' ')}`

            // Checking if Music has been changed or not Declared yet
            if (!Music || formatedMusicSRC !== songItem.dataset.song) {

                // Checking and pause any previous Music before playing new one
                if (formatedMusicSRC !== songItem.dataset.song && Music) {
                    Music.pause();
                }
                // Defining Song to play
                Music = new Audio(songItem.dataset.song);

                // Updating Progress Bar
                Music.addEventListener("timeupdate", (e) => {
                    updateProgressBar();
                    masterPlayed.innerHTML = formatTime(parseInt(Music.currentTime));
                });
            }
            playPause(songItem.children[1]);
        })
    });

    window.addEventListener('keydown', (e) => {
        if (e.key == ' ') {
            e.preventDefault();

            const elements = Array.from(document.getElementsByClassName('songItem'))
            elements.forEach(element => {
                element.dataset.song
                const formatedMusicSRC = `./${Music.src.replace(location.href.replace('music', ''), '').replace(/%20/g, ' ')}`

                if (element.dataset.song == formatedMusicSRC) {
                    playPause(element.children[1]);
                }
            })
        } else if (e.key == 'ArrowRight') {
            Music.currentTime = parseInt(Music.currentTime + 10)
        } else if (e.key == 'ArrowLeft') {
            Music.currentTime = parseInt(Music.currentTime - 10)
        }
    })
    
}
main();