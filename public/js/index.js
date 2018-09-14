
fetch('/getArticles').then(function(response){
    console.log(response)
    return response.json()
}).then(function (articleJSONData){
    console.log(articleJSONData);
    for(i = 0; i < articleJSONData.length; i++){
        let newCard = document.createElement('div');
        newCard.className = 'card blue-grey darken-1';
        let articleText = document.createElement('div');
        articleText.className = 'card-content white-text';
        let articleTextTitle = document.createElement('span');
        articleTextTitle.className = 'card-title';
        let articleTextDescription = document.createElement('p');
        let articleLinkArea = document.createElement('div');
        articleLinkArea.className = 'card-action';
        let articleLink = document.createElement('a');
        articleLink.innerText = 'Article Link';
        let publicationString = document.createElement('a');
        publicationString.innerText = 'Source: ' + articleJSONData[i].sourcePublication;
        articleTextTitle.innerText = articleJSONData[i].articleTitle;
        articleTextDescription.innerText = articleJSONData[i].articleDescription;
        articleLink.href = articleJSONData[i].articleUrl;
        newCard.append(articleText);
        newCard.append(articleLinkArea);
        articleText.append(articleTextTitle);
        articleText.append(articleTextDescription);
        articleLinkArea.append(articleLink);
        articleLinkArea.append(publicationString);
        console.log(newCard);
    }
});



