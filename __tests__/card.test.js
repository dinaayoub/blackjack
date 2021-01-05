'use strict';

const Card = require('../source/card');

describe('Card Object', () => {

  it('Can create a new card object', () => {
    var card = new Card('10', 'S'); //creating a new card that is the 10 of spades.
    expect(card).toEqual({
      rank: '10',
      suit: 'S',
      value: 0,
    })
  });
});