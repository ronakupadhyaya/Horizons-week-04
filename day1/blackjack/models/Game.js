var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerBet: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  userTotal: {
    type: Number,
    required: true
  },
  dealerTotal: {
    type: Number,
    required: true
  },
  userStatus: {
    type: String,
    required: true
  },
  dealerStatus: {
    type: String,
    required: true
  },
  currentPlayerHand: {
    type: Array,
  },
  houseHand: {
    type: Array,
  },
  deck: {
    type: Array,
    required: true
  }
});


GameSchema.statics.newGame = function(item, callback){
  var game = new this(item);
  game.deck = new Deck();
  console.log(game);
  game.save(callback);
};

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

function createCardsInSuit(suitName) {
  var arr = [];
  for (var i = 2; i <= 10; i++) {
    arr.push(new Card(suitName, i, i.toString()));
  }
  arr.push(new Card(suitName, 10, "Jack"));
  arr.push(new Card(suitName, 10, "Queen"));
  arr.push(new Card(suitName, 10, "King"));
  arr.push(new Card(suitName, 11, "Ace"));
  return arr;
}

Deck.prototype.createDeck = function() {
  this.deck = this.deck.concat(createCardsInSuit("Hearts"));
  this.deck = this.deck.concat(createCardsInSuit("Spades"));
  this.deck = this.deck.concat(createCardsInSuit("Diamonds"));
  this.deck = this.deck.concat(createCardsInSuit("Clubs"));
};

Deck.prototype.shuffleDeck = function() {
  for (var i = 0; i < 52; i++) {
    var index = Math.floor(Math.random() * 52);
    var temp = this.deck[i];
    this.deck[i] = this.deck[index];
    this.deck[index] = temp;
  }
};

GameSchema.methods.calcValue = function(hand){
  console.log(hand);
  return hand.reduce(function(a, b) {
    return a.val + b.val;
  });
};

GameSchema.methods.dealInitial = function(bet, cb) {
  this.status = "In Progress";
  this.playerBet = bet;
  this.currentPlayerHand.push(this.deck.pop());
  this.currentPlayerHand.push(this.deck.pop());
  this.houseHand.push(this.deck.pop());
  this.houseHand.push(this.deck.pop());
  this.userStatus = "Waiting";
  this.dealerStatus = "Waiting";
  this.userTotal = this.calcValue(this.currentPlayerHand);
  this.dealerTotal = this.calcValue(this.houseHand);
  this.save(cb);
};

GameSchema.methods.hit = function(cb){
  this.currentPlayerHand.push(this.deck.pop());
  this.userTotal = this.calcValue(this.currentPlayerHand);
  if (this.userTotal > 21) {
    this.gameOver("Dealer wins");
  } else if (this.userTotal === 21){
    this.gameOver("Player wins");
  } else {
    this.save(cb);
  }
};

GameSchema.methods.stand = function(){
  while (this.dealerTotal < 17) {
    this.houseHand.push(this.deck.pop());
    this.dealerTotal = this.calcValue(this.houseHand);
  }
  if (this.dealerTotal > 21 || this.dealerTotal < this.userTotal) {
    this.gameOver("Player wins");
  } else if (this.dealerTotal === this.userTotal) {
    this.gameOver("Player wins");
  } else {
    this.gameOver("Dealer wins");
  }
};

GameSchema.methods.gameOver = function(res, cb){
  this.gameStatus = res;
  this.save(cb);
};

module.exports = mongoose.model('Game', GameSchema);
