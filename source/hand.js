'use strict';

class Hand{
    constructor(){
        this.cards = [];
    }

    addCard(card){
        this.cards.push(card);
    }
}

module.exports = Hand;