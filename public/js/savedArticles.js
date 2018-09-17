fetch('/getSavedArticles').then((response)=>{
    console.log(response);
    return response.json();
}).then((savedArticleJSON)=>{
    console.log(savedArticleJSON);
    const container = document.getElementById('savedArticleContainer');
    for (i = 0; i < savedArticleJSON.length; i++) {
        let newCard = document.createElement('div');
        newCard.id = 'articleEntry';
        newCard.className = 'card';
        newCard.setAttribute('data-id', savedArticleJSON[i]._id);
        let articleText = document.createElement('div');
        articleText.className = 'card-content';
        let articleTextTitle = document.createElement('span');
        articleTextTitle.className = 'card-title';
        let articleLinkArea = document.createElement('div');
        let sourceHeading = document.createElement('h6');
        articleLinkArea.className = 'card-action';
        let articleLink = document.createElement('a');
        articleLink.innerText = 'Article Link' + ' Shared By: ' + 
        savedArticleJSON[i].savedUser;
        
        let commentBtn = document.createElement('a');
        commentBtn.className = 'btn-floating btn-large waves-effect waves-light green'

        articleTextTitle.innerText = savedArticleJSON[i].savedTitle;
        sourceHeading.innerText = savedArticleJSON[i].savedPublication
        articleLink.href = savedArticleJSON[i].savedUrl;
        newCard.append(articleText);
        newCard.append(articleLinkArea);
        articleText.append(articleTextTitle);
        articleText.append(sourceHeading);
        articleLinkArea.append(articleLink);
        newCard.append(commentBtn);
        
        
        container.append(newCard);
    }
});