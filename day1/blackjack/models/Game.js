var mongoose = require('mongoose');
var shuffle = require('shuffle-array')

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet:Number,
  playerCard:Array,
  dealerCard:Array,
  deckCard:Array,
  playerPoint:Number,
  dealerPoint:Number,
  gameStatus:{
    type:String,
    enum:["Not Started",
    "Over",
    "In Progress"]
  },
  playerStatus:String,
  dealerStatus:String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  this.suit = suit,
  this.val = val,
  this.symbol = symbol
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suits = ["hearts","diamonds","spades","clubs"];
  var symbols = ["A","K","Q","J"]
  for (var i=0; i<4; i++) {
    for (var j=0; j<13;j++) {
      var val = i+1;
      var sym = "";
      if (val > 10) {
        val = 10;
        sym = symbols[j%11];
      } else if (val === 1) {
        val = 11;
      }
      var newCard = new Card(suit[i], val, sym)
      this.deck.push(newCard);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  shuffle(this.deck);
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
