let profileinfo = fetch(`${location.href.replace("profile", "")}profileinfofetch`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': getCookie('accessToken')
    }
})
(async ()=>{
    let data = await profileinfo.json();
    console.log(data)
})();