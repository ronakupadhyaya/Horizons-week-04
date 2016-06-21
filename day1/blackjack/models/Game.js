var mongoose = require('mongoose');
var connect = require('../config');
mongoose.connect(connect.db);

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number
  },
  playerCards: [{
    type: Array
  }],
  dealerCards: [{
    type: Array
  }],
  deck: [{
    type:Array
  }],
  playerVal: 0,
  dealerVal: 0,
  gameStatus: "Not Started",
  playerStatus: {
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

Deck.prototype.createDeck = function() {
  var suits = [ "hearts", "diamonds", "spades", "clubs"];
  var symbols = [2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K', 'A'];

  var val;
  var symbol;
  var suit;

  for (var i = 0; i < symbols.length; i ++){
    for (var j = 0; j < suits.length; j++){
      if (!isNaN(symbols[i])) {
        val = symbols[i];
      }
      else if (symbols[i] === 'A') {
        val = 11;
      }
      else {
        val = 10;
      }
      symbol = String(symbols[i]);
      suit = suits[i];
      var newCard = new Card (suit, val, symbol);
      this.deck.push(newCard);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  var usedind = {};
  var newdeck = new Array(52);
  if (this.deck.length === 0){
    this.deck = newdeck;
    return;
  }
  var ind = Math.random() * (this.deck.length+1);
  var inde = Math.floor(ind);
  newdeck.push(this.deck[inde]);
  this.deck.splice(inde, 1);
  this.shuffleDeck();
};

GameSchema.methods.calcValue = function(hand){
  var sum = 0;
  for (var i = 0; i< hand.length; i++){
    if (hand[i].symbol === "A"){
      if ((sum+11)<= 11){
        sum+=11;
      }
      else{
        sum+=1;
      }
    else {
      sum+=hand[i].val;
    }
  }
  return sum;
}

GameSchema.methods.dealInitial = function() {
  var playhand = [];
  var dealerhand = [];
  playhand.push(this.deck[0]);
  dealerhand.push(this.deck[1]);
  playhand.push(this.deck[2]);
  dealerhand.push(this.deck[3]);
  this.deck.splice(0,4);
  this.gameStatus = "In Progress";
  this.playerVal = this.calcValue(playhand);
  this.dealerVal = this.calcValue(dealerhand);
  this.playerCards = playhand;
  this.dealerCards = dealerhand;
};

GameSchema.methods.hit = function(){
  this.playerCards.push(this.deck[0]);
  this.deck.splice(0,1);
  this.playerVal = this.calcValue(this.playerCards);
  if (this.playerVal > 21){
    this.gameOver();
  }
};

GameSchema.methods.stand = function(){
  if (this.dealerVal >= 17){
    this.gameOver();
  }
  this.dealerCards.push(this.deck[0]);
  this.deck.splice(0,1);
  this.dealerVal = this.calcValue(this.dealerCards);
  this.stand();
}

GameSchema.methods.gameOver = function(){
  this.gameStatus = "Over"
  if (this.playerVal<= 21 && this.dealerVal<=21){
    if (this.playerVal>this.dealerVal){
      this.playerStatus = "Won";
      this.dealerStatus = "Lost";
    }
    else if (this.playerVal<this.dealerVal){
      this.playerStatus = "Lost";
      this.dealerStatus = "Won";
    }
    else
    {
      this.playerStatus = "Tie";
      this.dealerStatus = "Tie";
    }
  }
  else if (this.playerVal> 21 && this.dealerVal>21){
    this.playerStatus = "Tie";
    this.dealerStatus = "Tie";
  }
  else if (this.playerVal> 21){
    this.playerStatus = "Lost";
    this.dealerStatus = "Won";
  }
  else{
    this.playerStatus = "Won";
    this.dealerStatus = "Lost";
  }
}

module.exports = mongoose.model('Game', GameSchema);