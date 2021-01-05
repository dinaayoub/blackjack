'use strict';

const Shoe = require('./shoe');
const Player = require('./player');
const Hand = require('./hand');
const e = require('express');
var numberOfDecks = 1; //this should be changeable
var maxPlayers = 7;

class Dealer {
  constructor() {
    this.shoe = new Shoe(numberOfDecks);
    this.maxPlayers = maxPlayers;
    this.dealer = new Player('dealer');
    this.currentState = 'start';
    this.currentPlayerIndex = 0;
    this.players = [];
    this.round = [];
  }

  deal() {
    //deal a new hand
    //for each player, deal the first card. 
    this.round.forEach(hand => {
      hand.addCard(this.shoe.getOneCard());

      // console.log('PLAYER ', hand.player);
      // console.log('\tHAND : ', hand.cards);
    });
    //then deal the second card.
    this.round.forEach(hand => {
      hand.addCard(this.shoe.getOneCard());



      console.log('PLAYER ', hand.player);
      console.log('HAND : ', hand.cards);
    });
  }

  addPlayer(userID) {
    // logic for wait for new hand??
    //instead of returning table is full, maybe spin up a new table in a different discord channel? 
    if (this.players.length === this.maxPlayers) throw new Error('This table is full.');
    this.players.push(new Player(userID));
  }

  removePlayer(userID) {
    var playerIndex = this.players.indexOf({ id: userID });
    if (playerIndex < 0) throw new Error('This player is not in the game');
    this.players.delete(playerIndex);
  }

  hit(userID) {
    //hit the given user with one more card from the shoe. 
    this.round.forEach(hand => {
      if (hand.player.id == userID) {
        hand.addCard(this.shoe.getOneCard());
      }
    });
  }


  stand(userID) {

  }


  next() {
  bet(amount) {
    //find the hand associated with the current player by the index we are keepign track of
    var currentPlayerHand = this.round[this.currentPlayerIndex];

    if (currentPlayerHand) {
      //check if the player's bank has enough money
      if (currentPlayerHand.player.bank >= amount) {
        //add the bet to the player's hand
        currentPlayerHand.bet = amount;
        //remove the amount from the player's bank
        currentPlayerHand.player.bank -= amount;
      }
      else {
        //the player doesn't have enough money. ask them to buy in somehow?
        return new Error(`Player ${userID} does not have enough money in the bank to buy in.`);
      }
    } else {
      //we couldn't find that player ID, what do we do? throw an error, or just ignore this and return null/error?
      return new Error('Invalid player');
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

  next(amountToBet) {
    //this will do whatever is next in the queue of operations based on current state
    console.log('CURRENT STATE = ', this.currentState);
    //sequence of events: https://bicyclecards.com/how-to-play/blackjack/
    //start of a round - copying the list of current players into this.round, adding the dealer to the round, updating the state to bets
    //bets - each player except dealer places a bet. todo: implement the betting. after all bets are complete, updates state to deal
    //deal - will deal each player one card at a time, with dealer being last, until each player has two cards in hand. If the dealer has blackjack, anyone without black jack loses, update the state to payouts. Otherwise, Updates the state to player
    //player action - can hit or stand. If they bust or stand, we end their player action. after all players are done, updates the state to dealer
    //dealer action - hit or stand based on the rules. updates the state to payouts. 
    //payouts end of round. 
    switch (this.currentState) {
    case 'start':
      this.round = [];
      if (this.players.length === 0) throw new Error('No players in the game');
      this.players.forEach(player => {
        this.round.push(new Hand(player));
      });
      var dealerRound = new Hand('dealer'); //{ player: this.dealer, hand: new Hand(this.shoe.getOneCard()) };
      this.round.push(dealerRound);
      //console.log('ROUND HANDS ==============',this.round);
      this.currentState = 'bets';
      this.currentPlayer = 0;
      break;
    case 'bets':
      //places one bet at a time. dealer does not bet.
      // loop over players and prompt for bets each players input updates hand.bet value and decriments player.bank
      //the dealer doesn't bet and is the last person in the round, so current players are from 0 to length - 2. 
      if (this.currentPlayer < this.round.length - 2) {
        this.currentPlayer++;
      }
      else {
        this.currentState = 'deal';
        this.currentPlayer = 0;
      }
      break;
    case 'deal':
      //deals cards to everyone
      this.deal();
      this.currentState = 'player';
      // if dealer hand === 21 Dealer.status == blackjack
      break;
    case 'player':
      // TODO :insert logics that
      // deals with one player at a time. prompting with actions available based on hand
      // if hit run hit, if stand run stand, if handcount over 21 bust if handcount === 21 status= blackjack
      //console.log(this.currentPlayer);
      //once this player busts or stands 
      if (this.currentPlayer === this.round.length - 1)
        this.currentState = 'dealer';
      else
        this.currentPlayer++;

      //do blah
      break;

    case 'dealer':
      var houseCount = this.round[this.round.length - 1].count;
      
      if (houseCount > 17){
        this.hit(dealer.userID);
      }
      else if ((houseCount >= 17)&& (houseCount <= 21)){
        this.stand(dealer.userID);
      }
      else if (houseCount > 21){
        dealer.hand.status = 'bust';
      }
      this.currentState = 'payout';
      break;

    case 'payout':
      var dealerCount = this.round[this.round.length - 1].count; //get the count of the dealer's hand first. 
      if (dealerCount > 21) {
        //the dealer busted. pay out all players who did not bust. 
        this.round.forEach(hand => {
          if (hand.player !== 'dealer') {
            if (hand.count < 21) {
              //payout 1x for people who got 20 or less points
              hand.player.bank += hand.bet * 2;
            } else if (hand.count === 21) {
              //payout 1.5x for people who got 21
              hand.player.bank += hand.bet * 2.5;
            }
          }
        });
      } else if (dealerCount === 21) {
        //the dealer has blackjack, "push" any players who also have blackjack, and everyone else loses. 
        this.round.forEach(hand => {
          if (hand.player !== 'dealer') {
            if (hand.count === 21) {
              //push (tie) for people who got 21, just give them back their bet
              hand.player.bank += hand.bet;
            }
            //everyone else loses their bet so do nothing
          }
        });
      } else {
        //dealer has a number. we have to compare each player to it separately. 
        this.round.forEach(hand => {
          if (hand.player !== 'dealer') {
            if (hand.count === 21) {
              //payout 1.5x for people who got 21
              hand.player.bank += hand.bet * 2.5;
            } else if (hand.count > dealerCount) {
              //player wins 
              hand.player.bank += hand.bet * 2;
            } else if (hand.count === dealerCount) {
              //push, player gets their bet back
              hand.player.bank += hand.bet;
            }
            //otherwise player loses, do nothing
          }
        });
      case 'start':
        this.round = [];
        if (this.players.length === 0) throw new Error('No players in the game');
        this.players.forEach(player => {
          this.round.push(new Hand(player));
        });
        var dealerRound = new Hand('dealer'); //{ player: this.dealer, hand: new Hand(this.shoe.getOneCard()) };
        this.round.push(dealerRound);
        //console.log('ROUND HANDS ==============',this.round);
        this.currentState = 'bets';
        this.currentPlayerIndex = 0;
        break;
      case 'bets':
        //places one bet at a time given the amount the bot/driver sent in?
        // TODO: determine whether we want the driver to call bet directly or just always call next
        // if the driver will always call next, then we don't need to pass in user ID to all of 
        // the functions such as hit, stand... etc as we will keep track of them using currentPlayerIndex
        // alternatively, we can just have next be something that the bot calls to find out what to 
        // do next, for example, prompt users to bet and listen for bets from users

        //for now, i'm assuming the driver will just call next with the amount of the bet, but we would
        // also need to add a "verb" for the driver to send (for example: next("hit"), or next("bet", 25)
        this.bet(amountToBet);
        break;
      case 'deal':
        //deals cards to everyone
        this.deal();

        //the dealer has black jack! Skip straight to payouts. 
        if (this.round[this.round.length - 1].count === 21) {
          this.round[this.round.length - 1].status = 'blackjack';
          this.currentState = 'payouts'
        }
        //otherwise, continue on to player round
        else {
          this.currentState = 'player';
        }
        break;
      case 'player':
        // TODO :insert logics that
        // deals with one player at a time. prompting with actions available based on hand
        // if hit run hit, if stand run stand, if handcount over 21 bust if handcount === 21 status= blackjack
        //console.log(this.currentPlayerIndex);
        //once this player busts or stands 
        if (this.currentPlayerIndex === this.round.length - 1)
          this.currentState = 'dealer';
        else
          this.currentPlayerIndex++;

        //do blah
        break;
      case 'dealer':
        //do
        // if dealer hand count >= 17 perform hit action
        // if dealer hand = 17 && > 21 stand
        // if dealer hand > 21 status.bust
        this.currentState = 'payout';
        break;
      case 'payout':
        var dealerCount = this.round[this.round.length - 1].count; //get the count of the dealer's hand first. 

        this.round.forEach(hand => {
          if (hand.player !== 'dealer') {
            if (dealerCount > 21) {
              //the dealer busted. pay out all players who did not bust.
              if (hand.count < 21) {
                //payout 1x for people who got 20 or less points
                hand.player.bank += hand.bet * 2;
              } else if (hand.count === 21) {
                //payout 1.5x for people who got 21
                hand.player.bank += hand.bet * 2.5;
              }
            } else if (dealerCount === 21) {
              //the dealer has blackjack, "push" any players who also have blackjack, and everyone else loses. 
              if (hand.count === 21) {
                //push (tie) for people who got 21, just give them back their bet
                hand.player.bank += hand.bet;
              }
            } else {
              //the dealer has a number < 21
              if (hand.count === 21) {
                //payout 1.5x for people who got 21
                hand.player.bank += hand.bet * 2.5;
              } else if (hand.count > dealerCount) {
                //player wins 
                hand.player.bank += hand.bet * 2;
              } else if (hand.count === dealerCount) {
                //push, player gets their bet back
                hand.player.bank += hand.bet;
              }
              //otherwise player loses, do nothing
            }
          }
        });
        //TODO: Save all users to db. 

        // [x] if dealer.status = bust pay out all !bust status players
        // [x] if player.status = blackjack || hand.value 21 payout playerbet + 1.5 * player.bet to player.bank
        // [x] if dealer status = !bust && < player.hand.value payout player.bet+player.bet to player.bank and reset bet to 0
        // [x] if dealer status = !bust && > player.hand.value no payout reset bet to 0
        // [x] if dealer status = !bust && === player.hand.value no payout retain bet on table "this is called a push in BJ" 
        //     the easier way to do this is to just give them back their bet money so that is what i did instead
        // [x] iterate over player hand counts vs dealer hand count

      }
      //TODO: Save all users to db. 

      // [x] if dealer.status = bust pay out all !bust status players
      // [x] if player.status = blackjack || hand.value 21 payout playerbet + 1.5 * player.bet to player.bank
      // [x] if dealer status = !bust && < player.hand.value payout player.bet+player.bet to player.bank and reset bet to 0
      // [x] if dealer status = !bust && > player.hand.value no payout reset bet to 0
      // [x] if dealer status = !bust && === player.hand.value no payout retain bet on table "this is called a push in BJ" 
      //     the easier way to do this is to just give them back their bet money so that is what i did instead
      // [x] iterate over player hand counts vs dealer hand count

      this.currentState = 'start';
      break;
    }
    /* TODO: 
      - [x] figure out how to reset the shoe when there is <20% left of cards (and when current round is done)
      - [ ] implement stand
      - [x] implement bet
      - [ ] implement hit
      - [ ] how much money does a player start off with?
      - [ ] save that info to the db in the player object
      - [ ] command line or discord bot "driver" that drives the game. 
      - [ ] return the current state to the driver from next()
      - [x] dealer logic for hitting or standing. 
      - [x] create a mongo schema for users
      - [x] add the API routes
      */
  }
}

module.exports = Dealer;