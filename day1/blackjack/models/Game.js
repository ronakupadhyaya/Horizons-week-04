var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  playerBet: Number,
  playerHand: Array,
  dealerHand: Array,
  cardsInDeck: Array,
  playerHandValue: {
    type: Number,
    default: 0
  },
  dealerHandValue: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String,
    enum: ['Not Started', 'Over', 'In Progress'],
    default: 'Not Started'
  },
  playerStatus: String,
  dealerStatus: String

});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.cardsInDeck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  this.suit = suit;
  this.symbol = symbol;
  if(symbol === 'A'){
    this.val = 11;
  } else if(symbol ==='K' || symbol ==='Q' || symbol ==='J'){
    this.val = 10;
  } else{
    this.val = val;
  }

}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck();
  return this.deck;
}

Deck.prototype.createDeck = function(cb) {
  // YOUR CODE HERE
  var symbolArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
  var suitArray = ["hearts", "diamonds", "spades", "clubs"];
  var deckArray = [];
  for(var i = 0; i < symbolArray.length; i++){
    for(var j = 0; j < suitArray.length; j++){
      var newCard = new Card(suitArray[j], symbolArray[i], symbolArray[i]);
      this.deck.push(newCard);
    }
  }
  return this.deck;
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  for(var i = this.deck.length-1; i> 0; i--){
    var randomIndex = Math.floor(Math.random() * i);
    var tmp = this.deck[randomIndex];
    this.deck[randomIndex] = this.deck[i];
    this.deck[i] = tmp;
  }
  return this.deck;

}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  var sum = 0;

  for(var i =0; i < hand.length;i++){
    if(hand[i].symbol === 'A'){
      if(sum + hand[i].val > 21){
        sum = sum + 1;
      } else{
        sum = sum + hand[i].val;
      }
    } else{
      sum = sum +hand[i].val;
    }
  }
  return sum;
}

GameSchema.methods.dealInitial = function(cb) {
  // YOUR CODE HERE
  var playerDeck = this.playerHand;
  var dealerDeck = this.dealerHand;
  var cardDeck = this.cardsInDeck;
  for (var i =0; i < 2; i++){
    var randomIndex1 = Math.floor(Math.random() * this.cardsInDeck.length);
    this.playerHand.push(cardDeck[randomIndex1]);
    this.cardsInDeck.splice(randomIndex1, 1);
    var randomIndex2 = Math.floor(Math.random() * this.cardsInDeck.length);
    this.dealerHand.push(cardDeck[randomIndex2]);
    this.cardsInDeck.splice(randomIndex2, 1);
  }
  this.playerHandValue = this.calcValue(this.playerHand);
  this.dealerHandValue = this.calcValue(this.dealerHand);
  this.gameStatus = 'In Progress';
  this.save(cb);

};

GameSchema.methods.hit = function(cb){
  // YOUR CODE HERE
  this.playerHand.push(this.cardsInDeck[0]);
  console.log(this.playerHand);
  this.playerHand = this.calcValue(this.playerHand);
  if(this.playerHand> 21){
    this.gameOver(this, cb);
  } else{
    cb(null, this);
  }
};

GameSchema.methods.stand = function(cb){
  // YOUR CODE HERE
  while(this.calcValue(this.dealerHand) < 17 || this.calcValue(this.dealerHand) > 21){
    this.dealerHand.push(this.cardsInDeck[0]);
  }
  this.gameOver(this, cb);
}

GameSchema.methods.gameOver = function(game, cb){
  this.gameStatus = 'Over';
  var playerValue = this.calcValue(game.playerHand);
  var dealerValue = this.calcValue(game.dealerHand);
  console.log("values", playerValue, dealerValue);
  if(playerValue > 21){
    this.playerStatus = 'lose';
    this.dealerStatus = 'win';
  }
  else if(dealerValue >21){
    if(playerValue <= 21){
      this.playerStatus = 'win';
      this.dealerStatus = 'lose';
    }
  }

  else{
    if( dealerValue > playerValue){
      this.playerStatus = 'lose';
      this.dealerStatus = 'win';
    }
    if(dealerValue === playerValue){
      this.playerStatus = 'draw';
      this.dealerStatus = 'draw';
    }
    if(dealerValue < playerValue){
      this.playerStatus = 'win';
      this.dealerStatus = 'lose';
    }
  }


  this.save(cb);
}

module.exports = mongoose.model('Game', GameSchema);
