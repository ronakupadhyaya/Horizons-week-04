var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet: {
    type: Number,
    required: true
  },
  pHand: {
    type: Array,
    required: true
  },
  dHand: {
    type: Array,
    required: true
  },
  deck: {
    type: Array,
    required: true
  },
  pValue: {
    type: Number,
    default: 0
  },
  dValue: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String,
    default: "Not Started"
  },
  pStatus: String,
  dStatus: String
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
  var suit = ['diamond', 'club', 'heart', 'spade'];
  var symbol = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  var val = [2,3,4,5,6,7,8,9,10,10,10,10,11];
  for (var i = 0; i < suit.length; i ++) {
    for (var j = 0; j < symbol.length; j ++) {
      this.deck.push(new Card(suit[i], val[j], symbol[j]));
    }
  }
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