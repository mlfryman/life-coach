/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Goal    = require('../../app/models/goal'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'life-coach-test';

describe('Goal', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.create', function(){
    it('should create a goal', function(done){
      var reqBody = {name:'write a book', dueDate:'2014-08-27', tags:'work, capitalism', userId: Mongo.ObjectID('000000000000000000000001')};
      console.log('----------REQ.BODY----------');
      console.log(reqBody);
      console.log('----------userId----------');
      console.log(userId);
      Goal.create(reqBody, function(err, goal){
        expect(goal).to.be.instanceof(Goal);
        expect(goal._id).to.be.instanceof(Mongo.ObjectID);
        expect(goal.userId).to.be.instanceof(Mongo.ObjectID);
        expect(goal.name).to.equal('write a book');
        expect(goal.dueDate).to.be.instanceof(Date);
        expect(goal.tags).to.have.length(2);
        done();
      });
    });
  });

  describe('.findAllByUserId', function(){
    it('should find all goals by one userId', function(done){
      var userId = Mongo.ObjectID('000000000000000000000001');
      Goal.findAllByUserId(userId, function(err, goals){
        expect(goals).to.have.length(2);
        done();
      });
    });
  });

  describe('.findByGoalIdAndUserId', function(){
    it('should return goal (user IDs match)', function(done){
      var userId = Mongo.ObjectID('000000000000000000000001'),
          goalId = 'a00000000000000000000002';
      Goal.findByGoalIdAndUserId(goalId, userId, function(err, goal){
        expect(goal).to.be.ok;
        done();
      });
    });
  });

  describe('.addTask', function(){
    it('should add a task to user\'s goal', function(done){
      var goalId = 'a00000000000000000000002',
          body = {name:'Adopt 1 kitteh', description:'Go to Happy Tales and adopt the first kitteh you see!', difficulty:2, rank:1},
          userId = Mongo.ObjectID('000000000000000000000001');
      Goal.addTask(body, goalId, userId, function(err, goal){
        expect(goal.tasks).to.have.length(1);
        expect(goal.tasks[0].rank).to.equal(1);
        done();
      });
    });
    it('should not add a task to non-logged in user\'s goal', function(done){
      var goalId = 'a00000000000000000000003',
          body = {name:'Find test subjects', description:'Put a recruitment advertisement in the local paper.', difficulty:1, rank:3},
          userId = Mongo.ObjectID('000000000000000000000001');
      Goal.addTask(body, goalId, userId, function(err, goal){
        expect(goal).to.be.undefined;
        done();
      });
    });
  });

// Last bracket
});
