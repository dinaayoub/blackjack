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
    console.log(this.cards);
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].rank === 'A') {
        var aceCard = this.cards.splice(i, 1);
        this.cards.push(aceCard);
        i--;
      }
    }
    console.log(this.cards);
    this.cards.forEach(card => {
      console.log(card);
      if (typeof (parseInt(card.rank)) == 'Number') {
        card.value = parseInt(card.rank);
        this.count += card.value;
      }
      if ((card.rank === 'J') || (card.rank === 'Q') || (card.rank === 'K')) {
        card.value = 10;
        this.count += card.value;
      }
      if ((card.rank === 'A') && (this.count < 11)) {
        card.value = 11;
        this.count += card.value;
      }
      if ((card.rank === 'A') && (this.count >= 11)) {
        card.value = 1;
        this.count += card.value;
      }
      return this.count;
    });
  }
}

module.exports = Hand;