//grab our elements by id. Buttons and forms. 
loginTabBtn = document.getElementById('loginTab');
loginForm = document.getElementById('loginForm');
registerTabBtn = document.getElementById('registerTab');
registerForm = document.getElementById('registerForm');

//these functions are just for flare on the homepage. Animations that slide the login and register forms in and out depending on what the user is actually trying to do. 

//on click for login tab
loginTabBtn.addEventListener('click', ()=>{
    //if the regiser form is viewable and login form hiding switch them out. 
    if(registerForm.getAttribute('state') == 'in' && loginForm.getAttribute('state') == 'out'){
        registerForm.style = 'animation-duration: 1.5s; animation-name: slideOut; animation-fill-mode: forwards;'
        registerForm.setAttribute('state', 'out');
        loginForm.style = 'animation-duration: 1s; animation-name: slideIn; animation-fill-mode: forwards;';
        loginForm.setAttribute('state', 'in');
    //nothing is viewable and they click login. 
    }else if(loginForm.getAttribute('state') == 'out'){
        loginForm.style = 'animation-duration: 1s; animation-name: slideIn; animation-fill-mode: forwards;';
        loginForm.setAttribute('state', 'in');
    //login is viewable but the user clicks the button again. 
    }else if(loginForm.getAttribute('state') == 'in'){
        loginForm.style = 'animation-duration: 1.5s; animation-name: slideOut; animation-fill-mode: forwards;'
        loginForm.setAttribute('state', 'out');
    }
});
//exact same as above function just flipped for if the user want to register verses logging in. Functional pieces are symetrical however. One is the mirror of the other. not sure if we can shorten this at some point. 
registerTabBtn.addEventListener('click', ()=>{
    if(loginForm.getAttribute('state') == 'in' && registerForm.getAttribute('state') == 'out'){
        loginForm.style = 'animation-duration: 1.5s; animation-name: slideOut; animation-fill-mode: forwards;'
        loginForm.setAttribute('state', 'out');
        registerForm.style = 'animation-duration: 1s; animation-name: slideIn; animation-fill-mode: forwards;'
        registerForm.setAttribute('state', 'in');
    }else if(registerForm.getAttribute('state') == 'out'){
        registerForm.style = 'animation-duration: 1s; animation-name: slideIn; animation-fill-mode: forwards;'
        registerForm.setAttribute('state', 'in') 
    }else if(registerForm.getAttribute('state') == 'in'){
        registerForm.style = 'animation-duration: 1.5s; animation-name: slideOut; animation-fill-mode: forwards;'
        registerForm.setAttribute('state', 'out');
    }
});

