'use strict';

class Hand{
    constructor(player){
        this.cards = [];
        this.player = player;
        this.bet = 0;
        this.status = 'active';//can be active, blackjack, bust, or stand
    }

    addCard(card){
        //should check here if the number of cards left in the shoe needs shuffling?
        console.log(card);
        this.cards.push(card);
    }
}

module.exports = Hand;