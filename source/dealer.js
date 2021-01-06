'use strict';

const Shoe = require('./shoe');
const Player = require('./player');
const Hand = require('./hand');

// db functions 
const updatePlayer = require('./middleware/update');
const getPlayer = require('./middleware/join');

var numberOfDecks = 6; //this should be changeable
var maxPlayers = 7;
var minBet = 5;
var maxBet = 50;

class Dealer {
  constructor(minBets, maxBets, numOfDecks, numOfMaxPlayers) {
    //if these parameters are passed in to the dealer, respect them. 
    //otherwise use the defaults. 
    this.shoe = new Shoe(numOfDecks || numberOfDecks);
    this.maxPlayers = numOfMaxPlayers || maxPlayers;
    this.minBet = minBets || minBet;
    this.maxBet = maxBets || maxBet;
    this.dealer = new Player('dealer');
    this.currentState = 'start';
    this.currentPlayerIndex = 0;
    this.players = [];
    this.round = [];
  }

  start() {
    this.round = [];
    if (this.players.length === 0) throw new Error('No players in the game');
    this.players.forEach (async (player) => {
      console.log('player in start posistion', player);
      if(player.bank < minBet){
        console.log('buyin log');
        await this.buyIn(player);
      }
      this.round.push(new Hand(player));
    });
    var dealerRound = new Hand('dealer');
    this.round.push(dealerRound);
    this.currentState = 'bets';
    this.currentPlayerIndex = 0;
  }

  bet(amount) {
    //check that the amount is >min and <max
    if (amount < this.minBet || amount > this.maxBet) throw new Error(`Invalid amount. Please bet something between ${this.minBet} and ${this.maxBet}`)

    //find the hand associated with the current player by the index we are keepign track of
    var currentPlayerHand = this.round[this.currentPlayerIndex];

    //check if the player's bank has enough money
    if (currentPlayerHand.player.bank >= amount) {
      //add the bet to the player's hand
      currentPlayerHand.bet = amount;
      //remove the amount from the player's bank
      currentPlayerHand.player.bank -= amount;
      //TODO: need to update database
    }
    else {
      //the player doesn't have enough money. ask them to buy in somehow?
      throw new Error(`Player ${currentPlayerHand.player.name} does not have enough money in the bank to buy in.`);
    }

    //if next player is not the dealer, move on to the next player.
    if (this.currentPlayerIndex < this.round.length - 2) {
      this.currentPlayerIndex++;
    }
    //if the next player is the dealer, reset player index to 0 and change current state to 'deal' as betting is done for all players.
    else if (this.currentPlayerIndex === this.round.length - 2) {
      //next player is the dealer who doesn't bet, so move on to next()
      this.currentPlayerIndex = 0;
      this.currentState = 'deal';
    }
    //return currentPlayersHand;
  }

  deal() {
    //deal a new hand
    //for each player, deal the first card. 
    this.round.forEach(hand => {
      hand.addCard(this.shoe.getOneCard());
    });
    //then deal the second card.
    this.round.forEach(hand => {
      hand.addCard(this.shoe.getOneCard());
    });

    //if the dealer has black jack! Skip straight to payouts. 
    if (this.round[this.round.length - 1].count === 21) {
      this.round[this.round.length - 1].status = 'blackjack';
      this.currentState = 'payouts';
    }
    //otherwise, continue on to player round
    else {
      this.currentState = 'player';
    }
  }

  async addPlayer(userID) {
    //instead of returning table is full, maybe spin up a new table in a different discord channel? 
    if (this.players.length === this.maxPlayers) throw new Error('This table is full.');

    // this logic might need to be changed 
    // upon changes to new Player instantiation 
    let newPlayer = new Player(userID);
    // console.log(newPlayer);
    let playerRecord = await getPlayer(newPlayer);
    // console.log(playerRecord);
    newPlayer.name = playerRecord.name;
    newPlayer.bank = playerRecord.bank;
    newPlayer.currentLosses = playerRecord.losses;
    newPlayer.currentWins = playerRecord.wins;
    newPlayer.currentPushes = playerRecord.pushes;
    // console.log(newPlayer);
    this.players.push(newPlayer);
  }

  removePlayer(userID) {
    var playerIndex = this.players.indexOf({ id: userID });
    if (playerIndex < 0) throw new Error('This player is not in the game');
    this.players.delete(playerIndex);
    //need to update them in the db?
  }

  hit() {
    //hit the given user with one more card from the shoe. 
    this.round[this.currentPlayerIndex].addCard(this.shoe.getOneCard());
  }

  stand() {
    //the user does not want any other cards, and returns simply the hand.
    if (this.currentPlayerIndex === this.round.length - 1) {
      this.currentPlayerIndex = 0;
    }
    else
      this.currentPlayerIndex++;
  }
  buyIn(player){
    console.log('low player', player);
    console.log(`bank too low, reseting bank`);
    player.bank = 500;
  }

  payout() {
    var dealerCount = this.round[this.round.length - 1].count; //get the count of the dealer's hand first. 

    this.round.forEach(hand => {
      if (hand.player !== 'dealer') {
        if (dealerCount > 21) {
          //the dealer busted. pay out all players who did not bust.
          if (hand.count < 21) {
            //payout 1x for people who got 20 or less points
            hand.player.earnings += hand.bet * 2;
            hand.player.currentWins += 1;
          } else if (hand.count === 21) {
            //payout 1.5x for people who got 21
            hand.player.earnings += hand.bet * 2.5;
            hand.player.currentWins += 1;
          } else {
            hand.player.currentLosses += 1;
          }
        } else if (dealerCount === 21) {
          //the dealer has blackjack, "push" any players who also have blackjack, and everyone else loses. 
          if (hand.count === 21) {
            //push (tie) for people who got 21, just give them back their bet
            hand.player.earnings += hand.bet;
            hand.player.currentPushes += 1;
          } else {
            hand.player.currentLosses += 1;
          }
        } else {
          //the dealer has a number < 21
          if (hand.count === 21) {
            //payout 1.5x for people who got 21
            hand.player.earnings += hand.bet * 2.5;
          } else if (hand.count > dealerCount) {
            //player wins 
            hand.player.earnings += hand.bet * 2;
          } else if (hand.count === dealerCount) {
            //push, player gets their bet back
            hand.player.earnings += hand.bet;
            hand.player.currentPushes += 1;
          } else {
            hand.player.currentLosses += 1;
          }
          //otherwise player loses, do nothing
        }
        // update what the player bank is after earnings
        hand.player.bank += hand.player.earnings;
        updatePlayer(hand.player);
      }
    });

    this.currentState = 'start';
  }

  player(verb) {
    // TODO :insert logics that
    // deals with one player at a time. prompting with actions available based on hand
    this.round.forEach(hand => {
      // if hit run hit, if stand run stand, if handcount over 21 bust if handcount === 21 status= blackjack
      if (hand.count > 21) {
        // this.hand.status = 'bust';
        this.round[this.currentPlayerIndex].status = 'bust';
        this.currentPlayerIndex++;
      } else if (hand.count === 21) {
        this.hand.status = 'blackjack';
        this.currentPlayerIndex++;
      } else if (this.player.hit) {
        this.hit();
      } else if (this.player.stand) {
        this.hand.status = 'stand';
        this.stand();
      }
    });

    //once this player busts or stands, update current index 
    if (this.currentPlayerIndex === this.round.length - 1)
      this.currentState = 'dealer';
    else
      this.currentPlayerIndex++;
  }

  dealer() {
    var houseCount = this.round[this.currentPlayerIndex].count;
    while (houseCount < 17) {
      this.hit(this.currentPlayerIndex);
      this.round[this.currentPlayerIndex].status = 'active';
    }
    if (houseCount <= 21) {
      this.stand(this.currentPlayerIndex);
      if (houseCount === 21) this.round[this.currentPlayerIndex].status = 'blackjack';
      else this.round[this.currentPlayerIndex].status = 'stand';
    }
    else if (houseCount > 21) {
      this.round[this.currentPlayerIndex].status = 'bust';
    }
    this.currentState = 'payout';
  }

  next(verb, amountToBet) {
    //this will do whatever is next in the queue of operations based on current state and current player
    console.log('CURRENT STATE = ', this.currentState);
    //sequence of events: https://bicycleca this.currentState = 'start';es a bet. todo: implement the betting. after all bets are complete, updates state to deal
    //deal - will deal each player one card at a time, with dealer being last, until each player has two cards in hand. If the dealer has blackjack, anyone without black jack loses, update the state to payouts. Otherwise, Updates the state to player
    //player action - can hit or stand. If they bust or stand, we end their player action. after all players are done, updates the state to dealer
    //dealer action - hit or stand based on the rules. updates the state to payouts. 
    //payouts end of round. 
    switch (this.currentState) {
    case 'start':
      this.start();
      break;
    case 'bets': //places one bet at a time given the amount the bot/driver sent in
      this.bet(amountToBet);
      break;
    case 'deal': //deals cards to everyone
      this.deal();
      break;
    case 'player':
      this.player(verb);
      break;
    case 'dealer':
      this.dealer();
      break;
    case 'payout':
      this.payout();
      break;
    }
    return ({ currentState: this.currentState, currentPlayerIndex: this.currentPlayerIndex });
    /* TODO: 
      - [ ] how much money does a player start off with?
      - [ ] save that info to the db in the player object
      - [ ] command line or discord bot "driver" that drives the game. 
    */
  }
}


module.exports = Dealer;