(
    async ()=>{
        const Request = await (await fetch('http://192.168.0.101:5500/isAdmin', {})).text();
        console.log(Request);
    }
)();
