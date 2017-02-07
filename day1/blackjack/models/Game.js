var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({

  //Bet that player has made before the game
  playerBet: {
    type: Number
  },
  //Cards in the player's hand
  currentPlayerHand: [{
    default: []
  }],
  //Cards in the dealer's hand
  currentDealerHand: [{
    default: []
  }],
  //Cards in the deck
  deck: [{
  }],
  //Value of player's hand
  userTotal: {
    type: Number,
    default: 0
  },
  dealerTotal: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String,
    default: 'Not Started'
  },
  userStatus: {
    type: String
  },
  dealerStatus: {
    type: String
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



var shuffle = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    var temp = array[index];
    array[index] = array[i];
    array[i] = temp;
  }
  return array;
}

Deck.prototype.createDeck = function() {
  //Make number cards
  for (var i = 2; i < 11; i++) {
    this.deck.push(new Card('hearts', i, i.toString()));
    this.deck.push(new Card('diamonds', i, i.toString()));
    this.deck.push(new Card('spades', i, i.toString()));
    this.deck.push(new Card('clubs', i, i.toString()));
  }

  //Making Jacks
  this.deck.push(new Card('hearts', 11, 'A'));
  this.deck.push(new Card('diamonds', 11, 'A'));
  this.deck.push(new Card('spades', 11, 'A'));
  this.deck.push(new Card('clubs', 11, 'A'));

  this.deck.push(new Card('hearts', 11, 'J'));
  this.deck.push(new Card('diamonds', 11, 'J'));
  this.deck.push(new Card('spades', 11, 'J'));
  this.deck.push(new Card('clubs', 11, 'J'));

  //Making Jacks
  this.deck.push(new Card('hearts', 12, 'Q'));
  this.deck.push(new Card('diamonds', 12, 'Q'));
  this.deck.push(new Card('spades', 12, 'Q'));
  this.deck.push(new Card('clubs', 12, 'Q'));

  //Making Jacks
  this.deck.push(new Card('hearts', 13, 'K'));
  this.deck.push(new Card('diamonds', 13, 'K'));
  this.deck.push(new Card('spades', 13, 'K'));
  this.deck.push(new Card('clubs', 13, 'K'));

}

Deck.prototype.shuffleDeck = function() {
  shuffle(this.deck);
}

GameSchema.methods.calcValue = function(hand){
  var value = 0;
  var ace = false;
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].symbol === 'A') {
      ace = true;
    } else {
      value += hand[i].val;
    }
  }
  if (ace === true) {
    if (value <= 10) {
      value += 11;
    } else {
      value += 1;
    }
  }
}

GameSchema.methods.dealInitial = function() {
  this.gameStatus = 'In Progress';
  this.currentPlayerHand.push(this.deck[0]);
  this.deck = this.deck.splice(1);
  this.currentDealerHand.push(this.deck[0]);
  this.deck = this.deck.splice(1);
  this.currentPlayerHand.push(this.deck[0]);
  this.deck = this.deck.splice(1);
  this.currentDealerHand.push(this.deck[0]);
  this.deck = this.deck.splice(1);
  this.userTotal = this.calcValue(this.currentPlayerHand);
  this.dealerTotal = this.calcValue(this.currentDealerHand);
};

GameSchema.methods.hit = function(){
  this.currentPlayerHand.push(this.deck[0])
  this.deck = this.deck.splice(1);
  this.userTotal = this.calcValue(this.currentPlayerHand);
  if (this.userTotal === 21) {

  } else if (this.userTotal > 21) {
    this.gameStatus = 'Game Over';
  }

};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
}

module.exports = mongoose.model('Game', GameSchema);
