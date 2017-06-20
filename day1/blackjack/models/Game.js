var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerBet:{
    type: Number
  },
  playerHand: {
    type:Array
  },
  dealerHand:{
    type:Array
  },
  deck: {
    type: Array
  },
  playerHandValue: {
    type: Number,
    default: 0
  },
  dealerHandValue: {
    type: Number,
    default: 0
  },
  gameStatus:{
    type:String,
    default: "Not Started"
  },
  playerStatus: {
    type:String
  },
  dealerStatus: {
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
  this.value = val;
  this.symbol = symbol;
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var symbols = ["A", "K", "Q", "J"];
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  var self = this;
  suits.forEach(function(suit){

    for (var i = 2; i < 12; i++) {
      if (i ===11){
        symbols.forEach(function(sym){
          if (sym === "A"){
            self.deck.push(new Card(suit, 11, sym))
          }else{
            self.deck.push(new Card(suit, 10, sym))
          }
        })
      }else{
        self.deck.push(new Card(suit, i, i.toString()))
      }
    }
  })
}


Deck.prototype.shuffleDeck = function() {
  for (var i = this.deck.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    var tmp = this.deck[index];
    this.deck[index] = this.deck[i];
    this.deck[i] = tmp;
  }
}

GameSchema.methods.calcValue = function(hand){
  var sum = 0;
  hand.forEach(function(card){
    sum = sum + card.value
  })
  if (this.isBlackjack(hand)){
    sum = 21;
  }
  return sum;
}

GameSchema.methods.isBlackjack = function(hand){
  if (hand.length ===2){
    if ((hand[0].symbol ==="A" && hand[1].symbol ==="K") || (hand[0].symbol ==="K" && hand[1].symbol ==="A")){
      return true;
    }
  }else{
    return false;
  }
}

GameSchema.methods.dealInitial = function() {
  this.gameStatus = "In Progress"
  this.playerHand.push(this.deck.pop());
  this.playerHand.push(this.deck.pop());
  this.dealerHand.push(this.deck.pop());
  this.dealerHand.push(this.deck.pop());
  this.playerStatus = "Waiting";
  this.dealerStatus = "Waiting";
  this.playerHandValue = this.calcValue(this.playerHand);
  this.dealerHandValue = this.calcValue(this.dealerHand);
};

GameSchema.methods.hit = function(){
  this.playerHand.push(this.deck.pop());
  this.playerHandValue = this.calcValue(this.playerHand);
  if (this.playerHandValue > 21){
    this.gameOver();
  }
};

GameSchema.methods.stand = function(){
  var dealer = true;
  while (dealer){
    if (this.dealerHandValue > 16){
      dealer = false;
      this.gameOver();
    }else{
      this.dealerHand.push(this.deck.pop());
      this.dealerHandValue = this.calcValue(this.dealerHand);
    }
  }
}

GameSchema.methods.gameOver = function(){
  if (this.dealerHandValue < 22 && this.playerHandValue<22){
    if (this.dealerHandValue > this.playerHandValue){
      console.log('1');
      this.dealerStatus = "Win";
      this.playerStatus = "Lose";
    }else if (this.playerHandValue===21 && this.dealerHandValue < 21){
      console.log('2');
      this.dealerStatus = "Lose";
      this.playerStatus = "Win";
    }else if (this.dealerHandValue===21 && this.playerHandValue < 21){
      console.log('3');
        this.dealerStatus = "Lose";
        this.playerStatus = "Win";
    }else{
      console.log('4');
      this.dealerStatus = "Lose";
      this.playerStatus = "Win";
    }
  }
  if (this.playerHandValue > 21 || this.dealerHandValue > 21){
    if (this.playerHandValue > 21){
      console.log('5');
      this.dealerStatus = "Win";
      this.playerStatus = "Lose";
    }else if (this.dealerHandValue > 21){
      console.log('6');
      this.dealerStatus = "Lose";
      this.playerStatus = "Win";
    }
  }
  if (this.dealerHandValue === this.playerHandValue){
    if (this.isBlackjack(this.dealerHand) || this.isBlackjack(this.playerHand)){
      if (this.isBlackjack(this.dealerHand) && this.isBlackjack(this.playerHand)){
        console.log('7');
          this.dealerStatus = "Draw";
          this.playerStatus = "Draw";
      }else if (this.isBlackjack(this.dealerHand)){
        console.log('8');
        this.dealerStatus = "Win";
        this.playerStatus = "Lose";
      }else if (this.isBlackjack(this.playerHand)){
        console.log('9');
        this.dealerStatus = "Lose";
        this.playerStatus = "Win";
      }
    }else{
      console.log('10');
      this.dealerStatus = "Draw";
      this.playerStatus = "Draw";
    }
  }
  this.gameStatus = "Over";
}

module.exports = mongoose.model('Game', GameSchema);
