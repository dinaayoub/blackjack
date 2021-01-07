'use strict';
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};
const Dealer = require('../source/dealer');
const Card = require('../source/card');

describe('Dealer Object', () => {
  var dealer = new Dealer();
  dealer.shoe.shoe = [
    new Card('A', 'S'),
    new Card('A', 'S'),
    new Card('J', 'S'),
    new Card(3, 'S'),
    new Card(3, 'S'),
    new Card(3, 'S'),
    new Card(6, 'S'),
    new Card(2, 'S'),
    new Card(10, 'S'),
  ]

  async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  }

  beforeAll(async (done) => {
    // mockUpdate = jest.fn().mockImplementation(updatePlayer);
    await mongoose.connect(global.__MONGO_URI__, options, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
    done();
  });

  afterAll(async (done) => {
    await removeAllCollections();
    mongoose.connection.close();
    // mockUpdate.mockRestore();
    done();
  });


  it('Can start a game using the next function', async () => {
    await dealer.addPlayer('1');
    await dealer.addPlayer('2');
    dealer.next();
    expect(dealer.round.length).toEqual(3);
    expect(dealer.currentState).toEqual('bets');
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can place bets for all non-dealers players', async () => {
    dealer.next('bet', 25);
    dealer.next('bet', 50);
    expect(dealer.round[0].bet).toStrictEqual(25);
    expect(dealer.round[1].bet).toStrictEqual(50);
    expect(dealer.round[2].bet).toStrictEqual(0); //dealer's bet should always be 0
    expect(dealer.currentState).toStrictEqual('deal');
  });

  it('Can deal a hand to each player', async () => {
    await dealer.next();
    expect(dealer.round[0].cards.length).toEqual(2);
    expect(dealer.round[1].cards.length).toEqual(2);
    expect(dealer.round[2].cards.length).toEqual(2);
  });

  it('Can playerturn hit - add a card to the current Player\'s hand', () => {
    dealer.next('hit');
    dealer.next('stand');
    expect(dealer.round[0].cards.length).toEqual(3);
    console.log('PLAYER 1 HAND', dealer.round[0].cards);
  });

  it('Can playerturn stand - stop adding cards to the player\'s hand on hit', () => {
    dealer.next('stand');
    expect(dealer.round[1].cards.length).toEqual(2);
    expect(dealer.round[1].count).toEqual(14);
    expect(dealer.round[1].status).toEqual('stand');
    // console.log('PLAYER 2 HAND', dealer.round[1].cards);
    // console.log('current state after player 2 is done (should be dealer) is = ', dealer.currentState);
  });

  it('Can have dealer hit when their hand total is < 17', async () => {
    await dealer.next();
    // console.log('DEALER HAND', dealer.round[2].cards);
    expect(dealer.round[2].cards.length).toBe(4);
  });

  // it('Can have dealer stand when their hand total is >= 17 & <21', async () => {
  //   dealer.currentPlayerIndex += 2;
  //   // console.log(dealer.currentPlayerIndex);
  //   dealer.round[2].cards.splice(1, 2);
  //   dealer.round[2].totalHandCount();
  //   dealer.next();
  //   expect(dealer.round[2].cards.length).toBe(2);
  //   expect(dealer.round[2].status).toEqual('stand');
  // });

  // it('Can payout players correctly when dealer stands >=17 & <21', () => {
  //   //dealer total is 20
  //   //player 1 will have 20 (A + 3 + 6)
  //   //player 2 will have 14 (A + 3)
  //   console.log('player 1 bank = ', dealer.players[1].bank);
  //   console.log('player 2 bank = ', dealer.players[0].bank);
  //   dealer.next();
  //   expect(dealer.round[0].player.bank).toEqual(325);
  //   expect(dealer.round[1].player.bank).toEqual(450);
  // });
});