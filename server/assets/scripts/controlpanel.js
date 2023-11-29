const corruptElement = (element) => {
    Array.from(document.getElementsByTagName(element)).forEach((elements) => {
        elements.style.color = "black"
        elements.style.background = "red"
    })
}
const commandInput = document.getElementById("commandInput");
const output = document.getElementById("output");

const clearoutput = () => {
    output.innerHTML = "";
    commandInput.value = "";
    console.clear()
}

const webLinks = {
    // Google sites
    google: "https://www.google.com",
    youtube: "https://www.youtube.com",
    gmail: "https://mail.google.com/mail/u/0/#inbox",
    bard: "https://bard.google.com/",

    wikipedia: "https://www.wikipedia.org",

    // microsoft
    microsoft: "https://www.microsoft.com",
    chatgpt: "https://chat.openai.com/",
    github: "https://github.com/",


    amazon: "https://www.amazon.com",
    netflix: "https://www.netflix.com",

    // Social Media
    facebook: "https://www.facebook.com",
    twitter: "https://www.twitter.com",
    instagram: "https://www.instagram.com",
    reddit: "https://www.reddit.com",
    tiktok: "https://www.tiktok.com",
    whatsapp: "https://web.whatsapp.com/",
    linkedin: "https://www.linkedin.com",

    // Tools
    pintrest: "https://www.pinterest.com/",
    virustotal: "https://www.virustotal.com/",

    // Other
    stackoverflow: "https://stackoverflow.com/",
    replit: "https://replit.com/~",
    aternos: "https://aternos.org/servers/",
    typerush: "https://www.typerush.com",

    mysite: "http://www.warstudioscitybuild.unaux.com/",
};

const executeCommand = () => {
    const lineBreak = "<br>";
    const command = commandInput.value.toLowerCase().split(" ");
    const commandNonSplit = commandInput.value.toLowerCase();
    console.log(command)

    // Checking the command and take specific actions
    if (command[0] === "help") {
        output.innerHTML += `help - shows all commands <br>time - shows local time <br>search [Content] - Searches using google <br> clear - clears output and console <br> edit - Source Control <br>rickroll - rickrolls you <br>delete [element] - deletes elements with specific CSS selectors<br> redirect [site] - redirects you to one of the registered sites`
    } else if (command[0] === "time") {
        const currentTime = new Date().toLocaleTimeString();
        output.innerHTML += currentTime + lineBreak;
    } else if (commandNonSplit.startsWith("search")) {
        open(`https://www.google.com/search?q=${commandNonSplit.replace("search ", "")}`, "Popup", "width=800,height=600");
    } else if (command[0] === "clear") {
        clearoutput();
    } else if (command[0] === "edit") {
        location.href = "https://vscode.dev/tunnel/desktop-sn6000/A:/files/GitHub/web-development-tutorial"
    } else if (command[0] === "rickroll") {
        output.innerHTML = `<video src="/assets/videos/Rick Astley - Never Gonna Give You Up (Official Music Video).mp4" controls autoplay height="500vh"></video>`
    } else if (command[0] === "delete") {
        if (command[1] !== "") {
            let Element = document.querySelectorAll(command[1])
            for (let i in Element) {
                Element[i].outerHTML = `404; ${Element[i]} not found`;
            };
        }
    } else if (command[0] === "redirect") {
        for (let i in webLinks) {
            if (command[1] == i) {
                location.href = webLinks[i];
            } else {

            }
        }
    }
}