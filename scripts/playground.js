/*
        const loadScript = (url, callback)=>{
            console.log("Loading Script...");
            let customScript = document.createElement("script");
            customScript.src = url;
            customScript.onload = ()=>{
                successLoad(url);
                callback();
            };
            insertScript(customScript);
        };
        const successLoad = (url)=>{
            console.info(`Script has been loaded from: ${url}`);
        };
        const error = (url)=>{
            console.info(`Script from couldn't be loaded from: ${url}`);
        };
        const insertScript = (script)=>{
            document.body.appendChild(script);
        };
        const msg = ()=>{
            console.log("Hi")
        }

        loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js", msg) 
        
        const myPromise = new Promise((resolve, reject) => {
            // Simulating an asynchronous operation
            setTimeout(() => {
                const randomNumber = Math.random();

                if (randomNumber > 0.5) {
                    resolve(randomNumber); // Operation succeeded

                } else {
                    reject(new Error('Operation failed')); // Operation failed

                }
            }, 1000);
        });

        myPromise
        .then((result) => {
            console.log('The operation was successful. Result:', result);
        })
        .catch((error) => {
            console.error('The operation encountered ', error);
        });
        */