loginTabBtn = document.getElementById('loginTab');
loginForm = document.getElementById('loginForm');
registerTabBTn = document.getElementById('registerTab');
regusterForm = document.getElementById('registerForm');



loginTabBtn.addEventListener('click', ()=>{
    console.log('clicked');
    if(loginForm.getAttribute('state') == 'out'){
        loginForm.style = 'animation-duration: 3s; animation-name: slideIn; animation-fill-mode: forwards;'
        loginForm.setAttribute('state', 'in') 
    }else if(loginForm.getAttribute('state') == 'in'){
        loginForm.style = 'animation-duration: 3s; animation-name: slideOut; animation-fill-mode: forwards;'
        loginForm.setAttribute('state', 'out');
    }
});
