var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerHand: Array,
  dealerHand: Array,
  deck: Array,
  playerTot: Number || 0,
  dealerTot: Number || 0,
  gameStatus: String || "Not Started",
  playerStatus: String,
  dealerStatus: String

});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item);
  game.deck = new Deck();
  game.save(callback);
};

function Card(suit, val, symbol) {
  this.suit=suit;
  this.val=val;
  this.symbol=symbol;
}

function Deck(){
  this.deck = [];
  this.createDeck();
  this.shuffleDeck();
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // Add regular cards
  for (var i=2; i<11; i++){
    var club = new Card('clubs',i,i.toString());
    var diamond = new Card('diamonds', i, i.toString());
    var spade = new Card('spades', i, i.toString());
    var heart = new Card('hearts', i, i.toString());
    this.deck.push(club);
    this.deck.push(diamond);
    this.deck.push(spade);
    this.deck.push(heart);
  }
  //Add face cards
  var rel = {1:'J', 2:'Q', 3:'K'};
  for (var j=1; j<4;j++ ){
    var club = new Card('clubs',10,rel[j]);
    var diamond = new Card('diamonds', 10, rel[j]);
    var spade = new Card('spades', 10, rel[j]);
    var heart = new Card('hearts', 10, rel[j]);
    this.deck.push(club);
    this.deck.push(diamond);
    this.deck.push(spade);
    this.deck.push(heart);
  }
  // Add aces
  var club = new Card('clubs',11,'A');
  var diamond = new Card('diamonds', 11, 'A');
  var spade = new Card('spades', 11, 'A');
  var heart = new Card('hearts', 11, 'A');
  this.deck.push(club);
  this.deck.push(diamond);
  this.deck.push(spade);
  this.deck.push(heart);
}

Deck.prototype.shuffleDeck = function() {
  for (var i = this.deck.length - 1; i > 0; i--){
    var index = Math.floor(Math.random() * i);
    var tmp = array[index];
    array[index] = array[i];
    array[i] = tmp;
  }
};

GameSchema.methods.calcValue = function(hand){
  var sum = 0;
  var hasAce=false;
  hand.forEach(function(card){
    if (card.symbol === 'A'){
      hasAce = true;
    }
    else{
      sum += card.value;
    }
  });
  if (hasAce){
    if (sum<11){
      sum += 11;
    }
    else{
      sum += 1
    }
  }
  return sum;
};

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
