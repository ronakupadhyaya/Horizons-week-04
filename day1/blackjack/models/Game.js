var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  deck: {
    type: Array
  },
  status: {
    type: String,
    default: "Not Started"
  },
  playerBet: {
    type: Number,
    default: 0
  },
  userTotal: {
    type: Number,
    default: 0
  },
  dealerTotal: {
    type: Number,
    default: 0
  },
  userStatus: {
    type: String,
    default: "pending"
  },
  dealerStatus: {
    type: String,
    default: "pending"
  },
  currentPlayerHand: {
    type: Array
  },
  daelerHand: {
    type: Array
  // YOUR CODE HERE
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
  // YOUR CODE HERE
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var suits = ["hearts", "spades", "clubs", "diamonds"];
  var faces = {"2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11};
  for (var i=0; i<suits.length; i++){
    for (var key in faces){
      this.deck.push(new Card(suits[i], faces[key], key));
    }
  }
  // YOUR CODE HERE
}

Deck.prototype.shuffleDeck = function() {

  var restOfDeck = (this.deck.length);
  for (var i = restOfDeck; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this.deck[i];
        this.deck[i] = this.deck[j];
        this.deck[j] = temp;
    }
    return this.deck;
  // var random = Math.floor(Math.random() * restOfDeck);
  // for (var i=0; i<restOfDeck; i++){
  //     var removeCard = this.deck.indexOf(random);
  //     array.splice(removeCard, 1);
  // }
  // YOUR CODE HERE
}

GameSchema.methods.calcValue = function(hand){
  if (hand.length === 2){
    if(hand[0] !== "A" && hand[1] !== "A"){
      return hand[0].val + hand[1].val;
    }
    else if(hand[0] === "A" && hand[1] === "A"){
      return 2;
    }
    else return (hand[0].val + hand[1].val);
  }
  var sum = 0;
  for (var i=0; i<hand.length; i++){
    sum += hand[i].val;
  }
  return sum;
  // var temp = [];
  // if (sum > 10){
  //   for (var i=0; i<hand.length; i++){
  //     if(hand[i] === "A"){
  //       hand[i].val === 1;
  //       temp.push(hand[i]);
  //     }
  //     else if (hand[i] !== "A"){
  //       sum
  //     }
  //   }
  // }
  // YOUR CODE HERE
}

GameSchema.methods.dealInitial = function() {
  this.status = "In Progress";
  this.dealerTotal = this.calcValue(this.houseHand);
  this.userTotal = this.calcValue(this.currentPlayerHand);
  this.currentPlayerHand.push(this.deck.pop());
  this.currentPlayerHand.push(this.deck.pop());
  this.houseHand.push(this.deck.pop());
  this.houseHand.push(this.deck.pop());
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
