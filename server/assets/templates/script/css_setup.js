fetch('./assets/templates/html/setup.html')
    .then((response) => {
        console.info("CSS files Status Code:", response.status)
        return response.text()
    })
    .then((data) => {
        document.getElementsByTagName('head')[0].innerHTML += data
    });