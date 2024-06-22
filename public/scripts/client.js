/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {
  
  //============================================================================
  // Helper Functions
  //============================================================================
  
  //Direct user to textarea upon clicking 'new' btn or nav icon
  //Slide new-tweet up or down upon click
  const newTweetEventHandler = ($targetElem) => {
    $($targetElem).on('click', (event) => {
      const $form = $('main.container .new-tweet');
      if ($targetElem === 'nav .second-toggle-btn') {
        $('html').scrollTop(0);
        $form.slideDown();
        $('#tweet-text').focus();
        $('nav .second-toggle-btn').hide();
      } else if ($form.is(':visible')) {
        $form.slideUp();
        $('#tweet-text').focus();
      } else {
        $form.slideDown();
        $('#tweet-text').focus();
      }
      $('nav .second-toggle-btn').hide();
    });
  };
  
  const clearTweetContent = () => {
    return $('textarea#tweet-text').val('');
  };
  
  const clearTweetCounter = () => {
    $('.counter').text('140');
  };

  // Prevent user from cross-site scripting
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //============================================================================
  // Event Handlers
  //============================================================================
  //Clear textarea on refresh
  $(window).on('beforeunload', () => {
    $('textarea#tweet-text').val('');
  });

  $(window).on('scroll', (event) => {
    if (window.scrollY > 200) {
      $('nav .second-toggle-btn').show();
    }
  });

  //Direct user to textarea upon clicking 'new' btn or nav icon or second toggle btn
  //Slide new-tweet up or down upon click
  newTweetEventHandler('nav .new-tweet .new-tweet-btn');
  newTweetEventHandler('nav .new-tweet i');
  newTweetEventHandler('nav .second-toggle-btn');


  //============================================================================
  // Client Side JS
  //============================================================================
  const renderTweet = (tweets) => {
    $('#tweets-container').empty();
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  };
   
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
            ${escape(tweet.content.text)}   
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
      `);
    
    return $tweetMsg;
  };

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
      });
  };

  //Event Handler for form submission
  const $form = $('#new-tweet-message');

  $form.on('submit', (event) => {
    event.preventDefault();

    // Slide Up the error message on submit
    $('#tweet-error-message').slideUp(()=> {
      $('#tweet-error-message').empty();
    });

    const $tweetContent = $('textarea#tweet-text').val().trim();

    // error: empty input
    if (!$tweetContent) {
      $('#tweet-error-message').slideDown('slow', () => {
        const $tweetErrorMsg = $(`
          <i class='fas fa-exclamation-circle'> </i>
          <span> Error: No Characters Entered! </span>
        `);
        $('#tweet-error-message').append($tweetErrorMsg).css('display', 'block');
      });
      return;
    }

    // error: exceeded max characters
    else if ($tweetContent.length > 140) {
      $('#tweet-error-message').slideDown('slow', () => {
        const $tweetErrorMsg = $(`
          <i class='fas fa-exclamation-circle'> </i>
          <span> Error: Max Characters Exceeded! </span>
        `);
        $('#tweet-error-message').append($tweetErrorMsg).css('display', 'block');
      });
      return;
    }

    const data = $form.serialize(); //creates text string in URL-encoded notation

    //POST the Data to the server (converts data to JSON)
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: data,
    })
      .done(() => {
        clearTweetContent(); // clear textarea on tweet submission
        clearTweetCounter(); // reset tweet character count on tweet submission
        loadTweets(); //loadTweets after successful POST
      })
      .fail((err) => {
        console.log("Error: ", err);
      });
  });

  loadTweets();
});
