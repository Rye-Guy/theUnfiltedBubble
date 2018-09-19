const usernameContainer = document.getElementById('usernameNavDisplay');
// function getUserData(){
    fetch('/getUser').then(function(response){
        return response.json();
    }).then(function(username){
        console.log(username);
        usernameContainer.innerText = username
        let now = new Date();
        let time = now.getTime();
        time += 3600 * 100000;
        now.setTime(time);
        document.cookie = 'username=' + username + '; expires=' + now.toUTCString() + '; path=/';
    });    
// }

// getUserData();