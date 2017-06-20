window.game = {};

$("#betForm").submit(function(e){
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: $(location).attr('href'),
    data: { bet: $("#bet").val() },
    cache: false,
    success: function(game){
      play(game);
    }
  });
  return false;
});

window.addEventListener("load", getData, false);

function getData(){
  $("#betForm").show();
  $(".dealer-area").hide();
  $(".user-area").hide();
  $.ajax({
    type: "GET",
    url: $(location).attr('href'),
    dataType: 'json',
    cache: false,
    success: function(game){
      if (game.status==="Not Started"){
        //alert("please set bet");
        $("#betForm").show();
        $(".dealer-area").hide();
        $(".user-area").hide();
      } else{
          play(game);
      }
    }
  });
}


function play(game){
  // YOUR CODE HERE
  $("#betForm").hide();
  $(".dealer-area").show();
  $(".user-area").show();

  $("#hit").on('click', hit);
  $("#stand").on('click', stand);

  game.playerHand.forEach(function(card) {
    $("#user-hand").append(showCard(card));
  });

  game.dealerHand.forEach(function(card) {
    $("#dealer-hand").append(showCard(card));
  });
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
  $.ajax({
    url: `/game/${game.id}/hit`,
    method: "post",
    success: function(game) {
      play(game);
    }
  })
}

function stand() {
  // YOUR CODE HERE
  $.ajax({
    url: `/game/${game.id}/stand`,
    method: "post",
    success: function(game) {
      play(game);
    }
  })
}
