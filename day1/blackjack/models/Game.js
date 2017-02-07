var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  {
    playerBet: Number,
    playerHand: Array,
    dealerHand: Array,
    deck: Array,
    playerValue: {type: Number, default: 0},
    dealerValue:  {type: Number, default: 0},
    gameStatus:  {type: String, default: "Not Started"},
    playerStatus: String,
    dealerStatus: String
  }
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  this.suits = suit;
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
  var suit = ["hearts", "diamonds", "spades", "clubs"];
  var valandsymbol = {11: "J", 12: "Q", 13: "K", 14: "A"};
  for(var i in suit) {
    for(var j = 2; j <= 13; j++) {
      if (j > 10) {
        this.deck.push(new Card(suit[i], 10, valandsymbol[j]));
      }
      else {

       this.deck.push(new Card(suit[i], j, String(j)));}
    }
    this.deck.push(new Card(suit[i], 11, "A"));
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  var remaining = this.deck.length;
  while(this.deck.length > 0) {
        var i = Math.floor(Math.random() * remaining--);
        var j = this.deck[remaining];
        this.deck[remaining] = this.deck[i];
        this.deck[i] = j;
  }
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
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