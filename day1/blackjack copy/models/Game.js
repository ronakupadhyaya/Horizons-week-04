var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  module.exports = {
    game: mongoose.model('game', {
      bet: {
        type: Number
      },
      pCards: {
        type: Array
      },
      dCards: {
        type: Array
      },
      deckCards: {
        type: Array
      },
      pValue: {
        type: Number,
        default: 0
      },
      dValue: {
        type: Number,
        default: 0
      },
      status: {
        type: String,
        enum: [
          'Not Started',
          'Over',
          'In Progress'
        ],
        default: 'Not Started'
      },
      pStatus: {
        type: String,
      },
      dStatus: {
        type: String
      }
    })
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
  this.symbol = symbol
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var suit = ["hearts", "diamonds", "spades", "clubs"];
  var val = [11,2,3,4,5,6,7,8,9,10,10,10];
  var symbol = ["A","2","3","4","5","6","7","8","9","J","Q","K",];
  var zipped = _.zip([val],[symbol]);
  for (var i = 0; i < suit.length; i++){
    for (var j = 0; j < zipped.length; j++) {
      var newCard = new Card(suit[i],zipped[j][0],zipped[j][1]);
      this.deck.push(newCard);
    }
  }
}

Deck.prototype.shuffleDeck = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    var temp = array[index];
    array[index] = array[i];
    array[i] = temp;
  }
}

GameSchema.methods.calcValue = function(hand){
  // Come back and add a situation if there are two aces.
  var sum = 0;
  var ace = 0;
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].smybol !== "A") {
      sum += hand[i].val;
    } else {
      ace++;
    }
  }
  if (ace > 0) {
    if (sum < 11) {
      ace = 11;
      sum = ace + sum;
    } else {
      ace = 1;
      sum = ace + sum;
    }
  }
}

GameSchema.methods.dealInitial = function() {
  this.status = 'In Progress';
  this.deckCards = this.shuffleDeck(this.createDeck());
  this.pHand.push(this.deckCards[0]);
  this.dHand.push(this.deckCards[1]);
  this.deckCards.splice(0,2);
  this.pValue = this.calcValue(this.pHand);
  this.dValue = this.calcValue(this.dHand);
};

GameSchema.methods.hit = function(){
  this.pHand.push(this.deckCards[0])
  this.deckCards.slice(0,1);
  this.pValue = this.calcValue(this.pHand);
  if (this.pValue > 21) {
    gameOver();
  }
};

GameSchema.methods.stand = function(){
  this.dHand.push(this.deckCards[0])
  this.deckCards.slice(0,1);
  this.pValue = this.calcValue(this.dHand);
  if (this.dValue < 17) {
    this.stand();
  } else { gameOver() }
};

GameSchema.methods.gameOver = function(){
  this.status = 'Over';
  if ((pValue > 21 && dValue > 21)) {
    pStatus = "Lose";
    dStatus = "Lose";
  } 
  else if (dValue > 21) {
    dStatus = "Lose";
    pStatus = "Win"
  }
  else if (pValue > 21) {
    pStatus = "Lose";
    dStatus = "Win";
  } else if (pValue > dValue) {
    pStatus = "Win";
    dStatus = "Lose"
  } else {
    pStatus = "Lose";
    dStatus = "Win"
  }
}

module.exports = mongoose.model('Game', GameSchema);