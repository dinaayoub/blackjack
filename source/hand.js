'use strict';

class Hand {
  constructor(player) {
    this.cards = [];
    this.player = player;
    this.bet = 0;
    this.status = 'active';//can be active, blackjack, bust, or stand
    this.count;
  }

  addCard(card) {
    this.cards.push(card);
    this.totalHandCount();
  }

  totalHandCount() {
    this.count = 0;
    var handLength = this.cards.length;
    for (let i = 0; i < handLength; i++) {
      if (this.cards[i].rank === 'A') {
        var aceCard = this.cards.splice(i, 1);
        this.cards.push(aceCard[0]);
        i--;
        handLength--;
      }
    }
    for (let i = 0; i < this.cards.length; i++) {
      if ((this.cards[i].rank === 'J') || (this.cards[i].rank === 'Q') || (this.cards[i].rank === 'K')) {
        this.cards[i].value = 10;
        this.count += this.cards[i].value;
      }
      else if ((this.cards[i].rank === 'A') && (this.count < 11)) {
        this.cards[i].value = 11;
        this.count += this.cards[i].value;
      }
      else if ((this.cards[i].rank === 'A') && (this.count >= 11)) {
        this.cards[i].value = 1;
        this.count += this.cards[i].value;
      }
      else {
        this.cards[i].value = parseInt(this.cards[i].rank);
        this.count += this.cards[i].value;
      }
    }
    return this.count;
  }
}

module.exports = Hand;