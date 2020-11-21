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
    if (e.target.name === "category_id" && e.target.value) {
        newLink = {
            ...newLink,
            [e.target.name]: Number(e.target.value)
        }
    } else {
        newLink = {
            ...newLink,
            [e.target.name]: e.target.value
        }
    }
    addProject.disabled = newLink.url && newLink.category_id ? false : true
}

if (currentToken) {
    document.getElementsByClassName("login-register")[0].style.display = "none"
    loggedInSetup()
} else {
    document.getElementsByClassName("add-site")[0].style.display = "flex"
}




let projectSelect = document.getElementById("project-drop-select")
let addProject = document.getElementById("add-project")
addProject.onclick = submitLink

addProject.disabled = newLink.url && newLink.category_id ? false : true


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
var catError = document.getElementById("category-error")
categorySelect.onchange = linkHandler

function fetchCategories(e) {
    if (e.target.value) {
        while (categorySelect.firstChild) {
            categorySelect.removeChild(categorySelect.firstChild);
            document.getElementById("category-wrap").style.visibility = "hidden"
            document.getElementById("category-wrap").style.margin = "0"
        }
        fetch(`https://papertrail1.herokuapp.com/api/projects/${e.target.value}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYwNTkzMzE3NzczNCwiaWQiOjEsImV4cCI6MTYwNTk2NDcxMzczNH0.gv-mX-yf-gaxci9hLD10hvYSGJbliuyTRPKrbsuzKLQ"
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.categories.length && res.categories[0].category!==null) {
                    catError.style = "display :none !important"
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
                } else {
                    catError.style = "display :in-line !important"
                }
            })
            .catch(err => console.log(err))
    } else {
        document.getElementById("category-wrap").style.visibility = "hidden"
        document.getElementById("category-wrap").style.margin = "0"
    }
}

let process = document.getElementById("add-link-process")
let success = document.getElementById("add-link-success")

function submitLink(e) {
    e.preventDefault()
    fetch(`https://papertrail1.herokuapp.com/api/links/${newLink.category_id}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYwNTkzMzE3NzczNCwiaWQiOjEsImV4cCI6MTYwNTk2NDcxMzczNH0.gv-mX-yf-gaxci9hLD10hvYSGJbliuyTRPKrbsuzKLQ"
        },
        body: JSON.stringify({url: newLink.url, name: newLink.name})
    })
    .then(response=>response.json())
    .then(res=>{
        process.style.display = "none"
        success.style = "display :block !important"
    })
    .catch(err=>console.log("something went wrong", err))
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