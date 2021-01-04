'use strict';

class Hand{
  constructor(player){
    this.cards = [];
    this.player = player;
    this.bet = 0;
    this.status = 'active';//can be active, blackjack, bust, or stand
  }

  addCard(card){
    this.cards.push(card);
  }
}

module.exports = Hand;