document.addEventListener('DOMContentLoaded', function () {
    
    fetch('/getSavedArticles').then((response) => {
        console.log(response);
        return response.json();
    }).then((savedArticleJSON) => {
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
            commentBtn.href = '#modal1'
            commentBtn.id = 'commentModalTrigger'
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

         
        //create an array of our all saved articles 
        const savedArticlesArray = document.getElementsByClassName('card');
        const collapsibleUl = document.createElement('ul');
        collapsibleUl.className = 'collapsible';
        collapsibleUl.id = 'elementTrigger';
        const ulTrigger = document.querySelectorAll('.collapsible');

        Array.from(savedArticlesArray).forEach((savedArticleItem)=>{
            let articleIdForComment = savedArticleItem.getAttribute('data-id');
            console.log(articleIdForComment);
            fetch('/getSavedComments/'+articleIdForComment).then((response) => {
                return response.json();
            }).then((commentForArticle) => {
                console.log(commentForArticle);
                if(commentForArticle.length > 0){
                    articleContainer = document.querySelector(`[data-id='${articleIdForComment}']`);
                    collapsibleUl.innerHTML = '<li class=><div class="collapsible-header">View Comments</div><div class="collapsible-body" style="display: none;"></div></li>'
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
                //on comment button press open the modal and use the cookie framework to create a cookie with the selected article for the post. 
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
            //closes the modal
        }



       
            // let instances = M.Modal.init(elems);    
        commentPostBtn.addEventListener('click', createCommentPost);
    });


});


