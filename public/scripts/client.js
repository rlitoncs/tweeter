/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {

  // Test / driver code (temporary). Eventually will get this from the server.
  const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png"
        ,
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": "https://i.imgur.com/nlhLi3I.png",
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    }
  ]

  const renderTweet = (tweets) => {
    for (const tweet of tweets){
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet); 
    }
  }
  
  const createTweetElement = (tweet) => {
    const days = Math.floor(tweet.created_at / 86400000);
    
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
            <div class="date-posted">${days} days</div> 
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

  renderTweet(data);
})
