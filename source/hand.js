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
    // console.log(this.cards);
    var handLength = this.cards.length;
    for (let i = 0; i < handLength; i++) {
      if (this.cards[i].rank === 'A') {
        var aceCard = this.cards.splice(i, 1);
<<<<<<< HEAD
=======
        // console.log(aceCard,'ace');
>>>>>>> 52073c8155cd9e51e1261b20766664cd64504e7f
        this.cards.push(aceCard[0]);
        i--;
        handLength--;
      }
    }
<<<<<<< HEAD
    console.log(this.cards);
    for(let i = 0; i < this.cards.length; i++){
      
      if ((this.cards[i].rank === 'J') || (this.cards[i].rank === 'Q') || (this.cards[i].rank === 'K')) {
        this.cards[i].value = 10;
=======
    // console.log(this.cards);
    for (let i = 0; i < this.cards.length; i++) {
      // console.log('Hand of Card',this.cards[i]);
      // console.log('Hand of Card',this.cards[i].rank);


      if ((this.cards[i].rank === 'J') || (this.cards[i].rank === 'Q') || (this.cards[i].rank === 'K')) {
        this.cards[i].value = 10;
        // console.log(`im a log in the faces if, RANK:${this.cards[i].rank}, VALUE:${this.cards[i].value}, COUNT${this.count}`);
>>>>>>> 52073c8155cd9e51e1261b20766664cd64504e7f
        this.count += this.cards[i].value;
      }
      else if ((this.cards[i].rank === 'A') && (this.count < 11)) {
        this.cards[i].value = 11;
<<<<<<< HEAD
=======
        // console.log(`im a log in the ace =11 if, RANK:${this.cards[i].rank}, VALUE:${this.cards[i].value}, COUNT${this.count}`)
>>>>>>> 52073c8155cd9e51e1261b20766664cd64504e7f
        this.count += this.cards[i].value;
      }
      else if ((this.cards[i].rank === 'A') && (this.count >= 11)) {
        this.cards[i].value = 1;
<<<<<<< HEAD
=======
        // console.log(`im a log in the ace = 1 if, RANK:${this.cards[i].rank}, VALUE:${this.cards[i].value}, COUNT${this.count}`);
>>>>>>> 52073c8155cd9e51e1261b20766664cd64504e7f
        this.count += this.cards[i].value;
      }
      else {
        // console.log('RANK in NUm If', this.cards[i].rank);
        this.cards[i].value = parseInt(this.cards[i].rank);
<<<<<<< HEAD
        this.count += this.cards[i].value;
      }
      
      
=======
        // console.log(`im a log in the Num if, RANK:${this.cards[i].rank}, VALUE:${this.cards[i].value}, COUNT${this.count}`);
        this.count += this.cards[i].value;
      }
      // console.log(`outside if, COUNT${this.count}`);

>>>>>>> 52073c8155cd9e51e1261b20766664cd64504e7f

    }
    return this.count;
  }
}

module.exports = Hand;