'use strict';

const Deck = require('./deck');

class Shoe {
    constructor(numberOfDecks) {
        this.shoe = [];
        this.numberOfDecks = numberOfDecks;
        this.fillShoe();
    }

    fillShoe() {
        for (let i = 0; i < this.numberOfDecks; i++) {
            var deck = new Deck();
            this.shoe = [...this.shoe, ...deck.deck];
        }
        this.shuffle();
    }

    shuffle() {
        //fisher-yates algorithm for shuffling an array
        for (let i = this.shoe.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = this.shoe[i];
            this.shoe[i] = this.shoe[j];
            this.shoe[j] = temp;
        }
    }

    getOneCard() {
       return this.shoe.shift(); 
       //it might be more efficient if we use an actual queue to make this operation O(1) instead of O(n)?

       //need to reshuffle if shoe.length < 0.2 * (number of decks * 52)
       //fillShoe();
    }
}

module.exports = Shoe;