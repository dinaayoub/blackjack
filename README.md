# Black Jack Discord Bot

## Deployment

[Heroku Deployment](https://latte-blackjack.herokuapp.com/)

## Team Members

* Aysia Brown
* Tina Myers
* Dina Ayoub
* Matt Ravenmoore

## Project Management

### Task Management

* [Trello Board](https://trello.com/b/bgJWAadZ/blackjack)

### Domain Modeling

### Entity Relationship Diagram

![Users](assets/erd.png)

### UML Diagram

![UML](assets/blackjack-uml.png)

### Data Flow Diagram

![Data Flow](assets/DataFlow401Midterm.png)

## MVP

* REST API

## Tests

### Usage

* to run tests, use the command 'npm test'

### List of tests

#### Dealer tests

* [x] Can create a new dealer object
* [x] Can correctly throw an error if we try to start a game without any players
* [x] Can ask low bank players to buyin before start of hand
* [x] Can add a player to the game for next round
* [x] Can start a game using the start function
* [x] Can place bets for all non-dealers players
* [x] Can remove a player from the game for next round
* [x] Can deal a hand to each player
* [x] Can playerturn hit - add a card to the current Player\'s hand
* [x] Can playerturn stand - stop adding cards to the player\'s hand on stand
* [x] Can have dealer hit when their hand total is < 17
* [x] Can have dealer bust when their hand total > 21
* [x] Can have dealer stand when their hand total is >= 17 & <21
* [x] Can payout players correctly when dealer stands >=17 & <21

#### Next() function tests --> the function used in our API

* [x] Can start a game using the next function
* [x] Can place bets for all non-dealers players
* [x] Can deal a hand to each player
* [x] Can playerturn hit - add a card to the current Player\'s hand
* [x] Can playerturn stand after each player\'s turn - stop adding cards to the player\'s hand on stand
* [x] Can have dealer hit when their hand total is < 17
* [x] Can have dealer stand when their hand total is >= 17 & <21
* [x] Can payout players correctly when dealer stands >=17 & <21

#### Card tests

* [x] Can create a new card object

#### Deck tests

* [x] Can instantiate a new deck of cards

#### Hand tests

* [x] Can create a new hand object
* [x] Can add a card to a hand
* [x] Can add multiple cards to a hand
* [x] Can get the count of a hand with a face (K/Q/J)
* [x] Can get the count of a blackjack hand with a face (K/Q/J) and an ace
* [x] Can get the count of a hand with a face (K/Q/J) and ace and number
* [x] Can get the count of a hand with two aces
* [x] Can get the count of a hand with two aces and a card

#### Player

* [x] Can create a new player object

#### Shoe

* [x] Can create a new shoe object
* [x] Can fill the shoe with cards
* [x] Can get one card from the shoe
* [x] Can refill the shoe when shuffled
* [x] Can re-shuffle when <20% of the deck remains

#### Users

* [x] Can create & save a new user
* [x] Can retrieve an existing user
* [x] Can update a player
