$(document).ready(function() {

  const maxCharacterCount =  $(".counter").val(); 

  // Event Handler for textarea
  $("#tweet-text").on("input", function(e) {
    //traverse the DOM tree and find the .counter class
    const counter = $(this).parents().find('.counter');

    const charLength = $(this).val().length;
    const remainingChars = maxCharacterCount - charLength;

    if (remainingChars < 0){
      counter.css('color', 'red');
    } else {
      counter.css('color', '#545149');
    }

    // Update the counter based on user input
    counter.val(remainingChars);

  })

});
