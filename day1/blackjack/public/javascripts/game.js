// window.game = game || {};

$(document).on("submit", "form", function(e){
  e.preventDefault();
  var betval = $('#betForm input[name="bet"]').val();
  console.log(betval);
  console.log("submit function");
  $.ajax({
    type: "POST",
    url: $(location).attr('href'),
    data: {
      bet: betval
    },
    cache: false,
    success: function(resp){
      // resp.game.status = "In Progress";
      // console.log(resp);
      // resp.game.bet = betval; //DO I EVEN NEED THIS
      console.log(resp);

      $('#bet').text(`Bet is: ${betval}`)
      play(resp);
      // YOUR CODE HERE
      // var gamedata = getData();


    }
  });
  return false;
});

window.addEventListener("load", getData, false);

function getData(){

  $.ajax({
    // url: $(location).attr('href') + "?json=true",
    url: $(location).attr('href') + "/json",
    method: 'GET',
    success: function(resp){
      var game = resp;
      if(game.status === "Not Started"){
        $('.user-area').hide();
        $('.dealer-area').hide();
      }
      else if(game.status === "In Progress"){
        play(game);
      } else{
        //game is Over
        play(game);
        console.log(game.status);
      }


    }
  })
}


function play(game){
  // var betval = $('#user-buttons').hide();
  // YOUR CODE HERE
  console.log("play game called",game);
  $('#betForm').hide();
  $('.user-area').show();
  $('.dealer-area').show();
  $('#user-hand').empty();
  $('#dealer-hand').empty();
  $('#user-score').text(`${game.userTotal}`);
  $('#dealer-score').text(`${game.dealerTotal}`);
  $('#game-status').text(`${game.status}`);
  // console.log(game);
  game.currentPlayerHand.forEach(function(card){
    console.log("showing player cards");
    var cardhtml = showCard(card);
    $('#user-hand').append(cardhtml);
  });

  game.houseHand.forEach(function(card){
    var cardhtml = showCard(card);
    // cardhtml.attr('id','hidden-card');
    $('#dealer-hand').append(cardhtml);
  });
  $('#dealer-hand .card:first').attr("id","hidden-card");
  if(game.status === "Over"){
    $('#user-buttons').hide();
    $('#game-status').text(`${game.status} User:${game.userStatus} Dealer:${game.dealerStatus}`)

  }
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

$('#hit').on('click', hit);
$('#stand').on('click', stand);

function hit() {
  // YOUR CODE HERE

  event.preventDefault();
  $.ajax({
    // url: $(location).attr('href') + "?json=true",
    url: $(location).attr('href') + "/hit",
    method: 'post',
    data:{

    },
    success: function(game){
      console.log(game);
      // game.hit();
      play(game);
    }
  })

}

function stand() {
  // YOUR CODE HERE
  event.preventDefault();
  $.ajax({
    // url: $(location).attr('href') + "?json=true",
    url: $(location).attr('href') + "/stand",
    method: 'post',
    data:{

    },
    success: function(resp){
      console.log(resp.game);
      // game.hit();
      play(resp.game);
    }
  })
}
