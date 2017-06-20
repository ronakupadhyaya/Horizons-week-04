var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  playerBet: Number,
  playerCards: Array,
  dealerCards: Array,
  deckCards: Array,
  playerTotal: {
    type: Number,
    default: 0
  },
  dealerTotal: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String,
    default: "Not Started"
  },
  playerStatus:{
    type: String
  },
  dealerStatus: {
    type: String
  }
});


// var Game = mongoose.model('Game', GameSchema);

GameSchema.statics.newGame = function(item, callback){
  // console.log(item, callback);
  var game = new this(item)
  game.deckCards = new Deck();

  // console.log(game);
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
  this.shuffleDeck(this.deck)
  // console.log(this.deck);
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  var deckobj = this.deck;
  suits.forEach(function(suit){

    for (var i = 2; i <= 10; i++) {
      deckobj.push(new Card(suit,i, i+""));
    }
    deckobj.push(new Card(suit,10, "J"));
    deckobj.push(new Card(suit,10, "Q"));
    deckobj.push(new Card(suit,10, "K"));
    deckobj.push(new Card(suit,11, "A"));
  })
  this.deck = deckobj;
  // return deckobj;
}

Deck.prototype.shuffleDeck = function(deck) {
  // YOUR CODE HERE
  for (var i = 0; i < this.deck.length; i++) {
    var index = Math.floor(Math.random()*i);
    var temp = this.deck[index];
    this.deck[index] = this.deck[i];
    this.deck[i] = temp;
  }
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  return hand.reduce(function(a,b){
    // console.log(typeof a.val);
    return a + b.val;
  },0)

}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  this.dealerCards = this.deckCards.splice(0,2);
  this.playerCards = this.deckCards.splice(0,2);
  //PLAYERSTATUS
  // console.log(this.playerCards);
  this.gameStatus = "In Progress";
  this.playerTotal = this.calcValue(this.playerCards);
  this.dealerTotal = this.calcValue(this.dealerCards);
  // this.save(function(error){})
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  this.playerCards.push(this.deckCards.pop());
  this.playerTotal = this.calcValue(this.playerCards);
  // this.save(function(error){})
  if(this.playerTotal >= 21){
    this.gameOver();
  }

};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  while(this.dealerTotal < 17){
    console.log(this.dealerTotal);
    this.dealerCards.push(this.deckCards.pop());
    this.dealerTotal = this.calcValue(this.dealerCards);
  }

  // this.save(function(error){})
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  this.gameStatus = "Over";
  // var dealerHand = this.dealerTotal;
  //
  if(this.dealerTotal>21){
    if(this.playerTotal <=21 ){
      this.playerStatus = "win";
      this.dealerStatus = "lose";
    }
  }else if(this.playerTotal <=21){
    if(this.dealerTotal < this.playerTotal){
      this.playerStatus = "win";
      this.dealerStatus = "lose";
    }else if(this.dealerTotal > this.playerTotal){
      this.playerStatus = "lose";
      this.dealerStatus = "win";
    }else{
      this.playerStatus = "idk";
      this.dealerStatus = "idk";
    }
  } else{
    this.playerStatus = "idk";
    this.dealerStatus = "idk";
  }

  // this.save(function(error){})
}

module.exports = mongoose.model('Game', GameSchema);
