var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet: {
    type : Number,
    required:true
  },
  player_hand : {
    type : Array,
    required:true
  },
  dealer_hand : {
    type : Array,
    required : true
  },
  deck : {
    type : Array,
    required : true
  }
  player_value : {
    type : Number,
    default : 0
  },
  dealer_value : {
    type : Number,
    default : 0
  },
  game_status : {
    type : String,
    default : "not started"
  },
  player_status : {
    type : String,
    required : true
  },
  dealer_status : {
    type : String,
    required : true
  }

});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
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
  // this.createDeck();
  // this.shuffleDeck();
  // return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suits_arr = ["hearts","diamonds","spades","clubs"];
  var symbols_arr = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  var vals_arr = [11,2,3,4,5,6,7,8,9,10,10,10,10];
  for (var s = 0; s < 4; s ++) {
    for (var v = 0; v < 13; v ++) {
      this.deck.push(new Card(suits_arr[s],vals_arr[v],symbols_arr[v]));
    }
  }
};


Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  var deck = this.deck;
  for (var i = 51; i > 0; i --) {
    var idx = Math.floor(Math.random() * i);
    var temp = deck[idx];
    deck[idx] = deck[i];
    deck[i] = temp;
  };
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  var aceCount = 0;
  var value = 0;
  for (var i = 0; i < hand.length; i ++) {
    if (hand[i].val !== 11) value += hand[i].val;
    else {
      aceCount ++;
      value += 1;
    };
  };
  for (var i = 0; i <= aceCount; i ++ ) {
    if (value + 10 <= 21) {
      value += 10;
    }
  };
  return value;
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  this.deck = new Deck();
  this.player_hand.push(this.deck.splice(0,1)[0]);
  this.player_hand.push(this.deck.splice(0,1)[0]);
  this.dealer_hand.push(this.deck.splice(0,1)[0]);
  this.dealer_hand.push(this.deck.splice(0,1)[0]);
  this.player_value = this.calcValue(this.player_hand);
  this.dealer_value = this.calcValue(this.dealer_hand);
  this.player_status = "in progress";
  if (this.player_value > 20) this.gameOver();

};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  this.player_hand.push(this.deck.splice(0,1)[0]);
  this.player_value = this.calcValue(this.player_hand);
  if (this.player_value > 20) this.gameOver();

};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  while(this.calcValue(this.dealer_hand) <= 17) {
    this.dealer_hand.push(this.deck.splice(0,1)[0]);
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  this.game_status = 'over';
  if (this.player_value > 21) {
    this.player_status = "lose";
  } else if (this.dealer_value > 21) {
    this.player_status = "win";
  } else if (this.dealer_value === this.player_value) {
    this.player_status = "tie";
  } else if (this.player_value > this.dealer_value) {
    this.player_status = "win";
  } else {
    this.player_status = "lose";
  };
  switch (this.player_status) {
    case 'win':
          this.dealer_status = "lose";
          break;
    case 'lose':
      this.dealer_status = "win";
      break;
    default :
      this.dealer_status = "tie";
  };

}

module.exports = mongoose.model('Game', GameSchema);
