function getUserData(){
    fetch('/getUser').then(function(response){
        console.log(response);
        return response.json();
    }).then(function(username){
        console.log(username);
        usernameContainer.innerText = username
        let now = new Date();
        let time = now.getTime();
        time += 3600 + 1000;
        now.setTime(time);
        document.cookie = 'username=' + username + '; expires=' + now.toUTCString() + '; path=/';
    });    
}
getUserData();


fetch('/getArticles').then(function (response) {
    console.log(response);
    return response.json();
}).then(function (articleJSONData) {
    const container = document.getElementById('articlesContainer');
    console.log(articleJSONData);
    for (i = 0; i < articleJSONData.length; i++) {
        let newCard = document.createElement('div');
        newCard.id = 'articleEntry';
        newCard.className = 'card blue-grey darken-1';
        newCard.setAttribute('data-id', articleJSONData[i]._id);
        newCard.setAttribute('onclick', 'findArticleId(this)')
        let articleText = document.createElement('div');
        articleText.className = 'card-content white-text';
        let articleTextTitle = document.createElement('span');
        articleTextTitle.className = 'card-title';
        let articleTextDescription = document.createElement('p');
        let articleLinkArea = document.createElement('div');
        articleLinkArea.className = 'card-action';
        let articleLink = document.createElement('a');
        articleLink.innerText = 'Article Link';
        let publicationString = document.createElement('a') 
        let br = document.createElement('br');
        let floatingActionButton = document.createElement('a');
        floatingActionButton.className = 'btn-floating btn-large waves-effect waves-light red';
        floatingActionButton.id = 'saveArticle';
        publicationString.innerText = 'Source: ' + articleJSONData[i].sourcePublication;
        articleTextTitle.innerText = articleJSONData[i].articleTitle;
        articleTextDescription.innerText = articleJSONData[i].articleDescription;
        articleLink.href = articleJSONData[i].articleUrl;
        newCard.append(articleText);
        newCard.append(articleLinkArea);
        articleText.append(articleTextTitle);
        articleText.append(articleTextDescription);
        articleLinkArea.append(articleLink);
        articleLinkArea.append(br);
        articleLinkArea.append(publicationString);
        articleLinkArea.append(floatingActionButton);
        container.append(newCard);
     
    }
    const docCookies = {
        getItem: function (sKey) {
          if (!sKey) { return null; }
          getUserData();
          return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        }
    }
    const article = document.getElementsByClassName('card');
    findArticleId = (ele) => {
        let articleId = ele.getAttribute('data-id');
        let savedUsername =  docCookies.getItem('username');
        let savedArticleTitle = ele.childNodes[0].childNodes[0].innerText;
        let savedArticleDescription = ele.childNodes[0].childNodes[1].innerText;
        let savedArticleUrl = ele.childNodes[1].childNodes[0].href;
        let savedSourcePublication = ele.childNodes[1].childNodes[2].innerText
        console.log(savedUsername);
        let data = {savedTitle: savedArticleTitle, savedDescription: savedArticleDescription, savedUrl: savedArticleUrl, savedPublication: savedSourcePublication, savedUser: savedUsername}
        if(savedUsername == ''){
            getUserData().then(findArticleId(ele));
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
        ele.addEventListener('click', findArticleId);
    });
});


