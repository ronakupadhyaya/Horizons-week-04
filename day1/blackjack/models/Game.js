var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  prebet: Number,
  playerhand: Array,
  dealerhand: Array,
  deck: Array,
  playervalue: {
    type: Number,
    default: 0},
  dealervalue: {
    type: Number,
    default: 0},
  gamestatus: {
    type: String,
    default: 'Not Started',
    enum: ['Not Started', 'Over', 'In Progress'] },
  playerstatus: String,
  dealerstatus: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
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
  var suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  var faces = ['J', 'Q', 'K'];

  suits.forEach(function(suit){

    for(var i = 2; i < 10; i++){
      var card = new Card(suit, i, i.toString());
      this.deck.push(card);
    };
    for(var j = 0; j < 3; j++){
      var card = new Card(suit, 10, faces[j]);
      this.deck.push(card);
    };
    var ace = new Card(suit, 11, 'A');
    this.deck.push(ace);

  });

}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  var shuffle = [];
  for(var i = 0; i < 52; i++){
    var rand = Math.random()*this.deck.length;
    shuffle.push(this.deck.splice(rand, 1)[0]);
  };

  this.deck = shuffle;
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
