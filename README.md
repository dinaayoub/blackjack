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

## How to use

### ENV file

> PORT
> MONGODB_URI
> BOT_TOKEN

### Postman

> take Heroku deployment link 'https://latte-blackjack.herokuapp.com' and add the following:
> "/game" to start the game. Take the dealer ID provided, and use in the following commands
> add a player (or multiple players if preferred): 'https://latte-blackjack.herokuapp.com/join/{dealerid}/{userid}'
> begin the actual game 'https://latte-blackjack.herokuapp.com/next/{dealerid}'
> each player sets a bet in a query string (repeat for all players): 'https://latte-blackjack.herokuapp.com/next/{dealerid}/bets?amount={amount between 5 and 50}'
> deal the cards: 'https://latte-blackjack.herokuapp.com/next/{dealerid}'
> allow the player to hit or stand (until the player chooses stand or the player busts/gets 21): 'https://latte-blackjack.herokuapp.com/next/{dealerid}/{hit or stand}'
> when all players have reached stand/bust/blackjack, move to dealer turn: 'https://latte-blackjack.herokuapp.com/next/{dealerid}'
> dealer turn will automatically hit if total is under 17, or stand if 17 or over. Dealer could also bust. 'https://latte-blackjack.herokuapp.com/next/{dealerid}'
> players will get paid out for their winnings (if the player won or pushed). Banks will be updated, win/loss/push totals will be updated: 'https://latte-blackjack.herokuapp.com/next/{dealerid}'
> if a player wishes to leave the game, they must type this before the next round begins: 'https://latte-blackjack.herokuapp.com/leave/{dealerid}/{playerid}
> next round will start with: 'https://latte-blackjack.herokuapp.com/next/{dealerid}'

## Tests

### Usage

* to run tests, use the command 'npm test'

### List of tests

* [] Insert test description here

## Resourcs

> Discord bot (in progress): https://discord.com/channels/604026801106452505/795699587125477406
> Medium: https://medium.com/javascript-in-plain-english/how-i-setup-unit-test-for-mongodb-using-jest-mongoose-103b772ee164
> Albert Gao: https://www.albertgao.xyz/2017/06/19/test-your-model-via-jest-and-mongoose/
> https://stackoverflow.com/questions/837951/is-there-an-elegant-way-to-deal-with-the-ace-in-blackjack

### Discord Bot resources

> https://www.youtube.com/watch?v=BmKXBVdEV0g
> https://discord.js.org/#/docs/main/stable/general/welcome
> https://www.writebots.com/discord-bot-token/
> https://www.youtube.com/watch?v=BmKXBVdEV0g
> https://stackoverflow.com/questions/837951/is-there-an-elegant-way-to-deal-with-the-ace-in-blackjack
> https://www.writebots.com/discord-bot-token/
> https://www.youtube.com/watch?v=BmKXBVdEV0g
