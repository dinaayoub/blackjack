'use strict';

const Hand = require("./hand");

class Round{
    constructor(player){
        this.player = player;
        this.hand = new Hand();
        this.bet = 0;
        this.status = ''; //can be active, blackjack, bust, or stand
    }
}

module.exports = Round;