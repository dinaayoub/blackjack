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

  async addPlayer(userID) {
    //instead of returning table is full, maybe spin up a new table in a different discord channel? 
    if (this.players.length === this.maxPlayers) throw new Error('This table is full.');

    // this logic might need to be changed 
    // upon changes to new Player instantiation 
    let newPlayer = new Player(userID);
    let playerRecord = await getPlayer(newPlayer);
    newPlayer.name = playerRecord.name;
    newPlayer.bank = playerRecord.bank;
    newPlayer.currentLosses = playerRecord.losses;
    newPlayer.currentWins = playerRecord.wins;
    newPlayer.currentPushes = playerRecord.pushes;
    this.players.push(newPlayer);
  }

  removePlayer(userID) {
    var playerIndex = this.players.findIndex((player, index) => {
      return player.userID === userID;
    });
    if (playerIndex < 0) throw new Error('This player is not in the game');
    var player = this.players[playerIndex];
    // update the player in the database
    updatePlayer(player);
    // then remove them from the queue for next hand
    this.players.splice(playerIndex, 1);
    // potentially remove them from current hand as well? they'd be
    // forfeiting their bet but i think that's ok as it's how other games do it
  }

  start() {
    this.round = [];
    if (this.players.length === 0) throw new Error('No players in the game');
    this.players.forEach(async (player) => {
      // console.log('player in start posistion', player);
      if (player.bank < minBet) {
        // console.log('buyin log');
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
    if (amount < this.minBet || amount > this.maxBet) throw new Error(`Invalid amount. Please bet something between ${this.minBet} and ${this.maxBet}`);

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


  hit() {
    //hit the given user with one more card from the shoe. 
    var card = this.shoe.getOneCard();
    this.round[this.currentPlayerIndex].addCard(card);
  }

  stand() {
    //the user does not want any other cards.
    //this.round[this.currentPlayerIndex].status = 'stand';
    if (this.currentPlayerIndex === this.round.length - 1) {
      this.currentPlayerIndex = 0;
    }
    else {
      this.currentPlayerIndex++;
    }
  }

  buyIn(player) {
    // console.log('low player', player);
    // console.log(`bank too low, reseting bank`);
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
            console.log('IN PUSH');
            //push, player gets their bet back
            hand.player.earnings += hand.bet;
            hand.player.currentPushes += 1;
          } else {
            hand.player.currentLosses += 1;
          }
          //otherwise player loses, do nothing
        }
        console.log('earnings = ', hand.player.earnings);
        // update what the player bank is after earnings
        hand.player.bank += hand.player.earnings;
        console.log('player\'s bank =', hand.player.bank);
        updatePlayer(hand.player);
      }
    });

    this.currentState = 'start';
  }

  playerTurn(verb) {
    //if (this.currentPlayerIndex)
    var isDealerNext = (this.currentPlayerIndex === this.round.length - 2);
    var hand = this.round[this.currentPlayerIndex];
    if (verb === 'stand') {
      this.stand();
      hand.status = 'stand';
    }
    else if (verb === 'hit') {
      this.hit();
      if (hand.count > 21) {
        hand.status = 'bust';
        this.currentPlayerIndex++;
      } else if (hand.count === 21) {
        hand.status = 'blackjack';
        this.currentPlayerIndex++;
      } else {
        hand.status = 'active';
      }
    }
    if (isDealerNext && hand.status != 'active') {
      this.currentState = 'dealer';
    }
  }

  dealerTurn() {
    console.log('dealer hand = ', this.round[this.round.length - 1]);
    var houseCount = this.round[this.round.length - 1].count;
    console.log('house count before while', houseCount);
    while (houseCount < 17) {
      this.hit();
      houseCount = this.round[this.round.length - 1].count;
      this.round[this.round.length - 1].status = 'active';
    }
    console.log('house count after while', houseCount);
    if (houseCount === 21) {
      this.round[this.round.length - 1].status = 'blackjack';
    }
    else if (houseCount < 21) {
      this.round[this.round.length - 1].status = 'stand';
    }
    else if (houseCount > 21) {
      console.log('house count for bust = ', houseCount);
      this.round[this.round.length - 1].status = 'bust';
      console.log(this.round[this.round.length - 1]);
    }
    this.stand();
    //this.currentPlayerIndex = 0;
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
      this.playerTurn(verb);
      break;
    case 'dealer':
      this.dealerTurn();
      break;
    case 'payout':
      this.payout();
      break;
    }
    return ({ currentState: this.currentState, currentPlayerIndex: this.currentPlayerIndex });
  }
}


module.exports = Dealer;