var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerBet: Number,
  playeCards: Array,
  dealerCards: Array,
  deck: Array,
  playerTotal: Number,
  dealerTotal: Number,
  gameStatus: {
    type: String,
    default: "Not Started",
    enum: ['Not Started', 'Over', 'In Progress'],
  }
  playerStatus: String,
  dealerStatus: String,
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  var card = {};
  card.suit = suit;
  card.val = val;
  card.symbol = symbol;
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  var symbols = ['2', '3', '4', '5', '6', '7', '8', "9", "10", "J", "Q", "K", "A"];

  for(var i = 0; i < 4; i++){
    for(var n = 0; n < 13; i++){
      var suit = suits[i];
      var symbol = symbols[n];
      var val;
      if(symbol === "J" || symbol === "Q" || symbol === "K"){
        val = 10;
      } else if (symbol === "A"){
        val = 11;
      } else {
        val = parseInt(symbol);
      }
      var card = new Card(suit, val, symbol);
      this.deck.push(card);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  var newDeck = [];
  for(var i = 0; i < 52; i++){
    var rand = Math.random()*this.deck.length;
    newDeck.push(this.deck.splice(rand, 1)[0]);
  }

  this.deck = newDeck;
}

GameSchema.methods.calcValue = function(hand){
  var hasAce = false;
  hand.forEach(function(a){
    if(a.symbol === 'A'){
      hasAce = true;
    }
  });
  if(!hasAce){
    var total = 0;
    hand.forEach(function(a){
      total += a.val;
    });
    return total;
  }
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
}

module.exports = mongoose.model('Game', GameSchema);
