const article = document.getElementsByClassName('card');
console.log(article);

Array.from(article).forEach((ele) =>{
    console.log(ele);
    btn = ele.childNodes[1].childNodes[3];
    btn.addEventListener('click', findArticleId);
});


findArticleId = (ele) => {
    console.log(ele);
    let articleId = ele.parentNode.parentNode.getAttribute
    console.log(articleId);
    let savedUsername =  docCookies.getItem('username');
    console.log(savedUsername)
    let savedArticleTitle = ele.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
    console.log(savedArticleTitle);
    let savedArticleDescription = ele.parentNode.parentNode.childNodes[0].childNodes[1].innerText;
    let savedArticleUrl = ele.parentNode.parentNode.childNodes[1].childNodes[0].href;
    let savedSourcePublication = ele.parentNode.parentNode.childNodes[1].childNodes[2].innerText
    let data = {savedTitle: savedArticleTitle, savedDescription: savedArticleDescription, savedUrl: savedArticleUrl, savedPublication: savedSourcePublication, savedUser: savedUsername, votes: 0}
    console.log(data);
    // if(savedUsername == ''){
    //     getUserData();
    // }else{   
    fetch('/getArticles/' + articleId, 
        {method: 'POST', 
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
}).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));

}




