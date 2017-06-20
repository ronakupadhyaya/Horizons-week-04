var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: Number,
  playerCards: Array,
  dealerCards: Array,
  deckCards: Array,
  playerVal: Number,
  dealerVal: Number,
  gameStatus: String,
  playerStatus: String,
  dealerStatus: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  this.suit = suit
  this.val = val
  this.symbol = symbol
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

// 1. Create Deck
Deck.prototype.createDeck = function() {
  var deck = []
  var suit = ["hearts", "spades", "diamonds", "clubs"]
  var value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11]
  var symbol = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
//LOOP THROUGH SUITS
  for (j=0; j<suit.length; j++) {
//FOR LOOP FOR VALUE SYMBOL
  for (i=0; i<value.length; i++) {
      var card = new Card(suit[j], value[i], symbol[i])
      deck.push(card)
      }
  }
  return deck
}

// 2. Shuffle Deck
Deck.prototype.shuffleDeck = function() {
  //NUMBERS WILL BE ARRAY OF 52 NUMBERS IN RANDOM ORDER
  var numbers = []
  var arrRandom = []
  var deckRandom = []
  var leftToPick = 52
for (i=0; i<52; i++) {
  numbers.push(i) }
  var pick = function() {
    //CHECK IF ALL ARE PICKED
    if(leftToPick === 0) {
      return }
      //IF NOT GRAB A RANDOM INDEX
    var randomIndex = Math.floor(Math.random() * leftToPick)
    //PUT A NUMBER IN WITH THAT INDEX
    arrRandom.push(numbers[randomIndex])
    //TAKE THAT OUT OF THE NUMBERS ARRAY
    numbers.splice(randomIndex,1)
    leftToPick--
    //DO AGAIN
    pick()
  }
  pick()
  var newDeck = Deck.prototype.createDeck()
    for (j=0; j<52; j++) {
      deckRandom.push(newDeck[arrRandom[j]])
    }
    return deckRandom
  }

GameSchema.methods.calcValue = function(hand){
  var totalNonAce = 0
  var totalAce = 0
  hand.forEach(function(card) {
    if (card.val === 11) {
      totalAce += card.val
    }
    else {
      totalNonAce += card.val
    }
  })
  var total = totalNonAce + totalAce
  var reduceAces = function() {
    console.log(totalAce)
    console.log(total)
    console.log(totalNonAce)
    if ((total>21) && (totalAce>0)) {
      totalAce -= 10
      total = totalNonAce + totalAce
      reduceAces()
    }
  }
reduceAces()

return total

}

GameSchema.methods.dealInitial = function() {
  this.playerCards = this.deckCards.splice(0,2)
  this.dealerCards = this.deckCards.splice(0,2)
  this.playerVal = GameSchema.methods.calcValue(this.playerCards)
  this.dealerVal = GameSchema.methods.calcValue(this.dealerCards)
  this.gameStatus = "In Progress"
  this.playerStatus = "In Progress"
  this.dealerStatus = "In Progress"
};

GameSchema.methods.hit = function(){
  this.playerCards.push(this.deckCards.splice(0,1))
  this.playerVal = GameSchema.methods.calcValue(this.playerCards)
  if (this.playerVal>21) {
    gameOver()
  }
};

GameSchema.methods.stand = function(){

var hitDealer = function() {
  if(this.dealerVal>16) {
    this.dealerCards.push(this.deckCards.splice(0,1))
    hitDealer()
    }
  }
  hitDealer()
  gameOver()
}

GameSchema.methods.gameOver = function(){
  this.gameStatus = "Over"

  if(this.dealerVal>this.playerVal) {
    this.playerStatus = "Lost"
    this.dealerStatus = "Won" }

  if(this.playerVal>this.dealerVal) {
    this.playerStatus = "Won"
    this.dealerStatus = "Lost" }

  if(this.playerVal>21) {
    this.playerStatus = "Lost"
    this.dealerStatus = "Won" }

  if(this.dealerVal>21) {
    this.playerStatus = "Won"
    this.dealerStatus = "Lost" }
}

module.exports = mongoose.model('Game', GameSchema);
