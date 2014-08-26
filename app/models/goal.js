'use strict';

var Mongo = require('mongodb'),
    Task  = require('./task'),
    _     = require('lodash');

function Goal(o, userId){
  this._id = Mongo.ObjectID();
  this.userId = o.userId;
  this.name = o.name;
  this.dueDate  = new Date(o.dueDate);
  this.tags = o.tags.split(',');
  this.tags = _.compact(this.tags);
  this.tasks = [];
}

Object.defineProperty(Goal, 'collection', {
  get: function(){return global.mongodb.collection('goals');}
});

Goal.create = function(o, userId, cb){
  var goal = new Goal(o, userId);
  Goal.collection.save(goal, cb);
};

Goal.findAllByUserId = function(userId, cb){
  Goal.collection.find({userId:userId}).toArray(cb);
};

Goal.findByGoalIdAndUserId = function(goalId, userId, cb){
  var _id = Mongo.ObjectID(goalId);
  Goal.collection.findOne({_id:_id, userId:userId}, cb);
};

Goal.addTask = function(data, goalId, userId, cb){
  Goal.findByGoalIdAndUserId(goalId, userId, function(err, goal){
    console.log('---------GOAL---------');
    console.log(goal);
    if(!goal){return cb();}

    var task = new Task(data);
    console.log('---------TASK---------');
    console.log(task);
    goal.tasks.push(task);
    Goal.collection.save(goal, function(){
      cb(null, goal);
    });

  });
};

module.exports = Goal;
