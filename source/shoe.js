'use strict';

const Deck = require('./deck');

class Shoe {
    constructor(numberOfDecks) {
        this.shoe = [];
        this.usedShoe = [];
        this.numberOfDecks = numberOfDecks;
        this.fillShoe();
    }

    fillShoe() {
        //we are creating a brand new shoe, get all the decks and shuffle them
        for (let i = 0; i < this.numberOfDecks; i++) {
            var deck = new Deck();
            this.shoe = [...this.shoe, ...deck.deck];
        }
        this.shuffle(this.shoe);

    }

    //shuffle the array provided in place
    shuffle(shoe) {
        //fisher-yates algorithm for shuffling an array
        for (let i = shoe.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = shoe[i];
            shoe[i] = shoe[j];
            shoe[j] = temp;
        }
    }

    getOneCard() {
        //need to reshuffle if shoe has less than 20% of cards left
        //async function so it doesn't stop us from getting the new card?
        if (this.shoe.length <= 0.2 * this.numberOfDecks * 52) {
            this.refillShoe();
        }

        var card = this.shoe.shift();
        this.usedShoe.push(card);
        return card;
        //it might be more efficient if we use an actual queue to make this operation O(1) instead of O(n)?
    }

    async refillShoe() {
        //we are reshuffling, so just reshuffle the usedShoe and add it to the current shoe. 
        this.shuffle(this.usedShoe);
        //this way we aren't reshuffling the remaining 20% of cards, we are just adding the used cards to them after reshuffling those. 
        //using the spread notation to concatenate arrays
        this.shoe = [...this.shoe, ...this.usedShoe];
        //resetting used shoe as it should now be empty
        this.usedShoe = [];
    }
}

module.exports = Shoe;