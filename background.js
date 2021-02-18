console.log("this app is running in the background")

function buttonClicked(tab){
    console.log("Hello")
    console.log(tab)
    // chrome.tab.sendMessage(tab.id)
}

// chrome.tabs.sendMessage({"token":getToken()})

function setToken(value){
    return  chrome.storage.local.set({"token": value}, function() {
        console.log('Value is set to ' + value);
      });
}

function  getToken() {
    return chrome.storage.local.get(['token'], function(result) {
        return Object.keys(result).length ?  result.token : false
      }) || false
}

setToken("random token")

console.log(getToken())

chrome.browserAction.onClicked.addListener(buttonClicked)

console.log(chrome.browserAction, buttonClicked)
