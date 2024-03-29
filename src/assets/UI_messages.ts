export const UIMSG_1 = (msg: string)=>{
    const HTML_UI_MSG = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${msg}</title>
    <style>
        main{
            display: flex;
            align-items: center;
            flex-direction: column;
        }
        #errormsg{
            color: transparent;
            background-image: linear-gradient(to top right, rgb(0, 255, 255), rgb(0, 153, 255), rgba(255, 255, 255, 0.329));
            background-clip: text;
            -moz-background-clip: text;
            -webkit-background-clip: text;
        }
        div.playground{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <header></header>
    <main>
        <div class="playground">
            <h1 id="errormsg">${msg}</h1>
        </div>
    </main>
    <footer></footer>
    <script src="./assets/templates/scripts/setup.js"></script>
</body>
</html>`;
    return HTML_UI_MSG;
}