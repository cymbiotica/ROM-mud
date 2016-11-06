'use strict';

const expect = require('chai').expect;
const sinon  = require('sinon');

const CommandInjector = require('./command-mock-utils').CommandInjector;
const getGlobals      = require('./command-mock-utils').getGlobals;
const addItem         = require('./command-mock-utils').addItem;
const addNpc          = require('./command-mock-utils').addNpc;
const getCallCounter  = require('./command-mock-utils').getCallCounter;

const Time   = require('../../src/time').Time;
const Player = require('../../src/player').Player;
const Npc    = require('../../src/npcs').Npc;
const Room   = require('../../src/rooms').Room;
const Type   = require('../../src/type').Type;
const Item   = require('../../src/items').Item;
Type.config(Player, Npc, Item, {});

const socket = {
  write: sinon.stub()
}

const player = new Player(socket);

const lookCmd = require('../../commands/look').command;
const globals = getGlobals();
const look = CommandInjector(lookCmd, globals);

const [ rooms, items, players, npcs, Commands ] = globals;
players.addPlayer(player);

sinon.spy(player, 'say');
sinon.stub(Time, 'isDay');

const getPlayerSayCall = getCallCounter(player.say);

const location = 4;
const description = 'room desc';
const short_description = 'room shortdesc';
const area = 'The Dungeon';
const title = 'Treasure Chamber';
const room = new Room({ area, title, location, short_description, description });

rooms.addRoom(room);
player.setLocation(location);
player.setPreference('roomdescs', 'default');

const shield = addItem({
  items, room, location,
  short_description: 'a shield',
  keywords: ['shield'],
  uuid: 'shield'
});

const goblin = addNpc({
  room, location, npcs,
  short_description: 'a goblin',
  keywords: ['goblin'],
  uuid: 'gobbo'
});

describe('Looking at a room', () => {
  it('should describe the room with a long description, the first time around', () => {
    Time.isDay.returns(true);

    look('', player);

    // check for all player.say calls...
    const titleCall = getPlayerSayCall();
    const expectedTitle = area + ': ' + title;
    expect(titleCall.args[0] === expectedTitle).to.be.true;
  });
});

describe('Looking at an npc in a room', () => {

});

describe('Looking at an item in a room', () => {

});

describe('Looking at another player', () => {

});

describe('Looking at oneself', () => {

});

describe('Looking at adjacent rooms', () => {

});
