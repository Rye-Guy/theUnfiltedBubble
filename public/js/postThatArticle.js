//create an array of all our articles that we can use to loop through 
const article = document.getElementsByClassName('card');

//loop through our array our articles and add an a click event to every article 
Array.from(article).forEach((ele) =>{
    //find our button in the dom tree. 
    btn = ele.childNodes[1].childNodes[3];
    //add that event baby!
    btn.addEventListener('click', findArticleId);
});

//this is the meat and gravy of our saving articles script.  
findArticleId = (ele) => {
    //basically we use the button as our root element and navigating outside of it to generate the information needed to create a new article for the saved section. 
    let articleId = ele.parentNode.parentNode.getAttribute
    //get the user name using the cookies framework from the mdn
    let savedUsername =  docCookies.getItem('username');
    //going outside the buttons parent nodes and going in its other silbings that hold test information need to post a new article. 
    let savedArticleTitle = ele.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
    let savedArticleDescription = ele.parentNode.parentNode.childNodes[0].childNodes[1].innerText;
    let savedArticleUrl = ele.parentNode.parentNode.childNodes[1].childNodes[0].href;
    let savedSourcePublication = ele.parentNode.parentNode.childNodes[1].childNodes[2].innerText
    //create an object with our data in it. This is going to change the game. adds votes too new feature added in after. Default is set to zero but we will set it here as well. 
    let data = {savedTitle: savedArticleTitle, savedDescription: savedArticleDescription, savedUrl: savedArticleUrl, savedPublication: savedSourcePublication, savedUser: savedUsername, votes: 0}
    //send our data in a post request. 
    //finds our indiviual article we are saving. 
    fetch('/getArticles/' + articleId, 
        {method: 'POST', 
        //stringify the data. needed to send data through the header. 
        body: JSON.stringify(data),
        //set the content type also required for our successful post. 
        headers: {'Content-Type': 'application/json'}
}).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));

}




