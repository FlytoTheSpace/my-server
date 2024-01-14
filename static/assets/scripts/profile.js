let profileinfo = fetch(`${location.href.replace("profile", "")}profileinfofetch`)
(async ()=>{
    let data = await profileinfo.json();
    console.log(data)
})();