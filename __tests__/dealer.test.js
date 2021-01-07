'use strict';
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};
const Dealer = require('../source/dealer');
//const updatePlayer = require('../source/middleware/update');
const Card = require('../source/card');

describe('Dealer Object', () => {
  var dealer = new Dealer();
  dealer.shoe.shoe = [
    new Card('A', 'S'),
    new Card('A', 'S'),
    new Card('J', 'S'),
    new Card('3', 'S'),
    new Card('3', 'S'),
    new Card('3', 'S'),
    new Card('6', 'S'),
    new Card('2', 'S'),
    new Card('10', 'S'),
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

  it('Can create a new dealer object', () => {
    expect(dealer.currentState).toEqual('start');
    expect(dealer.round.length).toEqual(0);
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can correctly throw an error if we try to start a game without any players', () => {
    expect(() => {
      dealer.start();
    }).toThrow();
  });

  it('Can add a player to the game for next round', async () => {
    await dealer.addPlayer('1');
    await dealer.addPlayer('2');
    expect(dealer.players.length).toBe(2);
    expect(dealer.round.length).toBe(0);
  });

  it('Can start a game using the start function', async () => {
    dealer.start();
    expect(dealer.round.length).toEqual(3);
    expect(dealer.currentState).toEqual('bets');
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can place bets for all non-dealers players', async () => {
    dealer.bet(25);
    dealer.bet(50);
    expect(dealer.round[0].bet).toStrictEqual(25);
    expect(dealer.round[1].bet).toStrictEqual(50);
    expect(dealer.round[2].bet).toStrictEqual(0); //dealer's bet should always be 0
    expect(dealer.currentState).toStrictEqual('deal');
  });

  it('Can remove a player from the game for next round', async () => {
    console.log('player 1 bank = ', dealer.players[0].bank);
    dealer.players[0].bank = 300;
    await dealer.removePlayer('1');
    expect(dealer.players.length).toBe(1);
    await dealer.addPlayer('1');
    //when you remove the player and re-add them their new index becomes 1 instead of 0
    expect(dealer.players[1].bank).toBe(300);
    console.log('player 1 bank = ', dealer.players[0].bank);
    //need to validate that the player is updated correctly in the db?
  });

  it('Can deal a hand to each player', async () => {
    await dealer.deal();
    expect(dealer.round[0].cards.length).toEqual(2);
    expect(dealer.round[1].cards.length).toEqual(2);
    expect(dealer.round[2].cards.length).toEqual(2);
  });

  it('Can playerturn hit - add a card to the current Player\'s hand', () => {
    dealer.playerTurn('hit');
    expect(dealer.round[0].cards.length).toEqual(3);
  });

  it('Can playerturn stand - stop adding cards to the player\'s hand on hit', () => {
    dealer.currentPlayerIndex = 1;
    dealer.playerTurn('stand');
    expect(dealer.round[1].cards.length).toEqual(2);
    expect(dealer.round[1].count).toEqual(14);
    expect(dealer.round[1].status).toEqual('stand');
  });

  it('Can have dealer hit when their hand total is < 17', async () => {
    dealer.dealerTurn();
    // console.log(dealer.round[2].cards);
    expect(dealer.round[2].cards.length).toBe(4);

  });

  it('Can have dealer bust when their hand total > 21', () => {
    expect(dealer.round[2].status).toBe('bust');
  });

  it('Can have dealer stand when their hand total is >= 17 & <21', async () => {
    dealer.currentPlayerIndex += 2;
    // console.log(dealer.currentPlayerIndex);
    dealer.round[2].cards.splice(1, 2);
    dealer.round[2].totalHandCount();
    dealer.dealerTurn();
    expect(dealer.round[2].cards.length).toBe(2);
    expect(dealer.round[2].status).toEqual('stand');
  });

  it('Can payout players correctly when dealer stands >=17 & <21', () => {
    //dealer total is 20
    //player 1 will have 20 (A + 3 + 6)
    //player 2 will have 14 (A + 3)
    console.log('player 1 bank = ', dealer.players[1].bank);
    console.log('player 2 bank = ', dealer.players[0].bank);
    dealer.payout();
    expect(dealer.round[0].player.bank).toEqual(325);
    expect(dealer.round[1].player.bank).toEqual(450);
  });
});