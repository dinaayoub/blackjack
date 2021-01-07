'use strict';

//test the database operations

const getPlayer = require('../source/middleware/join');
const updatePlayer = require('../source/middleware/update');
const Player = require('../source/player');
const mongoose = require('mongoose');

const userData = new Player('1');
userData.name = 'dina';

describe('User Model Test', () => {

  // It's just so easy to connect to the MongoDB Memory Server 
  // By using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it('Can create & save a new user successfully', async () => {
    var user = await getPlayer(userData);
    // console.log(user);
    expect(user.userid).toEqual(userData.userID);
    // Object Id should be defined when successfully saved to MongoDB.
    expect(user._id).toBeDefined();
    expect(user.userid).toBe(userData.userID);
    expect(user.name).toBe(userData.name);
  });

  it('Can retrieve an existing user successfully', async () => {
    var existingUser = await getPlayer(userData);
    // console.log(existingUser);
    expect(existingUser.userid).toEqual(userData.userID);
  });

  it('Can update a player', async () => {
    userData.name = 'tina';
    userData.bank += 100;
    var updatedPlayer = await updatePlayer(userData);
    expect(updatedPlayer.name).toEqual(userData.name);
    expect(updatedPlayer.bank).toEqual(userData.bank);
    expect(updatedPlayer.wins).toEqual(userData.currentWins);
    expect(updatedPlayer.losses).toEqual(userData.currentLosses);
    expect(updatedPlayer.pushes).toEqual(userData.currentPushes);
  });

});
