var mongoose = require('mongoose');
var shuffle = require('fisher-yates');
var _ = require('underscore');

var GameSchema = new mongoose.Schema({
  bet:{
    type: Number
  },
  playerHand:{
    type: Array
  },
  dealerHand:{
    type: Array
  },
  deck:{
    type: Array
  },
  playerValue:{
    type: Number,
    default: 0
  },
  dealerValue:{
    type: Number,
    default: 0
  },
  gameStatus:{
    type: String,
    default: 'Not Started'
  },
  playerStatus:{
    type: String
  },
  dealerStatus:{
    type: String
  },
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

Deck.prototype.suits = ["hearts", "diamonds", "spades", "clubs"];
Deck.prototype.symbols=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
Deck.prototype.values={
  A:11,
  K:10,
  Q:10,
  J:10,
  10:10,
  9:9,
  8:8,
  7:7,
  6:6,
  5:5,
  4:4,
  3:3,
  2:2
};

Deck.prototype.createDeck = function() {
  Deck.prototype.symbols.forEach(function(symbol){
    Deck.prototype.suits.forEach(function(suit){
      this.deck.push(new Card(suit,Deck.prototype.values[symbol],symbol));
    });
  });
}

Deck.prototype.shuffleDeck = function() {
  this.deck = shuffle(this.deck);
}

GameSchema.methods.calcValue = function(hand){
  var total = 0;
  var numAces = 0;
  hand.forEach(function(card,index){
    if(card.symbol!=='A'){
      total+=card.val;
    }
    else{
      numAces++;
    }
  });
  if(numAces === 0){
    return total;
  }
  var possible = [total];
  while(numAces>0){
    var temp = [0];
    possible.forEach(function(possibleVal,index,arr){
      arr[index]+=11;
      temp.push(possibleVal + 1);
    });
    possible = possible.concat(temp);
    numAces--;
  }
  var over = 100;
  total = _.max(possible,function(num){
    if(num > 21){
      if(num<over){
        over = num;
      }
      return -1;
    }
    return num;
  });
  if(total>-1){
    return total;
  }
  return over;
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
