let submit = document.getElementById("submit-button");
submit.addEventListener("submit",loginsubmit())

// users
const users = [
    {
        username : "admin",
        email : "animationwar.750385@gmail.com",
        password : "1234"
    },
    {
        username : "dark",
        email : "phoolchand.750385@gmail.com",
        password : "123456"
    }
]
// errors
const error102 = ()=>{
    alert("Please fill out all the Inputs")
}
const error103 = ()=>{
    alert("Username is already Occupied")
}
const error104 = ()=>{
    alert("Email is already Occupied")
}

const loginsubmit = ()=>{
    // giving error if inputs are empty
    if (Document.getElementById("username") == ""){
        error102(); 
    }else if (Document.getElementById("password") == ""){
        error102(); 
    }else if (Document.getElementById("email") == ""){
        error102(); 
    }else{
        // checking if a user have a same user or email
        let usernameMatch = users.find((user)=>{
            return user.username = Document.getElementById("username");
        })
        let emailMatch = users.find((email)=>{
            return email.username = Document.getElementById("username");
        })
        
        // giving them error that If user or email is occupied
        if (Document.getElementById("username") == usernameMatch ){
            error103();
        }else if (Document.getElementById("email") == emailMatch){
            error104();
        }
        // if no match then submitting
        else if (Document.getElementById("username") !== usernameMatch && Document.getElementById("email") !== emailMatch){
            
        }
    }
};