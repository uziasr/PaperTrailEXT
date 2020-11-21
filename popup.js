let credentials = {
    email: "",
    password: ""
}

let newLink = {
    url: window.location.href,
    name: null,
    category_id: null
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

function linkHandler(e) {
    newLink = {
        ...newLink,
        [e.target.name]: e.target.value
    }
    console.log(newLink)
}

if (currentToken) {
    console.log("I am logged in")
    document.getElementsByClassName("login-register")[0].style.display = "none"
    loggedInSetup()
} else {
    document.getElementsByClassName("add-site")[0].style.display = "flex"
}




let projectSelect = document.getElementById("project-drop-select")
let addProject = document.getElementById("add-project")
addProject.disabled =  newLink.url && newLink.category_id ? false : true

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
                projectSelect.style.display = "flex"
                let selectNullOption = document.createElement("OPTION")
                projectSelect.appendChild(selectNullOption)
                for (let project of res) {
                    let selectOption = document.createElement("OPTION")
                    selectOption.value = project.id
                    selectOption.text = project.name
                    projectSelect.appendChild(selectOption)
                }
            }
        })
        .catch(err => console.log(err))
}

projectSelect.onchange = fetchCategories
let categorySelect = document.getElementById("category-drop-select")

function fetchCategories(e) {
    console.log( "hello",e.target.value)

    if (e.target.value) {
        fetch(`https://papertrail1.herokuapp.com/api/projects/${e.target.value}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYwNTkzMzE3NzczNCwiaWQiOjEsImV4cCI6MTYwNTk2NDcxMzczNH0.gv-mX-yf-gaxci9hLD10hvYSGJbliuyTRPKrbsuzKLQ"
            }
        })
        .then(response=>response.json())
        .then(res=>{
            if(res.categories){
                document.getElementById("category-wrap").style.visibility = "visible"
                document.getElementById("category-wrap").style.margin = "12px 0 20px 0"
                let selectNullOption = document.createElement("OPTION")
                categorySelect.appendChild(selectNullOption)
                for (let category of res.categories) {
                    let categoryOption = document.createElement("OPTION")
                    categoryOption.value = category.id
                    categoryOption.text = category.category
                    categorySelect.appendChild(categoryOption)
                }
            }
        })
        .catch(err=>console.log(err))
    } else {
        document.getElementById("category-wrap").style.visibility = "hidden"
        document.getElementById("category-wrap").style.margin = "0"
        while (categorySelect.firstChild) {
            categorySelect.removeChild(categorySelect.firstChild);
        }
    }
}


// login form DOM
document.getElementById("login-button").onclick = loginHandler;
document.getElementById("email-input").onchange = credentialHandler
document.getElementById("password-input").onchange = credentialHandler

// bookmark DOM
document.getElementById("url-input").value = newLink.url
document.getElementById("url-name").onchange = linkHandler
document.getElementById("url-input").onchange = linkHandler



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