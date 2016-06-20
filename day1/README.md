# Pair programming exercise: Blackjack

## Goal

In this exercise we're going to build a multiplayer game of Blackjack.

## Rules of Blackjack

We will be playing with a simplified set of rules.

### Scoring hands

The value of a hand is the sum of the point values of the individual cards.
Except, a "blackjack" is the highest hand, consisting of an ace and any
10-point card, and it outranks all other 21-point hands.

Aces may be counted as 1 or 11 points, 2 to 9 according to face value, and tens
and face cards count as 10 points.

[Source](http://wizardofodds.com/games/blackjack/basics/)

### Game flow

1. Players decide how much they will bet.
1. Dealer gives each player 2 cards face up.
1. Dealer gives herself 1 card face up, 1 card face down.
1. If the dealer has a blackjack (an Ace and any 10 point card) then players
  who don't also have blackjacks lose their bets. Players who also have
  blackjacks get their bets back.
1. If the dealer doesn't have a blackjack, players decide their moves.
  They can:

  1. **Hit:** Take another card. The player can hit keep hitting until they
  reach 21. If player goes over 21, they lose.
  1. **Stand:** Player choses to not take a card. This ends the player's turn.

1. After all players have taken their turns, the dealer reveals her face-down
  card. The dealer than keeps drawing more cards until she has more than 16
  points.
1. If the dealer ends up with more than 21 points (i.e. busts), all players who
  have not busted win and get back double their bets.
1. Otherwise:

  1. Players who have less points than the dealer lose.
  1. Players who have the same points as the dealer get their bets back.
  1. Players who have more points than the dealer get back double their bets.


## Part 1: Play against the dealer

First build a Blackjack game where a single person can play against the dealer.

### Models

These must be backed by a mongo database. Create a model with the following properties.

- Game: a single Blackjack game. Properties:
  - Player bet (`Number`): number of Horizons Dollars the player has bet.
  - Deck of cards the game is being played with. Must be shuffled.
  - Player hand `Array` of cards in the players hand.
  - Dealer hand `Array` of cards in the dealers hand.
  - Is game over (`Boolean`): true if game is over, false otherwise.

The game must be stored to the database on every request, because a game can be
closed and played later. On every request that needs the game: retrieve it, make
changes and store it back. Use config.js to specify your database.

### Part 1: Backend Section.

To simplify the project, we have divided the project into separate parts. The first
part will be the backend of the project, that will allow you to play from postman.

Once the backend is build, we will move on to part 2, that will be the front-end.


#### Game state representation

When playing with the backend only, we must be able to view our game results. For
this, we need to know the state of the game with every move. For example, if a user
draws a card, we need to know their current cards, score, status of the game to
be able to continue playing. This is a JSON object that is sent to the client.

```
{
  id: game.id,
  player1bet: game.player1bet,
  status: game.status, // Can be over, in-progress or not started!
  userTotal : game.userTotal, // Total of points the user currently has.
  dealerTotal : game.dealerTotal,
  userStatus : game.userStatus, // Won, Lost, Tied the game
  dealerStatus : game.dealerStatus,
  currentPlayerHand : game.currentPlayerHand, // Cards the player has.
  houseHand : game.houseHand
}
```

This is a suggested game state representation. Here you can know the cards of each
player, whether the game has ended, if someone has lost, etc. This model is a
suggestion and can be changed. For example: userTotal and dealerTotal can be calculated
from the cards directly on the front-end.

#### Routes

These are the most important methods on the backend. They will do all the actions
for our game. We'll start by implementing the ones that are necessary to be able
to play with the backend only, making requests from postman.

* All routes that return Game State Representation, return a JSON object.

1. `POST /game`:
  - Creates new game
  - Redirects to `/game/:id`
1. `POST /game/:id/bet`:
  - The player declares their bet for the game with :id.
  - Error if the player has already declared their bet
  - Responds with `Game state representation`
1. `POST /game/:id/hit`:
  - Player draws another card
  - Error if the player has not yet declared their bet
  - Error if the game is not in progress
  - If player busts, game is over, otherwise player can hit again or stand
  - Responds with `Game state representation`
1. `POST /game/:id/stand`: (renders JSON)
  - Error if the player has not yet declared their bet
  - Error if the game is not in progress
  - Player stops drawing cards
  - Dealer draws cards until they have more than 17
  - Determine winner
  - Game is over
  - Responds with `Game state representation`

Now, you could play by doing:
`POST /game` returns new game with id `312314234234`
`POST /game/312314234234/bet` body-> `{bet:123}` this returns ->
```{
  id: 312314234234,
  player1bet:  123,
  status: "Not Started",
  userTotal : 12,
  dealerTotal : 17,
  userStatus : " ",
  dealerStatus : " ",
  currentPlayerHand : ["K Clubs", "2 Spades"]
  houseHand :["A Hearts", "6 Spades"]
}
```
`POST /game/312314234234/hit` gives the player a new card. Returns:
``{
  ...
  dealerTotal : 17,
  currentPlayerHand : ["K Clubs", "2 Spades", "6 Hearts"]
  ...
}
```
`POST /game/:id/stand` Returns the final status of the game and who has won.

### Part 2: Front-end Section.

Time to build the views the routes for the views:

1. `GET /`:
  - Renders the html page for all games -> Renders `List games`
  - Query parameter for filtering games by in-progress/over.
  - Clicking on one of the links takes you to the games.

1. `GET /game/:id`:
  - Renders the single game view -> `View game`
  - This view must contain the box to place the bets.
  - If no bet has been made, button to make bet
  - If game is in progress: button for Hit and Stand buttons.
  - If game is over: show winner/loser/draw

## (Bonus) Part 2: Multiplayer

### Routes

- `GET /`: (exists from part 1)
  - Query parameter for filtering games to current player
- `GET /login`: (new)
  - Render `Login` view
- `POST /login`: (new)
  - If username does not exist in MongoDb, create user
  - Set cookie for login
  - Redirect to `/`
- `POST /logout`: (new)
  - Delete login cookie
  - Redirect to `/`
- `POST /game/:id/bet` `/game/:id/hit` `/game/:id/stand`: (exists from part 1)
  - Error if it's not the current player's turn
  - Update game state representation

#### Changes to game state representation

For the multiplayer game we need a few additional pieces of info on the
game status:

```
{
  "dealerCards": [card1, card2 ...],
  "playerId": id,
  "playerCards": [card1, card2 ...],
  "playerStatus: "turnNow"/"waiting"/"won"/"lost"/"draw"
  "player2Id": playerId
  "player2Cards": [card1, card2 ...],
  "player2Status: "turnNow"/"waiting"/"won"/"lost"/"draw"
}
```

### Views

- List games: (exists in part 1)
  - Option to filter games that a player can join
  - Option to filter games that a player is already in
- View game: (exists in part 1)
  - If game has an empty seat (i.e. both players are not set) button to join game
  - If current player's turn:
- Login
  - A form for logging into the game

### Models

- Player: the person playing the game. Properties:
  - Username (`String`): name to display in the UI for user
  - Money (`Number`): number of Horizons Dollars belonging to player
- Game: additional properties
  - Player 1 id (`ObjectId`): Mongo id of the player in the game
  - Player 2 bet (`Number`): number of Horizons Dollars the 2nd player has bet.
  - Player 2 hand (`Array` of `String`s): cards in the 2nd players hand.
  - Player 2 id (`ObjectId`): Mongo id of the player in the game
