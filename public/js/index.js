const usernameContainer = document.getElementById('usernameNavDisplay');

fetch('/getUser').then(function(response){
    console.log(response);
    return response.json();
}).then(function(username){
    console.log(username);
    usernameContainer.innerText = username;
});
