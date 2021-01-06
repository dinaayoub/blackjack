'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const updatePlayer = require('../source/middleware/update');
const joinPlayer = require('../source/middleware/join');
const Users = require('../source/schema/user.schema');
let mockUser = {userID: '1317202', name: 'aysia'};

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if(err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('can create and save a user sucessfully', async () => {
    const validUser = new Users(mockUser);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
  });
});