var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet: Number,
  player_hand: Array,
  dealer_hand: Array,
  deck: Array,
  player_val: Number,
  dealer_val: Number,
  game_status: String,
  player_status: String,
  dealer_status: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  return {
    suit: suit,
    val: val,
    symbol: symbol
  }
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suits = ['heart', 'diamond', 'spade', 'clover'];
  var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  var symbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < values.length; j++) {
      this.deck.push(Card(suits[i], values[j], symbols[j]));
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  var randomNum = Math.floor(Math.random() * 52);
  var temp;
  for (var i = 0; i < 4; i++) {
    var arr1 = [];
    var arr2 = [];
    for (var j = randomNum; j < randomNum + 26; j++) {
      if (j > 52) {
        temp = j - 52;
      } else {
        temp = j;
      }
      arr1.push(this.deck[temp]);
    }
    for (var k = randomNum; k < randomNum + 26; k++) {
      if (k > 52) {
        temp = k - 52;
      } else {
        temp = k;
      }
      arr2.push(this.deck[k]);
    }
    arr = [];
    for (var l = 0; l < 26; l++) {
      arr.push(arr1[l]);
      arr.push(arr2[l]);
    }
  }
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
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