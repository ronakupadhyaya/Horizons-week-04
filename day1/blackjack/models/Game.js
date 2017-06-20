var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: Number,
  player_hand: Array,
  dealer_hand: Array,
  deck: Array,
  player_hand_value: {type:Number, default: 0},
  dealer_hand_value: {type:Number, default: 0},
  status: {
    type: String,
    enum: ["Not Started", "Over", "In Progress"],
    default: "Not Started"
  },
  player_status: String,
  dealer_status: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  return {suit: suit, val: val, symbol: symbol};
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {

  var suits = ["hearts", "diamonds", "spades", "clubs"];
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j <= 14; j++) {
      if (j > 10) {
        this.deck.push(new Card(suits[i], j, j));
      } else if (j === 11) {
        this.deck.push(new Card(suits[i], 10, j));
      } else if (j === 12) {
        this.deck.push(new Card(suits[i], 10, j));
      } else if (j === 13) {
        
      } else if (j === 14) {
        
      } 
      
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