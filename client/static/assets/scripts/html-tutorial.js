const codeContainer = document.getElementsByTagName("pre");

const code = (index, content)=>{
    return codeContainer[index].lastElementChild.textContent = content;
}


// Code Returning
code(0,`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>This is An heading</h1>
    <h2>This is An heading</h2>
    <h3>This is An heading</h3>
    <h4>This is An heading</h4>
    <h5>This is An heading</h5>
    <h6>This is An heading</h6>
</body>
</html>`)