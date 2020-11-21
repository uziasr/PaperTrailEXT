let credentials = {
    email: "",
    password: ""
}

let currentToken = true //getToken()

// function  getToken() {
//     return chrome.storage.local.get(['token'], function(result) {
//         return result.token
//       }) || false
// }

// function isLoggedIn() {
//     return localStorage.getItem("token") || false
// }

function credentialHandler(e) {
    credentials = {
        ...credentials,
        [e.target.name]: e.target.value
    }
}

// function isLoggedIn() {
//     if (currentToken) {
//         document.getElementsByClassName("login-register")[0].style.display = "none"
//     } else {
//         document.getElementsByClassName("add-site")[0].style.display = "flex"
//     }
// }

if (currentToken) {
    console.log("I am logged in")
    document.getElementsByClassName("login-register")[0].style.display = "none"
    loggedInSetup()
} else {
    document.getElementsByClassName("add-site")[0].style.display = "flex"
}

function loggedInSetup() {
    fetch("https://papertrail1.herokuapp.com/api/projects/all", {
        headers: {
            "Content-Type": "application/json",
            authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYwNTkzMzE3NzczNCwiaWQiOjEsImV4cCI6MTYwNTk2NDcxMzczNH0.gv-mX-yf-gaxci9hLD10hvYSGJbliuyTRPKrbsuzKLQ"
        }
    })
        .then(response => response.json())
        .then(res => {
            if (res.length) {
                let projectSelect = document.getElementById("project-drop-select")
                projectSelect.style.display = "flex"
                for(let project of res){
                    let selectOption = document.createElement("OPTION")
                    selectOption.value = project.id
                    selectOption.text = project.name
                    projectSelect.appendChild(selectOption)
                }
                // projectSelect.appendChild()
            }
        })
        .catch(err => console.log(err))
}


// login form DOM
document.getElementById("login-button").onclick = loginHandler;
document.getElementById("email-input").onchange = credentialHandler
document.getElementById("password-input").onchange = credentialHandler

// bookmark DOM
document.getElementById("url-input").value = window.location.href


function loginHandler() {
    fetch("https://papertrail1.herokuapp.com/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(response => response.json())
        .then(res => {
            chrome.storage.local.set({
                token: res.data.token
            }, function () {
                console.log('Value is set to ' + value);
            });
            console.log(res)
        })
        .catch(err => console.log(err))
}