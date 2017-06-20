var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  preBet: Number,
  playerHand: Array,
  dealerHand: Array,
  cardsInDeck: Array,
  playerValue: Number
  dealerValue: Number,
  status: String,
  playerStatus: String,
  dealerStatus: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  var suit = suit;
  var val = val;
  var symbol = symbol;
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  for(var i = 0; i < 4; i++){
    var suit =  "";
    var val = 0;
    var symbol = "";
    if(i === 0){
      suit = 'hearts';
    } else if(i === 1){
      suit = 'diamonds';
    } else if(i === 2){
      suit = 'spades';
    } else {
      suit = 'hearts';
    }
    for(var j = 1; j < 14; j++){
      if(j === 1){
        val = 11;
        symbol = "A";
      } else if(j === 2){
        val = 2;
        symbol = "2";
      } else if(j === 3){
        val = 3;
        symbol = "3";
      } else if(j === 4){
        val = 4;
        symbol = "4";
      } else if(j === 5){
        val = 5;
        symbol = "5";
      } else if(j === 6){
        val = 6;
        symbol = "6";
      } else if(j === 7){
        val = 7;
        symbol = "7";
      } else if(j === 8){
        val = 8;
        symbol = "8";
      } else if(j === 9){
        val = 9;
        symbol = "9";
      } else if(j === 10){
        val = 10;
        symbol = "10";
      } else if(j === 11){
        val = 10;
        symbol = "J";
      } else if(j === 12){
        val = 10;
        symbol = "Q";
      } else if(j === 13){
        val = 10;
        symbol = "K";
      }
    }
    this.push(new Card(suit, val, symbol));
  }
}

Deck.prototype.shuffleDeck = function() {
  for(var i = 0; i < this.length; i++){
    var firstIndex = Math.floor(Math.random()*52);
    var secondIndex = Math.floor(Math.random()*52);
    var temp = this[firstIndex];
    this[firstIndex] = this[secondIndex];
    this[secondIndex] = temp;
  }
}

GameSchema.methods.calcValue = function(hand){
  var value = 0;
  var numAces = 0;
  for(var i = 0; i < hand.length; i++){
    if(hand[i].symbol === 'A'){
      numAces++;
    } else {
      value += hand[i].val;
    }
  }
  while(numAces > 0){
    if(value-21 > 5){
      value -= 10;
      numAces--;
    } else {
      break;
      // if that doesn't work, just numAces--;
    }
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
