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