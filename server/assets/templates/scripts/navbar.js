(
    async () => {
        let navbarfetch = await fetch('./assets/templates/html/navbar.html')
        const statusCode =  await navbarfetch.status
        console.info(statusCode);
        const data = await navbarfetch.text()
        
        // Adding The Navbar
        const navbarPlaceholder = document.getElementsByTagName('header')[0];
        if (navbarPlaceholder.innerHTML.trim() !== '') {
            navbarPlaceholder.innerHTML = data + navbarPlaceholder.innerHTML;
        } else {
            navbarPlaceholder.innerHTML = data;
        };


        const navbarMenu = document.getElementById('navbarMenuButton');

        // Hover Effect on The Toggle Menu Button
        navbarMenu.addEventListener("mouseover", () => navbarMenu.firstElementChild.src = "./assets/images/icons/menu_hover.png");
        navbarMenu.addEventListener("mouseleave", () => navbarMenu.firstElementChild.src = "./assets/images/icons/menu.png");

        // Display of The Menu
        navbarMenu.addEventListener('click', () => document.getElementById("navbarMenu").classList.toggle("displaynone"));
        navbarMenu.addEventListener('touchmove', () => document.getElementById("navbarMenu").classList.toggle("displaynone"));

        setInterval(() => {
            try {
                // Updating Theme
                if (getCookie("theme") == "dark" && document.getElementById("prefenceTheme").href == "./assets/templates/css/lighttheme.css") {
                    document.getElementById("prefenceTheme").href = "./assets/templates/css/darktheme.css"
                } else if (getCookie("theme") == "light" && document.getElementById("prefenceTheme").href == "./assets/templates/css/darktheme.css") {
                    document.getElementById("prefenceTheme").href = "./assets/templates/css/lighttheme.css"
                }
            } catch (err) {
                console.warn(err)
            }
        }, 1*1000);


        // Checking Theme Once when DOM loads
        let themeSwitchButton = document.getElementById("themeSwitchButton");
        if (getCookie("theme") == "dark") {
            themeSwitchButton.src = "./assets/images/icons/light_mode.png"
            themeSwitchButton.parentElement.style.backgroundColor = "white"
        } else if (getCookie("theme") == "light") {
            themeSwitchButton.src = "./assets/images/icons/dark_mode.png"
            themeSwitchButton.parentElement.style.backgroundColor = "#2b2b2b"
        }
        
        // Switching Theme
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

        // Navbar links Redirect Function
        const Elements = document.getElementsByClassName("redirectbyName");
        Array.from(Elements).forEach(element => {
            element.addEventListener('click', (e) => {
                location.href = `/${e.target.textContent.toLowerCase().replace(' ', '-')}`
            })
        });
        const Request = await (await fetch('/isAdmin')).text();

        try {
            const isAdmin = JSON.parse(Request).isAdmin;
            console.log("You are", ( isAdmin === true ) ? "admin": "not admin")
        } catch (error) {
            console.log(Request)
        }
    }
)();