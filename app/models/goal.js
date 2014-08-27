'use strict';

var Mongo = require('mongodb'),
    Task  = require('./task');

function Goal(o){
  this.name = o.name;
  this.dueDate = new Date(o.dueDate);
  this.tags = o.tags.split(',').map(function(tag){return tag.trim();});
  this.tasks = [];
  this.userId = o.userId;
}

Object.defineProperty(Goal, 'collection', {
  get: function(){return global.mongodb.collection('goals');}
});

Goal.create = function(o, cb){
  var g = new Goal(o);
  Goal.collection.save(g, cb);
};

Goal.findAllByUserId = function(id, cb){
  Goal.collection.find({userId:id}).toArray(cb);
};

Goal.findByGoalIdAndUserId = function(goalId, userId, cb){
  goalId = Mongo.ObjectID(goalId);
  Goal.collection.findOne({_id:goalId, userId:userId}, cb);
};

Goal.addTask = function(data, goalId, userId, cb){
  Goal.findByGoalIdAndUserId(goalId, userId, function(err, goal){
    // console.log('*********', goal);
    if(!goal){return cb();}

    var t = new Task(data);
    // console.log('*********', t);
    goal.tasks.push(t);
    Goal.collection.save(goal, function(){
      cb(null, goal);
    });

  });
};

module.exports = Goal;
