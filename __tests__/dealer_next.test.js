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
    new Card('Q', 'H'),
    new Card('Q', 'H'),
    new Card('Q', 'H'),
    new Card(4, 'S'),
    new Card(4, 'S'),
    new Card(4, 'S'),
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
    await dealer.addPlayer('10');
    await dealer.addPlayer('20');
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
    expect(dealer.round[0].cards.length).toEqual(3);
    expect(dealer.round[0].count).toEqual(20);
  });

  it('Can playerturn stand after each player\'s turn - stop adding cards to the player\'s hand on stand', () => {
    //player 1 will want to stand as their total is 20
    dealer.next('stand');
    expect(dealer.round[0].status).toEqual('stand');
    expect(dealer.round[0].cards.length).toEqual(3);
    expect(dealer.currentPlayerIndex).toEqual(1);

    //player 2 now chooses to stand, their total will remain 14
    dealer.next('stand');
    expect(dealer.round[1].status).toEqual('stand');
    expect(dealer.round[1].cards.length).toEqual(2);
    expect(dealer.round[1].count).toEqual(14);
    expect(dealer.currentPlayerIndex).toEqual(2);
  });

  it('Can have dealer hit when their hand total is < 17', async () => {
    await dealer.next();
    expect(dealer.round[2].cards.length).toBe(4);
  });

  it('Can have dealer stand when their hand total is >= 17 & <21', async () => {
    //artificially resetting to dealer turn
    dealer.currentState = 'dealer';
    dealer.currentPlayerIndex += 2;

    dealer.round[2].cards.splice(1, 2);
    dealer.round[2].totalHandCount();
    dealer.next();
    expect(dealer.round[2].cards.length).toBe(2);
    expect(dealer.round[2].status).toEqual('stand');
    expect(dealer.round[2].count).toBe(20);
    expect(dealer.currentState).toEqual('payout');
  });

  it('Can payout players correctly when dealer stands >=17 & <21', () => {
    //dealer total is now 20 instead of bust
    dealer.next();
    //player 1 will have 20 (Q + 4 + 6) which is a push
    expect(dealer.round[0].player.bank).toEqual(500);
    //player 2 will have 14 (Q + 4) so they have lost
    expect(dealer.round[1].player.bank).toEqual(450);
  });
});