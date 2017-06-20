var mongoose = require('mongoose');



var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet:Number,
  playerHand:Array,
  dealerHand:Array,
  deck:Array,
  playerValue:Number,
  dealerValue:Number,
  gameStatus:{
    type:String,
    default:"Not Started"
  }
  playerStatus:String,
  dealerStatus:String

});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  var card={
    suit:suit,
    val:val,
    symbol,symbol
  }
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suits=['spades','hearts','diamonds','clubs'];
  var val=[11,2,3,4,5,6,7,8,9,10,10,10,10];
  var symbols=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  for(var i in suits){
    for(var j=0;j<val.length;j++){
      var c=new Card(i,val[j],symbol[j]);
      this.deck.push(c);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  for(var i=this.deck.length-1;i>0;i--){
    var index=Math.floor(Math.random()*i);
    var tmp=this.deck[index];
    this.deck[index]=this.deck[i];
    this.deck[i]=tmp;
  }
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  var acecounter=0;
  var value=0;
  for (var i = 0; i < hand.length; i++) {
    value+=hand[i].val;
    if(hand[i].symbol==='A')acecounter++;
  }
  while(value>21 && acecounter>0){
    value=value-10;
    acecounter--;
  }
  return value;
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  this.playerHand.push(this.deck.unshift());
  this.playerHand.push(this.deck.unshift());
  this.playerValue=this.methods.calcValue(this.playerHand);
  this.dealerHand.push(this.deck.unshift());
  this.dealerHand.push(this.deck.unshift());
  this.dealerValue=this.methods.calcValue(this.dealerHand)
  this.gameStatus="In Progress";

};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  this.playerHand.push(this.deck.unshift());
  this.playerValue=this.methods.calcValue(this.playerHand);
  if(this.playerValue>21)this.methods.gameOver();
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  while(dealerValue<17){
    this.dealerHand.push(this.deck.unshift());
    this.dealerValue=this.methods.calcValue(this.dealerHand);
  }
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  this.gameStatus="Over";
  if(this.playerValue>21){
    this.dealerStatus="Win";
    this.playerStatus="Lose";
  }
  else if(this.dealerValue>21){
    this.dealerStatus="Lose";
    this.playerStatus="Win";
  }
  else{
    if(this.playerValue>this.dealerValue){
      this.dealerStatus="Lose";
      this.playerStatus="Win";
    }
    else{
      this.dealerStatus="Win";
      this.playerStatus="Lose";
    }
  }
}

module.exports = mongoose.model('Game', GameSchema);
