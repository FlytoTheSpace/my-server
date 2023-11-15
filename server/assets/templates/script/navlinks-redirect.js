const navbarlinksRedirectFunc = (index, link)=>{
    if (typeof index == undefined || typeof index == null || index == undefined || index == null){
        location.href = `${link}`;
    } else{
        location.href = `/${document.getElementsByClassName('nav-link')[index].textContent.toLowerCase()}`
    }
}