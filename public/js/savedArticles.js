//adding event listener to DOM for materialize css 
document.addEventListener('DOMContentLoaded', function () {
    //first ajax call to get saved articles 
    fetch('/getSavedArticles').then((response) => {
        return response.json();
    }).then((savedArticleJSON) => {
        //target container that we will append to when we finsish the loop
        const container = document.getElementById('savedArticleContainer');
        //used a for loop here, instead for a forEach. Not sure why i've seen debates online suggusting for loops are faster operations than forEach. For now this solution will do.
        for (i = 0; i < savedArticleJSON.length; i++) {
            //create our elements and add the materialize classes to them
            let newCard = document.createElement('div');
            newCard.id = 'articleEntry';
            newCard.className = 'card';
            //!important to get data-id attribute for targeting these these elements later. 
            newCard.setAttribute('data-id', savedArticleJSON[i]._id);
            let articleText = document.createElement('div');
            articleText.className = 'card-content';
            let articleTextTitle = document.createElement('span');
            articleTextTitle.className = 'card-title';
            let articleLinkArea = document.createElement('div');
            let sourceHeading = document.createElement('h6');
            articleLinkArea.className = 'card-action';
            let articleLink = document.createElement('a');
            articleLink.innerText = 'Article Link' + ' Shared By: ' + savedArticleJSON[i].savedUser;
            let commentBtn = document.createElement('a');
            commentBtn.className = 'btn-floating btn-large waves-effect waves-light green'
            commentBtn.href = '#modal1'
            commentBtn.id = 'commentModalTrigger'
            //now lets add the values to our created elements with the relevant data from our ajax call. 
            articleTextTitle.innerText = savedArticleJSON[i].savedTitle;
            sourceHeading.innerText = savedArticleJSON[i].savedPublication
            articleLink.href = savedArticleJSON[i].savedUrl;
            //append all this stuff that we have been building 
            newCard.append(articleText);
            newCard.append(articleLinkArea);
            articleText.append(articleTextTitle);
            articleText.append(sourceHeading);
            articleLinkArea.append(articleLink);
            newCard.append(commentBtn);
            container.append(newCard);
        }

         
        //create an array of our all saved articles 
        const savedArticlesArray = document.getElementsByClassName('card');
        //create ul with materialize class for dropdowns
        const collapsibleUl = document.createElement('ul');
        collapsibleUl.className = 'collapsible';
        commentPosts = document.createElement('li');
        collapsibleUl.append(commentPosts);
        collapsibleHeader = document.createElement('div');
        collapsibleHeader.innerText = 'View Comments'
        collapsibleHeader.className = 'collapsible-header';
        commentPosts.append(collapsibleHeader);
        collapsibleBody = document.createElement('div');
        collapsibleBody.className = 'collapsible-body';
        commentPosts.append(collapsibleBody);
       
   

        
        // const commentSection = document.createElement('li');
        // collapsibleUl.append(commentSection);

        //loop through our saved articles
        Array.from(savedArticlesArray).forEach((savedArticleItem)=>{
            //get the data-id for current index in our loop
            let articleIdForComment = savedArticleItem.getAttribute('data-id');
            console.log(articleIdForComment);
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
                //a nested loop required for getting each comment in the array and creating posts for each one. 
                Array.from(commentsForArticle).forEach((comment)=>{
                    newRow = document.createElement('div');
                    newRow.className = 'row';
                    commentHTML = `
                    <div class="col s12">
                      <div class="card">
                          <span class="card-title">User: ${comment.username}</span>
                        </div>
                        <div class="card-content">
                          <p>${comment.body}</p>
                        </div>
                        <div class="card-action">
                          <a href="#">${comment.dateOfPost}</a>
                        </div>
                      </div>
                    </div>`
                   newRow.innerHTML = commentHTML;
                   collapsibleBody.append(newRow);                   
                });     
                    articleContainer.firstChild.append(collapsibleUl);             
                    const elem = document.querySelector('.collapsible');
                    let instance = M.Collapsible.init(elem);
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
        const commentBtns = document.getElementsByClassName('btn-floating');
        Array.from(commentBtns).forEach((commentBtn) => {
            console.log(commentBtn.parentElement);
            commentBtn.addEventListener('click', () => {
                //on comment button press open the modal and use the cookie framework to create a cookie with the selected article id for the post. 
                let instance = M.Modal.init(elem);
                instance.open();
                docCookies.setItem('articleID', commentBtn.parentElement.getAttribute('data-id'));      
            });
        });

          
        //function that creates comment post for ajax call
        createCommentPost = (savedArticleItem) => {
            //get the value of whats currently in the comment modal. 
            commentBody = document.getElementById('commentBody').value;
            //create an object with our values. 
            data = {
                articleId: docCookies.getItem('articleID'),
                username: docCookies.getItem('username'),
                body: commentBody,
                dateOfPost: new Date()
            }
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



       
            // let instances = M.Modal.init(elems);    
        commentPostBtn.addEventListener('click', createCommentPost);
    });


});


