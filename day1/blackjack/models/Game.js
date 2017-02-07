var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
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
  this.createDeck();
  this.shuffleDeck();
  return this.deck;
}

Deck.prototype.createDeck = function() {
  
  for(var i=0; i<4; i++){
    for(var j=2; j<15; j++){
      var suit;
      var val;
      var symbol;

      if(i === 0){
        suit = "hearts";
      }else if(i === 1){
        suit = "diamonds";
      }else if(i === 2){
        suit = "spades";
      }else{
        suit = "clubs";
      }

      if(j === 11){
        //JACK
        val = 10;
        symbol = "J";

      }else if(j === 12){
        //QUEEN
        val = 10;
        symbol = "Q";

      }else if(j === 13){
        //KING
        val = 10;
        symbol = "K";

      }else if(j === 14){
        //ACE
        val = 11;
        symbol = "A";
      }else{
        //ALL OTHER CARDS
        val = j;
        symbol = j.toString();
      }

      var newCard = new Card(suit, val, symbol);

      this.deck.push(newCard);


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