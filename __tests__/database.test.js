'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const updatePlayer = require('../source/middleware/update');
const joinPlayer = require('../source/middleware/join');
const Users = require('../source/schema/user.schema');
const { deleteOne } = require('../source/schema/user.schema');
let mockUser = {userID: '1317202', name: 'aysia'};
let url = 'mongodb://localhost:27017/test';

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if(err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  afterEach(async () => {
    await Users.deleteMany();
  });

  it('can create and save a user sucessfully', async () => {
    const validUser = new Users(mockUser);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
  });


});

// https://www.freecodecamp.org/news/end-point-testing/