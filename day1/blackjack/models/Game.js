var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number,
    required:true
  },
  playerHand:{
    type:Array,
    required:true
  },
  dealerHand:{
    type:Array,
    required:true
  },
  deck:{
    type:Array,
    required:true
  },
  playerScore:{
    type:Number,
    default:0
  },
  dealerScore:{
    type:Number,
    default:0
  },
  gameStatus:{
    type:String,
    enum:[
      "Not Started",
      "Over",
      "In Progress"
    ],
    default:"Not Started"
  },
  playerStatus:{
    type:String
  },
  dealerStatus:{
    type:String
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
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  var symbols = ["J","Q","K","A"];
  suits.forEach(function(suit){
    for(var num = 2; num < 11; num++){
      this.deck.push(new Card(suit,num,num));
    };
    symbols.forEach(function(sym){
      if(sym==="A"){
        this.deck.push(new Card(suit,11,sym));
      }else{
        this.deck.push(new Card(suit,10,sym));
      }
    })

  })
}

Deck.prototype.shuffleDeck = function() {
  var shuffleDeck = [];
  for(var i = 51; i >=0 ;i--){
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }
    var card = this.deck.splice(getRandomIntInclusive(0,i),1);
    shuffleDeck.push(card);
    this.deck = shuffleDeck.slice();
  }
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
