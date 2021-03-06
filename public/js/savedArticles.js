//adding event listener to DOM for materialize css 
document.addEventListener('DOMContentLoaded', function () {
    //first ajax call to get saved articles 
    fetch('/getSavedArticles').then((response) => {
        return response.json();
    }).then((savedArticleJSON) => {
        console.log(savedArticleJSON);
        //target container that we will append to when we finsish the loop
        const container = document.getElementById('savedArticleContainer');
        //used a for loop here, instead for a forEach. Not sure why i've seen debates online suggusting for loops are faster operations than forEach. For now this solution will do.
        for (i = 0; i < savedArticleJSON.length; i++) {
            //create our elements and add the materialize classes to them
            let newCard = document.createElement('div');
            newCard.id = 'savedArticle';
            newCard.className = 'card';
            //!important to get data-id attribute for targeting these these elements later. 
            newCard.setAttribute('data-id', savedArticleJSON[i]._id);
            let articleText = document.createElement('div');
            articleText.className = 'card-content';
            articleText.id = 'savedArticleContent'
            let btnArea = document.createElement('div');
            btnArea.className = 'btnArea';
            let articleTextTitle = document.createElement('span');
            articleTextTitle.className = 'card-title';
            let articleLinkArea = document.createElement('div');
            let sourceHeading = document.createElement('h6');
            articleLinkArea.className = 'card-action';
            articleLinkArea.id = 'savedArticleLinkArea';
            let articleLink = document.createElement('a');
            articleLink.className = 'btn waves-effect waves-light activator';
            articleLink.id = 'savedArticleLink';
            articleLink.innerText = 'Article Link';
            articleLink.setAttribute('target', '_blank');
            let sharedUsernameDisplay = document.createElement('a');
            sharedUsernameDisplay.innerText = 'Shared by: ' + savedArticleJSON[i].savedUser;
            sharedUsernameDisplay.id = 'usernameDisplay';
            let commentBtn = document.createElement('a');
            commentBtn.setAttribute('target', 'commentButton');
            commentBtn.className = 'btn-floating btn-large waves-effect waves-light blue'
            commentBtn.href = '#modal1'
            commentBtn.id = 'commentButton'
            let voteUpBtn = document.createElement('a');
            let voteDownBtn = document.createElement('a');
            voteUpBtn.className = 'btn-floating btn-large waves-effect waves-light green';
            voteDownBtn.className = 'btn-floating btn-large waves-effect waves-light red';
            voteUpBtn.id = 'voteUpBtn';
            voteDownBtn.id = 'voteDownBtn';
            votesDisplay = document.createElement('span');
            votesDisplay.className = 'badge';
        
            //now lets add the values to our created elements with the relevant data from our ajax call. 
            articleTextTitle.innerText = savedArticleJSON[i].savedTitle;
            sourceHeading.innerText = savedArticleJSON[i].savedPublication
            articleLink.href = savedArticleJSON[i].savedUrl;
            votesDisplay.innerText = savedArticleJSON[i].votes;
            //append all this stuff that we have been building 
            newCard.append(articleText);
            articleText.prepend(votesDisplay);
            newCard.append(votesDisplay);
            newCard.append(articleLinkArea);
       
            articleText.append(articleTextTitle);
            articleText.append(sourceHeading);
            articleLinkArea.append(articleLink);
            articleLinkArea.append(sharedUsernameDisplay);
            articleText.append(btnArea)
            btnArea.append(voteUpBtn);
            btnArea.append(voteDownBtn);
            btnArea.append(commentBtn);
            container.append(newCard);
        }
        allVotes = document.querySelectorAll('.badge');
        console.log(allVotes);
        Array.from(allVotes).forEach((vote)=>{
            if(parseInt(vote.innerText) < 0){
                vote.style.backgroundColor = '#ef5350'
            }else if(parseInt(vote.innerText) > 0){
                vote.style.backgroundColor = '#66bb6a'
            }else{
                vote.style.backgroundColor = '#bdbdbd'
            }
        })        


        savedArticlesArray = document.getElementsByClassName('card');
        // const commentSection = document.createElement('li');
        // collapsibleUl.append(commentSection);

        //loop through our saved articles
        Array.from(savedArticlesArray).forEach((savedArticleItem)=>{
            //get the data-id for current index in our loop
            let articleIdForComment = savedArticleItem.getAttribute('data-id');
            //ajax call to get the article comments using the Id as a filter to only get related articles. 
            fetch('/getSavedComments/'+articleIdForComment).then((response) => {
                return response.json();
            }).then((commentsForArticle) => {  
                //now lets build our comment post in here
                console.log(commentsForArticle);
                //find the matching article container by finding the only data-id with the matching data-id attribute
                articleContainer = document.querySelector(`[data-id='${articleIdForComment}']`);
                //if the call to get comments returns a array any longer than nothing make a drop down with the comments
                if(commentsForArticle.length > 0){
                    cardReveal = document.createElement('div');
                    cardReveal.className = 'card-reveal';
                    viewCommentsBtn = document.createElement('a');
                    viewCommentsBtn.className = 'btn waves-effect waves-light activator';
                    viewCommentsBtn.innerText = 'Revel Comments';
                    closeBtn = document.createElement('span');
                    closeBtn.className = 'card-title closeBtn';
                    closeBtn.id = 'closeBtn';
                    cardReveal.append(closeBtn);
                //a nested loop required for getting each comment in the array and creating posts for each one. 
                Array.from(commentsForArticle).forEach((comment)=>{

                    //create DOM elements 
                    newRow = document.createElement('div');
                    newRow.className = 'row';
                    //builds the comment. 
                    commentHTML = `
                    <div class="col s12">
                        <div class="card-content" id="commentCard">
                          <p><span class='usernameForComment'>${comment.username} says:</span> ${comment.body}</p>
                        </div>
                        <div class="card-action" id="commentCard">
                          <a href="#">${comment.dateOfPost}</a>
                        </div>
                      </div>
                    </div>`
                   newRow.innerHTML = commentHTML;
                   cardReveal.append(newRow);                
                });     
                articleContainer.firstChild.append(viewCommentsBtn);
                articleContainer.append(cardReveal);             
                // const elems = document.querySelectorAll('.collapsible');
                // let instance = M.Collapsible.init(elems);
            
                 }else{
                    console.log('article with no comment');
                }
            });
        });


    
        //target the comment btn in the modal
        const commentPostBtn = document.getElementById('postCommentBtn');
        //extablishes our one modal as our element 
        elem = document.getElementById('modal1');
    


        //function that loops through the comment buttons array. adds click events to create cookie for ajax call and triggers modal to open for the modoal. 
        const commentBtns = document.querySelectorAll('[target=commentButton]');
        Array.from(commentBtns).forEach((commentBtn) => {
            console.log(commentBtn.parentElement);
            commentBtn.addEventListener('click', () => {
                //on comment button press open the modal and use the cookie framework to create a cookie with the selected article id for the post. 
                let instance = M.Modal.init(elem);
                instance.open();
                docCookies.setItem('articleID', commentBtn.parentElement.parentElement.parentElement.getAttribute('data-id'));      
            });
        });

          
        //function that creates comment post for ajax call
        createCommentPost = (savedArticleItem) => {
            //get the value of whats currently in the comment modal. 
            commentBody = document.getElementById('commentBody').value;
            //create an object with our values. 
            timeOfPost = new Date();
            readableDateString = timeOfPost.toGMTString();
            data = {
                articleId: docCookies.getItem('articleID'),
                username: docCookies.getItem('username'),
                body: commentBody,
                dateOfPost: readableDateString
            }
            console.log(data);
            //ajax makes a post request sets headers and inserts the data
            fetch('/savedArticles/'+docCookies.getItem('articleID'), {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                //log responses
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));
        }

        makeVote = (articleId, userInputVote) => {

            data = {
                _id: articleId,
                votes: userInputVote
            }
            console.log(data);
            fetch('userVotes/'+docCookies.getItem('articleID'),{
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
            //log responses
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
        }
    
        

        voteDownBtn = document.querySelectorAll('#voteDownBtn');
        Array.from(voteDownBtn).forEach((btn)=>{
            btn.addEventListener('click', () => {
                articleId = btn.parentElement.parentElement.parentElement.getAttribute('data-id');
                makeVote(articleId, (parseInt(btn.parentElement.parentElement.parentElement.childNodes[1].innerText) + -1));
                document.location.reload();
;            });
        });

        voteUpBtn = document.querySelectorAll('#voteUpBtn');
        Array.from(voteUpBtn).forEach((btn)=>{
            btn.addEventListener('click', () => {
                articleId = btn.parentElement.parentElement.parentElement.getAttribute('data-id');
                makeVote(articleId, (parseInt(btn.parentElement.parentElement.parentElement.childNodes[1].innerText) + 1));
                document.location.reload();
            });
        });
       
            // let instances = M.Modal.init(elems);    
        commentPostBtn.addEventListener('click', createCommentPost);
    });
});


