const docCookies = {
    getItem: function (sKey) {
      if (!sKey) { return null; }
      getUserData();
      return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    }
}

const article = document.getElementsByClassName('card');

findArticleId = (ele) => {
    let articleId = ele.parentNode.parentNode.getAttribute('data-id');
    let savedUsername =  docCookies.getItem('username');
    let savedArticleTitle = ele.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
    let savedArticleDescription = ele.parentNode.parentNode.childNodes[0].childNodes[1].innerText;
    let savedArticleUrl = ele.parentNode.parentNode.childNodes[1].childNodes[0].href;
    let savedSourcePublication = ele.parentNode.parentNode.childNodes[1].childNodes[2].innerText
    let data = {savedTitle: savedArticleTitle, savedDescription: savedArticleDescription, savedUrl: savedArticleUrl, savedPublication: savedSourcePublication, savedUser: savedUsername}
    if(savedUsername == ''){
        getUserData();
    }else{   
    fetch('/getArticles/' + articleId, 
        {method: 'POST', 
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
}).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
    // window.location.reload();
    }
}

Array.from(article).forEach((ele) =>{
    btn = ele.childNodes[1].childNodes[3];
    btn.addEventListener('click', findArticleId);
});

buildArticlesFromJSON('/getArticles');