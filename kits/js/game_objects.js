/**
 * All game objects for access by user
 */
const {
  Position
} = require("./map");
const GAME_CONSTANTS = require("./game_constants");

/**
 * holds all data related to a player
 */
class Player {
  constructor(teamid) {
    this.team = teamid;
    this.researchPoints = 0;
    // map unit id to the unit
    this.units = [];
    this.cities = new Map();
  }
}

// all data related to a city
class City {
  constructor(teamid, cityid, fuel) {
    this.cityid = cityid;
    this.team = teamid;
    this.fuel = fuel;
    this.citytiles = [];
  }
  addCityTile(x, y, cooldown) {
    const ct = new CityTile(this.team, this.cityid, x, y, cooldown)
    this.citytiles.push(ct);
    return ct;
  }
}

/** CityTile and Unit are both actionable and can return action strings to send to engine  */
class CityTile {
  constructor(teamid, cityid, x, y, cooldown) {
    this.cityid = cityid;
    this.team = teamid;
    this.pos = new Position(x, y);
    this.cooldown = cooldown;
  }
  /** Whether or not this unit can research or build */
  canAct() {
    return this.cooldown === 0;
  }
  /** returns command to ask this tile to research this turn */
  research() {
    return `r ${this.pos.x} ${this.pos.y}`;
  }
  /** returns command to ask this tile to build a worker this turn */
  buildWorker() {
    return `bw ${this.pos.x} ${this.pos.y}`;
  }
  /** returns command to ask this tile to build a cart this turn */
  buildCart() {
    return `bc ${this.pos.x} ${this.pos.y}`;
  }
}

class Unit {
  constructor(teamid, type, unitid, x, y, cooldown, wood, coal, uranium) {
    this.pos = new Position(x, y);
    this.team = teamid;
    this.id = unitid;
    this.type = type;
    this.cooldown = cooldown;
    this.cargo = {
      wood,
      coal,
      uranium
    }
  }
  isWorker() {
    return this.type === GAME_CONSTANTS.UNIT_TYPES.WORKER;
  }

  isCart() {
    return this.type === GAME_CONSTANTS.UNIT_TYPES.CART;
  }

  /** whether or not the unit can move or not */
  canMove() {
    return this.cooldown === 0;
  }

  /** return the command to move unit in the given direction */
  move(dir) {
    return `m ${this.id} ${dir}`;
  }

  /** return the command to transfer a resource from a source unit to a destination unit as specified by their ids or the units themselves */
  transfer(srcUnit, destUnit, resourceType, amount) {
    let srcID = srcUnit;
    let destID = destUnit;
    if (typeof srcID !== "string") {
      srcID = srcID.id;
    }
    if (typeof destID !== "string") {
      destID = destID.id;
    }
    return `t ${srcID} ${destID} ${resourceType} ${amount}`;
  }

  /** return the command to build a city right under the worker */
  buildCity() {
    return `bcity ${this.pos.x} ${this.pos.y}`;
  }
}

module.exports = {
  Player,
  City,
  Unit,
  CityTile,
}