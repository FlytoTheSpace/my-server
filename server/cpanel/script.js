const startserverbtn = document.getElementById('startserverbtn')
const stopserverbtn = document.getElementById('stopserverbtn')

startserverbtn.addEventListener('click', async (e)=>{
    e.target.disabled = true;
    stopserverbtn.disabled = false;
    const Request = await fetch(`${location.href}requests`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'StartServer'
        })
    });
    document.getElementById('output').innerHTML = Response;
})

stopserverbtn.addEventListener('click', async (e) => {
    e.target.disabled = 'true'
    startserverbtn.disabled = false;
    const Request = await fetch(`${location.href}requests`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'StopServer'
        })
    });
    document.getElementById('output').innerHTML = Response;
})