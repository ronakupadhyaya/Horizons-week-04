var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet:{
    type: Number,
    required: true
  },
  player_hand:{
    type: Array,
    required: true
  },
  dealer_hand:{
    type: Array,
    required: true
  },
  player_value: {
    type: Number,
    default: 0
  },
  dealer_value: {
    type: Number,
    default: 0
  },
  player_status: {
    type: String,
    default: "Not Started"
  },
  dealer_status: {
    type: String,
    default: "Not Started"
  },
  deck: {
    type: Array,
    required: true
  },
  game_status: {
    type: String,
    required: true
  }
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item);
  game.deck = new Deck();
  game.save(callback);
};

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  this.suit=suit,
  this.val=val,
  this.symbol=symbol
};

function Deck(){
  this.deck = [];
  this.createDeck();
  this.shuffleDeck();
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suits=["hearts", "diamonds", "spades", "clubs"];
  var symbols=["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  for(var i=0; i<suits.length; i++){
    for(var j=0; j<symbols.length; j++){
      if(symbols[j]==="J" || symbols[j]==="Q" || symbols[j]==="K"){
        val=10;
      }
      else if(symbols[j]==="A"){
        val=11;
      };
      else{
        val=symbols[j];
      };
      this.deck.push(new Card(suits[i], val, symbols[j]));
    };
  };

};

Deck.prototype.shuffleDeck = function() {
  var newdeck=[]
  // YOUR CODE HERE'
  //choose random number between number of indexes left
  for(var i=51; i>=0; i--){
    var loc=Math.floor(Math.random()*i)
    //push randomly chose index into new holding deck
    newdeck.push(this.deck[loc]);
    //remove the card of this 
    this.deck.splice(i,1);
  };
  this.deck=newdeck;
  return this.deck;
};

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  var aceCount=0;
  var value=0;
  for(i=0; i<hand.length; i++){
    if(hand[i]==="11"){
      aceCount++;
    };
    value+=hand[i];
  };
for(var i=0; i<aceCount; i++){
  if(value>21){
    value-=10;
  };
};
return value;
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  //generate shuffled deck
  this.deck= new Deck();
  //push hand
  this.player_hand.push(this.deck.splice(0,1)[0]);
  this.player_hand.push(this.deck.splice(0,1)[0]);
  this.dealer_hand.push(this.deck.splice(0,1)[0]);
  this.dealer_hand.push(this.deck.splice(0,1)[0]);
  //fnd deck values
  this.player_value=this.calcValue(this.player_hand);
  this.dealer_value=this.calcValue(this.dealer_value);
  //see if player has 21, automatic win. dealer only means at least one more chance
  if(this.player_value===21){
    this.gameOver();
  };
  else{
    this.dealer_status="In Progress";
    this.player_status="In Progress";
    this.game_status="Over";
  };
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  this.player_hand.push(this.deck.splice(0,1)[0]);
  this.player_value=this.calcValue(this.player_hand);
  if(this.player_value>=21){
    this.gameOver();
  };
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  while(this.dealer_value<17){
    this.dealer_hand.push(this.deck.splice(0,1)[0]);
    this.dealer_value=this.calcValue(this.dealer_hand);
    if(this.dealer_value>=21){
      this.gameOver;
    };
  };
};

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  this.game_status="Over";
  if(this.player_value>21){
    this.player_status="Lose";
    this.dealer_status="Win";
  };
  else if(this.dealer_value>21){
    this.dealer_value="Lose";
    this.player_value="Win";
  };
  else if(this.player_value>=this.dealer_value){
    this.dealer_status="Lose";
    this.player_status="Win";
    };
  else if(this.player_value===this.dealer_value){
    this.dealer_status="Tie";
    this.player_status="Tie";
  };
  else{
    this.dealer_value="Win";
    this.player_value="Lose";
  };
};

module.exports = mongoose.model('Game', GameSchema);