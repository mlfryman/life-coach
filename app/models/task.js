'use strict';

var Mongo = require('mongodb');

function Task(o, goalId){
  this._id = Mongo.ObjectID();
  this.goalId = o.goalId;
  this.name = o.name;
  this.difficulty  = o.difficulty;
  this.description = o.description;
  this.rank = o.rank * 1;
  this._isComplete = false;
}

module.exports = Task;
