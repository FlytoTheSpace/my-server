// Inserting 'option' element in Password Length element using using `insertAdjacentHTML()` Function

(() => {
    // Setting a Max Number of Characters allowed in The Input
    let maxPassLength = 36;

    let length = document.getElementById("passwordLength")
    for (let i = 1; i <= maxPassLength; i++) {
        length.insertAdjacentHTML("beforeend", `<option value="${i}">${i}</option>`)
    }
})();

// Checking if Password mode Funny is Selected and if it is then disabling Password Length
let disableonFunnyinterval = setInterval(() => {
    if (document.getElementById("passwordType").value == "Funny") {
        document.getElementById("passwordLength").disabled = "true";
    } else if (document.getElementById("passwordType").value != "Funny") {
        document.getElementById("passwordLength").disabled = "";
    };
}, 100);

// Containers and Buttons

let passwordContainer = document.getElementById("passwordContainer");
let sumbitButton = document.getElementById("generateButton");

// Characters for Passwords
const StrongPasswordChars = `1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
const SuperStrongPasswordChars = `1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=[];',./_+{}|:"<>?`;
const WeakPasswordChars = `1234567890abcdefghijklmnopqrstuvwxyz`;
const FunnyPassword = ['123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890', 'qwerty', 'abc123', 'password1', '1234', 'password123', 'admin', '123123', 'iloveyou', 'welcome', 'monkey', 'login', '!@#$%^&*', 'sunshine', 'try again', 'try again later', 'Incorrect Password', 'whats the password?', 'let me in'];

// Class for Passwords Types and Insertion
class GeneratePassword {
    generateSuperStrongPassword(Length) {
        let password = "";
        for (let i = 0; i <= Length; i++) {
            let random = Math.floor(
                Math.random() * SuperStrongPasswordChars.length
            )
            password += SuperStrongPasswordChars.substring(random, random + 1)
        }
        passwordContainer.textContent = password.slice(0, password.length - 1)
    };
    generateStrongPassword(Length) {
        let password = "";
        for (let i = 0; i <= Length; i++) {
            let random = Math.floor(
                Math.random() * StrongPasswordChars.length
            )
            password += StrongPasswordChars.substring(random, random + 1)
        }
        passwordContainer.textContent = password.slice(0, password.length - 1)
    };
    generateWeakPassword(Length) {
        let password = "";
        for (let i = 0; i <= Length; i++) {
            let random = Math.floor(
                Math.random() * WeakPasswordChars.length
            )
            password += WeakPasswordChars.substring(random, random + 1)
        }
        passwordContainer.textContent = password.slice(0, password.length - 1)
    };
    generateFunnyPassword() {
        let password = "";
        let random = Math.floor(
            Math.random() * FunnyPassword.length
        );
        password = FunnyPassword[random];
        passwordContainer.textContent = password
    };
};
// assigning pass variable 'generatePassword' class
let pass = new GeneratePassword();

sumbitButton.addEventListener("click", () => {
    // getting Length and Types
    let passwordLength = document.getElementById("passwordLength").value;
    let passwordType = document.getElementById("passwordType").value;
    passwordLength = Number.parseInt(passwordLength);
    // catching errors if possible
    try {
        // Checking which type is the input
        if (passwordType == "Super-Strong") {
            pass.generateSuperStrongPassword(passwordLength)
        } else if (passwordType == "Strong") {
            pass.generateStrongPassword(passwordLength)
        } else if (passwordType == "Weak") {
            pass.generateWeakPassword(passwordLength)
        } else if (passwordType == "Funny") {
            pass.generateFunnyPassword()
        }
    } catch (error) {
        console.warn(error)
    }
})
