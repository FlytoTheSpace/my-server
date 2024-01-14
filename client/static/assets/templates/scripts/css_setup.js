fetch('./assets/templates/html/setup.html')
    .then((response) => {
        console.info("CSS files Status Code:", response.status)
        return response.text()
    })
    .then((data) => {
        document.getElementsByTagName('head')[0].innerHTML += data;
        if(!(document.cookie.includes('theme'))){
            document.cookie = "theme=light"
            document.getElementById("prefenceTheme").href = "./assets/templates/css/lighttheme.css"
        } else{
            if(getCookie("theme") == "dark"){
                document.getElementById("prefenceTheme").href = "./assets/templates/css/darktheme.css"
            } else if(getCookie("theme") == "light"){
                document.getElementById("prefenceTheme").href = "./assets/templates/css/lighttheme.css"
            }
        }
    });