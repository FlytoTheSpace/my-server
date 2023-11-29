const fetchedData = fetch("./assets/json/pass.json", {
    method: "GET",
    credentials: "include"
});

fetchedData.then((data) => {
    return data.json();
}).then((value) => {
    const password = value.password;
    const token = value.token;

    // const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword);
    // const decodedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

    let Cookies = document.cookie.split(";");
    if (Cookies == "") {
        let input = prompt("Enter Password");
        if (input != password) {
            let countDown = 5;
            setInterval(() => {
                document.body.textContent = `Incorrect Password Redirecting You to Homepage in ${countDown}`
                countDown--
                if (countDown === 0) {
                    location.href = "/"
                }
            }, 1000);
        } else if (input == password) {
            document.cookie += `token=${token}`
        }
    } else if (Cookies != "") {
        for (let i in Cookies) {
            if (Cookies[i].includes("token")) {
                let cookieToken = Cookies[i].split("=")[1];
                if (cookieToken == token) {
                    alert("Welcome Back")
                } else if (cookieToken != token){
                    let input = prompt(`Invalid token re-enter it`);
                    if (input != token) {
                        let countDown = 5;
                        setInterval(() => {
                            document.body.textContent = `Incorrect Token Redirecting You to Homepage in ${countDown}`
                            countDown--
                            if (countDown === 0) {
                                location.href = "/"
                            }
                        }, 1000);
                    } else if (input == token) {
                        document.cookie = `token=${token}`
                    }
                }
            }
        }
    }
})
