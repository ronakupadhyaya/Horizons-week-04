var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number,
    required: true
  },
  playerHand: {
    type: Array, 
    required: true
  },
  dealerHand: {
    type: Array,
    required: true
  },
  deck: {
    type: Array,
    required: true
  },
  playerValue: {
    type: Number,
    required: true,
    default: 0
  },
  dealerValue: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    default: "Not Started"
  },
  playerStat: {
    type: String,
    required: true
  },
  dealerStat: {
    type: String,
    required: true
  }
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  this.suit = suit;
  this.val = val;
  this.symbol = symbol;
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {

  var deck = [];

  var suit = ["hearts", "diamonds", "spades", "clubs"];
  var val = [2,3,4,5,6,7,8,9,10,10,10,10,11];
  var symbol = ["2","3","4","5","6","7","8","9","10","J", "Q", "K", "A"];

  for (var i = 0; i<suit.length; i++) {
    for (var j =0; j<val.length; j++) {
      deck.push(new Card(suit[i], val[j], symbol[j]))
    };
  };

}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
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