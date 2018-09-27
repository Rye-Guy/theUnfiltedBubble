loginTabBtn = document.getElementById('loginTab');
loginForm = document.getElementById('loginForm');
registerTabBtn = document.getElementById('registerTab');
registerForm = document.getElementById('registerForm');



loginTabBtn.addEventListener('click', ()=>{
    if(registerForm.getAttribute('state') == 'in' && loginForm.getAttribute('state') == 'out'){
        registerForm.style = 'animation-duration: 1.5s; animation-name: slideOut; animation-fill-mode: forwards;'
        registerForm.setAttribute('state', 'out');
        loginForm.style = 'animation-duration: 1s; animation-name: slideIn; animation-fill-mode: forwards;';
        loginForm.setAttribute('state', 'in');
    }else if(loginForm.getAttribute('state') == 'out'){
        loginForm.style = 'animation-duration: 1s; animation-name: slideIn; animation-fill-mode: forwards;';
        loginForm.setAttribute('state', 'in');
    }else if(loginForm.getAttribute('state') == 'in'){
        loginForm.style = 'animation-duration: 1.5s; animation-name: slideOut; animation-fill-mode: forwards;'
        loginForm.setAttribute('state', 'out');
    }
});

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
