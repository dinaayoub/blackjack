'use strict';

class Player {
  constructor(userID) {
    this.id = userID;
    this.name = '';
    this.bank = 500;
    this.earnings = 0;
    //this.currentEarnings = 0;
    //get the user info from the db?
  }
}
module.exports = Player;