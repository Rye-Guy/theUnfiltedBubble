fetch('/getSavedArticles').then((response)=>{
    console.log(response);
    return response.json();
}).then((savedArticleJSON)=>{
    console.log(savedArticleJSON);
});