fetch("/json/test.json", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "username": "Jane Doe"
    }),
})
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data)
    })
    .catch(error => console.error('Error:', error));