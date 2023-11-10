fetch('/assets/templates/html/footer.html')
    .then((response) => {
        console.info("Footer Status Code:", response.status)
        return response.text();
    })
    .then((data) => {
        document.getElementsByTagName('footer')[0].innerHTML += data;
    })
    .catch((error)=>{
        console.log(error)
    });