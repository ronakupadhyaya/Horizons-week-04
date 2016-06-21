var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerBet: {
    type: Number, 
    default: 0
  },
  currentPlayerHand: Array,
  currentDealerHand: Array,
  deck: Array,
  userHandTotal: {
    type: Number, 
    default: 0
  },
  dealerHandTotal: {
    type: Number, 
    default: 0
  },
  status: {
    type: String, 
    default: "Not Started"
  },
  userStatus: {
    type: String, 
    default: "waiting"
  },
  dealerStatus: {
    type: String, 
    default: "waiting"
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
  // YOUR CODE HERE
  var suits = {0: "hearts", 1: "spades", 2: "clubs", 3: "diamonds"};
  var faces = {11: "J", 12: "Q", 13: "K", 14: "A"};
  for(var i in suits) {
    for(var j = 2; j <= 13; j++) {
      if (j > 10) this.deck.push(new Card(suits[i], 10, faces[j]));
      else this.deck.push(new Card(suits[i], j, String(j)));
    }
    this.deck.push(new Card(suits[i], 11, "A"));
  }
}

Deck.prototype.shuffleDeck = function() {
  _.shuffle(this.deck);
}

GameSchema.methods.calcValue = function(hand){
  var count = 0;
  for (var i = 0; i < hand.length; i++) {
    count += hand[i].val;
  }
  return count;
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