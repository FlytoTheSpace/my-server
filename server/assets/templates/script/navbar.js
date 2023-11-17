let navbarfetch = fetch('./assets/templates/html/navbar.html')
    .then((response)=>{
        console.info("Navbar Status Code:", response.status)
        return response.text();
    })
    .then((data) => {
        const navbarPlaceholder = document.getElementsByTagName('header')[0];
        if (navbarPlaceholder.innerHTML.trim() !== '') {
            navbarPlaceholder.innerHTML = data + navbarPlaceholder.innerHTML;
        } else {
            navbarPlaceholder.innerHTML = data;
        }
        const navbarmenu = document.getElementById('NavbarMenuButton');

        navbarmenu.addEventListener("mouseover", () => {
            navbarmenu.firstElementChild.src = "./assets/Images/icons/menu_hover.png"
        })
        navbarmenu.addEventListener("mouseleave", () => {
            navbarmenu.firstElementChild.src = "./assets/Images/icons/menu.png"
        })
        navbarmenu.addEventListener('click', () => {
            document.getElementById("NavbarMenu").classList.toggle("displaynone")
        })
        navbarmenu.addEventListener('touchmove', () => {
            console.log("touched")
            document.getElementById("NavbarMenu").classList.toggle("displaynone")
        })
        setInterval(() => {
            if (screen.width <= 500) {
                let navlinks = document.getElementById("navlinks");
                if (navlinks.style.display == "flex") {
                    navlinks.style.display = "none";
                }
            } else if (screen.width >= 500) {
                let navlinks = document.getElementById("navlinks");
                if (navlinks.style.display != "flex"){
                    navlinks.style.display = "flex";
                }
            }
            if (getCookie("theme") == "dark" && document.getElementById("prefenceTheme").href == "./assets/templates/css/lighttheme.css") {
                document.getElementById("prefenceTheme").href = "./assets/templates/css/darktheme.css"
            } else if (getCookie("theme") == "light" && document.getElementById("prefenceTheme").href == "./assets/templates/css/darktheme.css") {
                document.getElementById("prefenceTheme").href = "./assets/templates/css/lighttheme.css"
            }
        });
        let themeSwitchButton = document.getElementById("themeSwitchButton");
        themeSwitchButton.addEventListener("click", ()=>{
            if (getCookie("theme") == "dark") {
                document.getElementById("prefenceTheme").href = "./assets/templates/css/lighttheme.css"
                themeSwitchButton.src = "./assets/Images/icons/dark_mode.png"
                themeSwitchButton.parentElement.style.backgroundColor = "#2b2b2b"
                document.cookie = "theme=light;"
            } else if (getCookie("theme") == "light") {
                document.getElementById("prefenceTheme").href = "./assets/templates/css/darktheme.css"
                themeSwitchButton.src = "./assets/Images/icons/light_mode.png"
                themeSwitchButton.parentElement.style.backgroundColor = "white"
                document.cookie = "theme=dark;"
            }
        });
    });

const navbarLinksRedirectFunc = (index, link) => {
    if (typeof index == undefined || typeof index == null || index == undefined || index == null) {
        location.href = `${link}`;
    } else {
        location.href = `/${document.getElementsByClassName('nav-link')[index].textContent.toLowerCase()}`
    }
}
const navbarMenuLinksRedirectFunc = (index, link) => {
    if (typeof index == undefined || typeof index == null || index == undefined || index == null) {
        location.href = `${link}`;
    } else {
        location.href = `/${document.getElementsByClassName('nav-menu-link')[index].textContent.toLowerCase().replace(' ', '-')}`
    }
}