var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  playerBet: Number,
  playerCard: Array,
  dealerCard: Array,
  cardsinDeck: Array,
  playerCardVal: Number || 0,
  dealerCardVal: Number || 0,
  gameStatus: {
    type: String,
    enum: ["Not Started", "Over", "In Progress"]
  },
  playerStatus: String,
  dealerStatus: String
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
  for(var i = 2; i <= 10; i++){
    var hearts = new Card("heart", i, i.toString());
    var diamonds = new Card("diamonds", i, i.toString());
    var spades = new Card("spades", i, i.toString());
    var clubs = new Card("clubs", i, i.toString());
    this.deck.push(hearts);
    this.deck.push(diamonds);
    this.deck.push(spades);
    this.deck.push(clubs);
  }
  var faces = ['K', 'Q', 'J', 'A'];
  faces.forEach(function(face){
    if(face === "A"){
      this.deck.push(new Card("heart", 11, face));
      this.deck.push(new Card("diamonds", 11, face));
      this.deck.push(new Card("spades", 11, face));
      this.deck.push(new Card("clubs", 11, face));
    }
    else{
      this.deck.push(new Card("heart", 10, face));
      this.deck.push(new Card("diamonds", 10, face));
      this.deck.push(new Card("spades", 10, face));
      this.deck.push(new Card("clubs", 10, face));
    }
  })
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  var indices = [];
  var deck = []
  this.deck.forEach(function(card){
    deck[Math.floor(Math.random()*(52-1+1)+1)] = card;
    indices.push(Math.floor(Math.random()*(52-1+1)+1))
  })

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