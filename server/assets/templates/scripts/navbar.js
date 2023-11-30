let navbarfetch = fetch('./assets/templates/html/navbar.html')
    .then((response) => {
        console.info("Navbar Status Code:", response.status)
        return response.text();
    })
    .then((data) => {
        const navbarPlaceholder = document.getElementsByTagName('header')[0];
        if (navbarPlaceholder.innerHTML.trim() !== '') {
            navbarPlaceholder.innerHTML = data + navbarPlaceholder.innerHTML;
        } else {
            navbarPlaceholder.innerHTML = data;
        };


        const navbarMenu = document.getElementById('navbarMenuButton');

        navbarMenu.addEventListener("mouseover", () => navbarMenu.firstElementChild.src = "./assets/images/icons/menu_hover.png");
        navbarMenu.addEventListener("mouseleave", () => navbarMenu.firstElementChild.src = "./assets/images/icons/menu.png");
        navbarMenu.addEventListener('click', () => document.getElementById("navbarMenu").classList.toggle("displaynone"));
        navbarMenu.addEventListener('touchmove', () => document.getElementById("navbarMenu").classList.toggle("displaynone"));

        // Theme Update
        setInterval(() => {
            try {
                if (getCookie("theme") == "dark" && document.getElementById("prefenceTheme").href == "./assets/templates/css/lighttheme.css") {
                    document.getElementById("prefenceTheme").href = "./assets/templates/css/darktheme.css"
                } else if (getCookie("theme") == "light" && document.getElementById("prefenceTheme").href == "./assets/templates/css/darktheme.css") {
                    document.getElementById("prefenceTheme").href = "./assets/templates/css/lighttheme.css"
                }
            } catch (err) {
                console.warn(err)
            }
        });

        let themeSwitchButton = document.getElementById("themeSwitchButton");

        // Checking if 
        if (getCookie("theme") == "dark") {
            themeSwitchButton.src = "./assets/images/icons/light_mode.png"
            themeSwitchButton.parentElement.style.backgroundColor = "white"
        } else if (getCookie("theme") == "light") {
            themeSwitchButton.src = "./assets/images/icons/dark_mode.png"
            themeSwitchButton.parentElement.style.backgroundColor = "#2b2b2b"
        }

        themeSwitchButton.addEventListener("click", () => {
            if (getCookie("theme") == "dark") {
                document.getElementById("prefenceTheme").href = "./assets/templates/css/lighttheme.css"
                themeSwitchButton.src = "./assets/images/icons/dark_mode.png"
                themeSwitchButton.parentElement.style.backgroundColor = "#2b2b2b"
                document.cookie = "theme=light;"
            } else if (getCookie("theme") == "light") {
                document.getElementById("prefenceTheme").href = "./assets/templates/css/darktheme.css"
                themeSwitchButton.src = "./assets/images/icons/light_mode.png"
                themeSwitchButton.parentElement.style.backgroundColor = "white"
                document.cookie = "theme=dark;"
            }
        });
        const Elements = document.getElementsByClassName("redirectbyName");
        Array.from(Elements).forEach(element => {
            element.addEventListener('click', (e)=>{
                location.href = `/${e.target.textContent.toLowerCase().replace(' ', '-')}`
            })
        });
    });