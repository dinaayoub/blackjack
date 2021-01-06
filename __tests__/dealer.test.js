'use strict';
const { MongoClient } = require('mongodb');
const Dealer = require('../source/dealer');
// const supergoose = require('@code-fellows/supergoose');
// const { server } = require('../source/server/server');
// const mockRequest = supergoose(server);

describe('Dealer Object', () => {
  var dealer = new Dealer();
  let connection;
  let db;
  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
    console.log(db);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });
  it('Can create a new dealer object', () => {
    expect(dealer.currentState).toEqual('start');
    expect(dealer.round.length).toEqual(0);
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can correctly throw an error if we try to start a game without any players', () => {
    expect(() => {
      dealer.start()
    }).toThrow();
  });


  it('Can start a game using the start function', async () => {

    // const users = db.collection('users');

    // const mockUser = { _id: 'some-user-id', name: 'John' };
    // await users.insertOne(mockUser);

    // const insertedUser = await users.findOne({ _id: 'some-user-id' });
    // expect(insertedUser).toEqual(mockUser);


    dealer.addPlayer('1');
    dealer.addPlayer('2');
    dealer.start();
    expect(dealer.round.length).toEqual(3);
    expect(dealer.currentState).toEqual('bets');
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can place bets for all non-dealers players', async () => {
    // const users = db.collection('users');

    // const mockUser = { _id: 'some-user-id', name: 'John' };
    // await users.insertOne(mockUser);

    // const insertedUser = await users.findOne({ _id: 'some-user-id' });
    // expect(insertedUser).toEqual(mockUser);

    dealer.bet(25);
    dealer.bet(50);
    expect(dealer.round[0].bet).toStrictEqual(25);
    expect(dealer.round[1].bet).toStrictEqual(50);
    expect(dealer.round[2].bet).toStrictEqual(0); //dealer's bet should always be 0
    expect(dealer.currentState).toStrictEqual('deal');
  });

});