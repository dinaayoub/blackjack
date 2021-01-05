'use strict';
const Shoe = require('../source/shoe');

describe('Shoe object', () => {
  it('should create a new shoe object' , () => {
    const shoe = new Shoe(0);
    expect(shoe).toEqual({
      shoe: [],
      usedShoe: [],
      numberOfDecks: 0,
    });
  });
  it('should fill the shoe with cards', () => {
    const shoe = new Shoe(1);
    expect(shoe.shoe.length).toEqual(52);
  });
  it('should get one card', () => {
    const shoe = new Shoe(1);
    shoe.getOneCard();
    expect(shoe.usedShoe.length).toEqual(1);
    expect(shoe.shoe.length).toEqual(51);
  });
  it('should refill the shoe when shuffled', () => {
    const shoe = new Shoe(1);
    shoe.getOneCard();
    shoe.getOneCard();
    shoe.getOneCard();
    expect(shoe.usedShoe.length).toEqual(3);
    shoe.refillShoe();
    expect(shoe.usedShoe.length).toEqual(0);
  });
});