'use strict';

class Hand{
  constructor(player){
    this.cards = [];
    this.player = player;
    this.bet = 0;
    this.status = 'active';//can be active, blackjack, bust, or stand
    this.count;
  }

  addCard(card){
    this.cards.push(card);
  }

  
  totalHandCount(){
    for(let i = 0; i < this.cards.length; i++)
      if (this.cards[i].rank === 'A'){
        this.cards[i].delete();
        this.cards[i].push();
        i--;
      }
    this.cards.forEach(card =>{
      if (card.rank === Number) {
        card.value = card.rank;
        this.count += card.value;
      }
      if ((card.rank ==='J')||(card.rank ==='Q')||(card.rank ==='K')){
        card.value = 10;
        this.count += card.value;

      }
      if ((card.rank === 'A') && (this.count < 11)){
        card.value = 11;
        this.count += card.value;
      }
      if ((card.rank === 'A') && (this.count >= 11)){
        card.value = 1;
        this.count += card.value;
      }
      return  this.count;
    });
  }
}

module.exports = Hand;