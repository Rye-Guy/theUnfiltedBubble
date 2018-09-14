
fetch('/getArticles').then(function(response){
    console.log(response)
    return response.json()
}).then(function (articleJSONData){
    console.log(articleJSONData);
    return articleJSONData; 
}).then(function createArticles(articleJSONData){
    let newCard = document.createElement('div');
    newCard.className = 'card blue-grey darken-1';
    let articleText = document.createElement('div');
    articleText.className = 'card-content white-text';
    let articleTextTitle = document.createElement('span');
    articleTextTitle.className = 'card-title';
    let articleTextDescription = document.createElement('p');
    for(i = 0; i < articleJSONData.length; i++){
        articleTextTitle.innerText = articleJSONData[i].articleTitle;
        articleTextDescription.innerText = articleJSONData[i].articleDescription;
        newCard.append(articleText);
        articleText.append(articleTextTitle);
        articleText.append(articleTextDescription);
        console.log(newCard);
    }
    
});



