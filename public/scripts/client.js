/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {

  const $form = $('#new-tweet-message');

  const renderTweet = (tweets) => {
    for (const tweet of tweets){
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet); 
    }
  }

  const createTweetElement = (tweet) => {
    // uses CDN version of timeago library 
    const timeAgo = timeago.format(tweet.created_at);
    
    const $tweetMsg = $(`
       <article class="tweet">
          <header>
            <div class="user">
              <i class="fa-solid fa-user"></i>
              <span class="user-name">${tweet.user.name}</span>
            </div>
            <span class="user-id">${tweet.user.handle}</span>
          </header>

          <div class="tweet-content"> 
            ${tweet.content.text}   
          </div>

          <footer> 
            <div class="date-posted">${timeAgo} </div> 
            <div class="icons">
              <i class="fa-solid fa-flag"></i>
              <i class="fa-solid fa-retweet"></i>
              <i class="fa-solid fa-heart"></i>
            </div>
          </footer>
        </article>
      `)
    
      return $tweetMsg;
  }

  //Load incoming tweets
  const loadTweets = () => {
    $.ajax({
      method: 'GET',
      url: '/tweets',
    })
    .done((tweets) => {
      console.log(tweets);
      renderTweet(tweets);
    })
    .fail((err) => {
      console.log(err);
    })
  }

  //Event Handler for form submission
  $form.on('submit', (event) => {
    event.preventDefault();
    const data = $form.serialize(); //creates text string in URL-encoded notation

    //POST the Data to the server (converts data to JSON)
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: data,
    })
    .done(() => {
      console.log('tweet POST was a success')
    })
    .fail((err) => {
      console.log("Error: ", err)
    })
  });


  loadTweets();
})
