fetch('./templates/html/navbar.html')
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
    });