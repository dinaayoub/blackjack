'use strict';

const Card = require('./card');

class Deck {
    constructor() {
        const suits = ['D', 'S', 'H', 'C'];
        const ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
        this.deck = [];
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                var card = new Card(ranks[j], suits[i]);
                this.deck.push(card);
            }
        }
    }
}

module.exports = Deck;