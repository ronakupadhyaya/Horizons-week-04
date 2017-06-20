// window.game = game || {};

$(document).on("submit", "form", function(e){
  e.preventDefault();
  var betval = $('#betForm').val();
  console.log("submit function");
  $.ajax({
    type: "POST",
    url: $(location).attr('href'),
    data: {
      playerBet: betval
    },
    cache: false,
    success: function(game){
      // console.log(game);
      // YOUR CODE HERE
      // var gamedata = getData();


    }
  });
  return false;
});

window.addEventListener("load", getData, false);

function getData(){
  // var betval = $('#user-buttons').hide();
  $('.user-area').hide();
  $('.dealer-area').hide();
  // YOUR CODE HERE
  // return window.game.gameStatus;
  console.log("getdata called");
  // event.preventDefault();
  // console.log($(location).attr('href'));
  $.ajax({
    url: $(location).attr('href') + "/json",
    method: 'GET',
    data: {

    },
    success: function(resp){
      // console.log($(location).attr('href'));
      console.log(resp);
      // window.game = resp.game;

    }
  })
}


function play(game){
  // var betval = $('#user-buttons').hide();
  // YOUR CODE HERE
}

function showCard(card) {
  var html="";
  switch(card.suit) {
    case "hearts": suit_text = "&hearts;"; break;
    case "diamonds": suit_text = "&diams;"; break;
    case "spades": suit_text = "&spades;"; break;
    case "clubs": suit_text = "&clubs;"; break;
  }
  html = "<div class='card " + card.suit + "'>\
            <div class='card-value'>" + card.symbol + "</div>\
            <div class='suit'>" + suit_text + "</div>\
            <div class='main-number'>"+card.symbol +"</div>\
            <div class='invert card-value'>"+card.symbol+"</div>\
            <div class='invert suit'>"+suit_text+"</div>\
          </div>";
  return html;
}

function hit() {
  // YOUR CODE HERE
}

function stand() {
  // YOUR CODE HERE
}
