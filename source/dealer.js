'use strict'

const Shoe = require('./shoe');
const Player = require('./player');
const Hand = require("./hand");
var numberOfDecks = 6; //this should be changeable
var maxPlayers = 7;

class Dealer {
    constructor() {
        this.shoe = new Shoe(numberOfDecks);
        console.log(this.shoe);
        this.maxPlayers = maxPlayers
        this.dealer = new Player('dealer');
        this.currentState = 'start';
        this.players = [];
        this.round = [];
    }

    deal() {
        //deal a new hand
        //for each player, deal the first card. 
        this.round.forEach(hand => {
            hand.addCard(this.shoe.getOneCard());
            
            console.log('PLAYER ', hand.player);
            console.log('\tHAND : ', hand.cards);
        });
        //then deal the second card.
        this.round.forEach(hand => {
            hand.addCard(this.shoe.getOneCard());

            console.log('PLAYER ', hand.player);
            console.log('\tHAND : ', hand.cards);
        })
    }

    addPlayer(userID) {
        //instead of returning table is full, maybe spin up a new table in a different discord channel? 
        if (this.players.length === this.maxPlayers) throw new Error('This table is full.');
        this.players.push(new Player(userID));
    }

    removePlayer(userID) {
        playerIndex = this.players.indexOf({ id: userID });
        if (playerIndex < 0) throw new Error('This player is not in the game');
        this.players.delete(playerIndex);
    }

    hit(userID) {
        //hit the given user with one more card from the shoe. 
        this.shoe.getOneCard();
    }

    stand(userID) {

    }

    next() {
        //this will do whatever is next in the queue of operations based on current state
        console.log('CURRENT STATE = ', this.currentState)
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
                    this.round.push(new Hand(player))
                });
                var dealerRound = new Hand('dealer'); //{ player: this.dealer, hand: new Hand(this.shoe.getOneCard()) };
                this.round.push(dealerRound);
                console.log('ROUND HANDS ==============',this.round);
                this.currentState = 'bets';
                this.currentPlayer = 0;
                break;
            case 'bets':
                //places one bet at a time. dealer does not bet. 
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
                break;
            case 'player':
                //deals with one player at a time. 
                console.log(this.currentPlayer);
                //once this player busts or stands 
                if (this.currentPlayer === this.round.length - 1)
                    this.currentState = 'dealer'
                else
                    this.currentPlayer++;

                //do blah
                break;
            case 'dealer':
                //do blah
                this.currentState = 'payout';
                break;
            case 'payout':
                //do blah
                this.currentState = 'start'
                break;
        }
        /* TODO: 
        - figure out how to reset the shoe when there is <20% left of cards (and when current round is done)
        - implement stand, bet, hit
        - how much money does a player start off with?
        - save that info to the db in the player object
        - command line or discord bot "driver" that drives the game. 
        - return the current state to the driver from next()
        - dealer logic for hitting or standing. 
        - create a mongo schema for users
        - add the API routes
        */
    }
}

var dealer = new Dealer();
dealer.addPlayer('dina');
dealer.addPlayer('owais');
console.log("PLAYERS: ", dealer.players);
for (let i = 0; i < 10; i++) {
    dealer.next();
}

module.exports = Dealer;