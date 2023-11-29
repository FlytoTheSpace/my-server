/* Navbar
fetch('/assets/templates/html/navbar.html')
    .then(response => response.text())
    .then(data => {
        const navbarPlaceholder = document.getElementsByTagName('header')[0];
        // Checking if the navbar placeholder already contains content
        if (navbarPlaceholder.innerHTML.trim() !== '') {
            // If it contains content, insert the fetched data before the existing content
            navbarPlaceholder.innerHTML = data + navbarPlaceholder.innerHTML;
        } else {
            // If it's empty, simply set the fetched data as its content
            navbarPlaceholder.innerHTML = data;
        }
    });
// Footer
fetch('/assets/templates/html/footer.html')
    .then(response => response.text())
    .then(data => document.getElementsByTagName('footer')[0].innerHTML += data);
// CSS Setup
fetch('/assets/templates/html/setup.html')
    .then(response => response.text())
    .then(data => document.getElementsByTagName('head')[0].innerHTML += data); 

*/


// The Code shown up here is the old way of loading Scripts
const getCookie = (name)=>{
    let cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let parts = cookie.split("=");
        if (parts[0] === name) {
            return decodeURIComponent(parts[1]);
        }
    }
    return null;
};

// If Your Script is not loading then add a slash right before the value of attribute `src`
// The Script Itself to add other Scripts right after it
const ItselfScript = document.querySelector("script[src=\"./assets/templates/scripts/setup.js\"]");

// Function to Catch Error and Adding them to The HTML file
const setupScript = (scriptsList) => {

    // Running a loop for each of them
    scriptsList.forEach((script) => {

        const ScriptsPromise = async ()=>{
            return new Promise((resolve, reject) => {
                try {
                    script.onload = () => {
                        resolve(script.src);
                    };
                    script.onerror = () => {
                        reject(new Error(`Script couldn't be Loaded From: ${script.src}`, script));
                    };

                    ItselfScript.after(script);
                } catch (error) {
                    console.error(error)
                }
            });
        }

        ScriptsPromise().then((scriptSouce) => {
            // Success msg
            console.log(`Script has been Loaded From: ${scriptSouce}`);
        }).catch((error) => {
            // throwing error
            console.warn(error);
        });

    });

};
// Create an Element for Each of The Scripts
const navbarScript = document.createElement("script");
const footerScript = document.createElement("script");
const CSSSetupScript = document.createElement("script");

// Assign them a SRC source
navbarScript.src = "./assets/templates/scripts/navbar.js";
footerScript.src = "./assets/templates/scripts/footer.js";
CSSSetupScript.src = "./assets/templates/scripts/css_setup.js";

// Pass the scripts as an array, so You can add many of them as you want
setupScript([navbarScript, footerScript, CSSSetupScript]); 