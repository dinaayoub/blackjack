'use strict';

const Card = require('../source/card');
const Deck = require('../source/deck');

describe('Deck Class', () => {
  it('Can instantiate a new deck of cards', () => {
    let deck = new Deck();
    expect(deck.deck.length).toBe(52); // checks all cards are there 
    expect(deck.deck[0]).toEqual(new Card('A','D')); // checks if the first card is correct
    expect(deck.deck[51]).toEqual(new Card('K', 'C')); // checks if the last card is correct
  });
});