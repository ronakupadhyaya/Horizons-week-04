window.game = {};
$(document).ready(function(){

  window.addEventListener("load", getData, false);

  function getData(){
    $.ajax({
      type: "GET",
      url: $(location).attr('href') + "/json",
      cache: false,
      success: function(game){
        console.log(game);
        if (game.status === "Not Started"){
          $('.newGameBtn').hide();
          $('.user-area').hide();
          $('.dealer-area').hide();
          $('#betForm').show();
          // game.dealerHand.forEach(function(item)){
          //   $('#dealer-hand').append(`<div>${item.suit}${item.val}${item.symbol}</div>`)
          // }
          // game.playerHand.forEach(function(item)){
          //   $('#user-hand').append(`<div>${item.suit}${item.val}${item.symbol}</div>`)
          // }
          // $('#dealer-score').val(game.dealerTotal);
          // $('#user-score').val(game.userTotal);
        }else{
          console.log("HERE");
          play(game);
        }
      }
    });
  }
  $("#betForm").submit(function(e){
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: $(location).attr('href') + '/bet',
      data: {
        bet: $("#betInput").val()
      },
      cache: false,
      success: function(game){
        console.log(game);
        console.log($("#betInput").val());
        play(game);
      }
    });
    return false;
  });
  $('#hit').on('click',hit);
  $('#stand').on('click',stand);
  function play(game){
    var status = game.status;
    $('.newGameBtn').hide();
    $("#betForm").hide();
    $(".dealer-area").show();
    $(".user-area").show();
    $("#user-score").html(game.userTotal);
    $('#user-hand').empty()
    $('#dealer-hand').empty();

    for(var i = 0; i < game.currentPlayerHand.length; i++){
      $('#user-hand').append(showCard(game.currentPlayerHand[i]));
    }
    for(var i = 0; i < game.houseHand.length; i++){
      $('#dealer-hand').append(showCard(game.houseHand[i]));
    }
    if (game.status === 'Over' ){
      $("#dealer-score").html(game.dealerTotal);
      if (game.userStatus === 'Draw' ){$('.blkJ').after('<div style="font-size:large; color:red;">' + game.userStatus + '!</div>');}
      else{$('.blkJ').after('<div style="font-size:large; color:red;">You ' + game.userStatus + '!' + '</div>');}
      $('#hit').hide()
      $('#stand').hide();
      $('.newGameBtn').show()
    }
    else {
      var firstCard = $("#dealer-hand .card:first");
      firstCard.attr("id", "hidden-card");
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

  function hit() {
    $.ajax({
      type: "POST",
      url: $(location).attr('href') +'/hit',
      dataType: 'json',
      cache: false,
      success: function(data){
        console.log(data);
        play(data)
      }
    });
  }

  function stand() {
    $.ajax({
      type: "POST",
      url:  $(location).attr('href') +'/stand',
      dataType: 'json',
      cache: false,
      success: function(data){
        console.log(data);
        play(data)
      }
    });
  }
})
