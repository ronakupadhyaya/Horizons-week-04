var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet: {
    type: Number,
    default: 0
  },
  playerHand: Array,
  dealerHand: Array,
  deck: Array,
  playerStatus: String,
  dealerStatus: String,
  status: {
    type: String,
    default: "Not Started"
  },
  playerVal: {
    type: Number,
    default: 0
  },
  dealerVal: {
    type: Number,
    default: 0
  }
});


GameSchema.statics.newGame = function(item, callback){
  var game = new this(item);
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE
  this.suit = suit;
  this.val = val;
  this.symbol = symbol;
}

function Deck() {
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suitArr = ["hearts", "diamonds", "spades", "clubs"];
  var symbolArr = ["K", "Q", "J"];
  var deck = this.deck;
  suitArr.forEach(function(suit) {
    for (var i = 2; i <= 10; i++) {
      deck.push(new Card(suit, i, i +""));
    }
    symbolArr.forEach(function(symbol) {
      deck.push(new Card(suit, 10, symbol));
    });
      deck.push(new Card(suit, 11, "A"));
  });
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  var deck = this.deck;
  for (var i = deck.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    var tmp = deck[index];
    deck[index] = deck[i];
    deck[i] = tmp;
  }
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  return hand.reduce(function(a, b) {
    return a + b.val;
  }, 0);
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  // var deck = this.deck;
  // var status = this.status;
  // var playerVal = this.playerVal;
  // var dealerVal = this.dealerVal;
  // var playerHand = this.playerHand;
  // var dealerHand = this.dealerHand;

  this.playerHand = this.deck.splice(0, 2);
  this.dealerHand = this.deck.splice(0, 2);

  this.status = "In Progress";

  this.playerVal = this.calcValue(this.playerHand);
  this.dealerVal = this.calcValue(this.dealerHand);
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  this.playerHand.push(this.deck.pop());
  this.playerVal = this.calcValue(this.playerHand);
  if (this.playerVal >= 21) {
    this.gameOver();
  }
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  while (this.dealerVal < 17) {
    this.dealerHand.push(this.deck.pop());
    this.dealerVal = this.calcValue(this.dealerHand);
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  this.status = "Over";
  //blackjack
  if (this.playerVal === 21 && this.dealerVal === 21) {
    if (checkBlackJack(this.dealerHand)) {
      this.dealerStatus = "winner";
      if (checkBlackJack(this.playerHand)) {
        this.playerStatus = "winner";
      } else {
        this.playerStatus = "loser";
      }
    } else {
      this.playerStatus = "winner";
      this.dealerStatus = "loser";
    }
  } else if (this.playerVal > this.dealerVal && this.playerVal <= 21) {
    this.playerStatus = "winner";
    this.dealerStatus = "loser";
  } else if (this.dealerVal > 21 && this.playerVal <= 21){
    this.playerStatus = "winner";
    this.dealerStatus = "loser";
  }
}

function checkBlackJack(hand) {
  var blackjack = false;
  if (hand.length == 2 ) {
    if(hand[0].symbol === 'A' || hand[1].symbol === 'A') {
      blackjack = true;
    }
  }
  return blackjack;
}

module.exports = mongoose.model('Game', GameSchema);
