var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {type: Number },
  playerHand: {type: Array },
  dealerHand: {type: Array },
  deckCards: {type: Array },
  playerVal: {default: 0,type: Number},
  dealerVal: {default:0,type: Number},
  status: {default:"Not Started", type:String, enum: ['Not Started','Over','In Progress']},
  playerStat: {type: String},
  dealerStat: {type: String}
});

var Game = mongoose.model('game', GameSchema)

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

var suit = ["hearts","diamonds","spades","clubs"]
var rank = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
var value = [2,3,4,5,6,7,8,9,10,10,10,10,11]

Deck.prototype.createDeck = function() {
  for(var i=0;i<rank.length;i++) {
    for(var j=0;j<suit.length;j++) {
      this.deck.push(new Card(suit[j],value[i],rank[i]))
    }
  }
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Deck.prototype.shuffleDeck = function() {
  var newDeck = this.deck.slice();
  for(var i=0;i<this.deck.length;i++) {
    var num = randomInt(0,newDeck.length-1);
    this.deck[i] = newDeck[num];
    newDeck.splice(num,1);
  }
}

GameSchema.methods.calcValue = function(hand){
  var pointValue = 0;
  var newHand = hand.sort(function(a,b){
    return a.value - b.value
  })
  for(var i=0;i<newHand.length;i++){
    if(newHand[i].symbol === 'A') {
      if(pointValue > 10) {
        pointValue += 1
      } else {
        pointValue += newHand[i].val;
      }
    }
    pointValue += newHand[i].val;
  }
}


GameSchema.methods.dealInitial = function() {
  this.dealerHand.push(this.deck.shift());
  this.playerHand.push(this.deck.shift());
  this.dealerHand.push(this.deck.shift());
  this.playerHand.push(this.deck.shift());
  this.status = "In Progress";
  this.playerVal = calcValue(this.playerHand);
  this.dealerVal = calcValue(this.dealerHand);
  if(this.dealerVal === 21 || this.playerVal === 21) {
    this.gameOver();
  }
};

GameSchema.methods.hit = function(){
  this.playerHand.push(this.deck.shift());
  this.playerVal = calcValue(this.playerHand);
  if(this.playerVal === 21 || this.playerVal > 21) {
    this.gameOver();
};

GameSchema.methods.stand = function(){
  this.dealerVal = calcValue(this.dealerHand);
  for(var i=0;this.dealerVal < 17;i++){
    this.dealerHand.push(this.deck.shift());
    this.dealerVal = calcValue(this.dealerHand);
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  this.gameStatus = "Over";
  this.playerTotalValue = calcValue(this.playerHand);
  this.dealerTotalValue = calcValue(this.dealerHand);
  if(this.playerTotalValue > 21) {
    this.playerStatus = "Loss";
    this.dealerStatus = "Win";
  } else if (this.dealerTotalStatus > 21){
    this.dealerStatus = "Loss";
    this.playerStatus = "Win";
  } else if(this.playerTotalValue === 21 && this.dealerTotalValue !== 21) {
    this.playerStatus = "Win";
    this.dealerStatus = "Loss";
  } else if (this.playerTotalValue !== 21 && this.dealerTotalValue === 21){
    this.playerStatus = "Loss";
    this.dealerStatus = "Win";
  } else if (this.playerTotalValue === 21 && this.dealerTotalValue === 21){
    this.playerStatus = "Tied";
    this.dealerStatus = "Tied";
  } else if (this.playerTotalValue < this.dealerTotalValue) {
    this.playerStatus = "Loss";
    this.dealerStatus = "Win";
  } else if (this.playerTotalValue > this.dealerTotalValue){
    this.playerStatus = "Win";
    this.dealerStatus = "Loss";
  } else {
    this.gameStatus = "Over--Tie";
    this.playerStatus = "Tied";
    this.dealerStatus = "Tied";
  }
}

module.exports = mongoose.model('Game', GameSchema);
