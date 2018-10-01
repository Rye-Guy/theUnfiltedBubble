//this function does exactly what you can assume it does from the name. It builds the articles from the JSON data that is gotten depedning on the route.
function buildArticlesFromJSON(route){
//es6 fetch that does our get request on passed in route.
    fetch(route).then(function (response) {
        return response.json();
    }).then(function (articleJSONData) {
    //now that we got our sweet data what are we going to do with all of it. 
    //lets get a container that were going to put all of our articles inside of. 
        const container = document.getElementById('articlesContainer');
    //loop through the array of articles and make each individual card. 
        for (i = 0; i < articleJSONData.length; i++) {
    //creating elements and adding material/our own classes. 
            let newCard = document.createElement('div');
            newCard.id = 'articleEntry';
            newCard.className = 'card card-width';
            //setting the data id to the unique Id generated by mongo. Very important to the how articles get saved to the other database. 
            newCard.setAttribute('data-id', articleJSONData[i]._id);
            // newCard.setAttribute('onclick', 'findArticleId(this)')
            //all of these are less essential but all are created elements with the correct classes. 
            let articleText = document.createElement('div');
            articleText.className = 'card-content white-text';
            let articleTextTitle = document.createElement('span');
            articleTextTitle.className = 'card-title';
            let articleTextDescription = document.createElement('p');
            let articleLinkArea = document.createElement('div');
            articleLinkArea.className = 'card-action';
            let articleLink = document.createElement('a');
            articleLink.innerText = 'Article Link';
            articleLink.className = 'articleLink btn waves-effect waves-light';
            //opens articles in a new tab. risky soluation but needed. Maybe update this later. 
            articleLink.setAttribute('target', '_blank');
            let publicationString = document.createElement('a') 
            publicationString.className = 'publicationName'
            let br = document.createElement('br');
            //created our action buttons and attach onclick functions to our saved button. Very important in actaully pulling off this entire operation. 
            let floatingActionButton = document.createElement('a');
            floatingActionButton.className = 'btn-floating btn-large waves-effect waves-light saveArticleBtn';
            floatingActionButton.setAttribute('onclick', 'findArticleId(this), M.toast({html: "Article Saved!"})');
            // floatingActionButton.setAttribute('onclick', 'M.toast({html: "Article Saved!"})');
            floatingActionButton.id = 'saveArticle';
            //bam bam lets take that json data and add it to our each card we are creating.
            publicationString.innerText = 'Source: ' + articleJSONData[i].sourcePublication;
            articleTextTitle.innerText = articleJSONData[i].articleTitle;
            articleTextDescription.innerText = articleJSONData[i].articleDescription;
            articleLink.href = articleJSONData[i].articleUrl;
            //append all this work to the dom. 
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
    })
}