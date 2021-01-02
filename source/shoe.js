'use strict';

const Deck = require('./deck');

class Shoe {
    constructor(numberOfDecks) {
        this.shoe = [];
        this.numberOfDecks = numberOfDecks;
        for (let i = 0; i < numberOfDecks; i++) {
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
    }
}

module.exports = Shoe;