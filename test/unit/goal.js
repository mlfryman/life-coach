/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Goal      = require('../../app/models/goal'),
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
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Goal object', function(done){
      var reqBody = {name:'write a book', dueDate:'2014-08-27', tags:'work, capitalism', userId: Mongo.ObjectID('000000000000000000000001')};
      Goal.create(reqBody, function(err, g){
        expect(g).to.be.instanceof(Goal);
        expect(g.userId).to.be.instanceof(Mongo.ObjectID);
        expect(g._id).to.be.instanceof(Mongo.ObjectID);
        expect(g.name).to.equal('write a book');
        expect(g.dueDate).to.be.instanceof(Date);
        expect(g.tags).to.have.length(2);
        expect(g.tasks).to.have.length(0);
        done();
      });
    });
  });

  describe('.findAllByUserId', function(){
    it('should find all goals by a user ID', function(done){
      var id = Mongo.ObjectID('000000000000000000000001');
      Goal.findAllByUserId(id, function(err, goals){
        expect(goals).to.have.length(2);
        done();
      });
    });
  });

  describe('.findByGoalIdAndUserId', function(){
    it('should return goal (user IDs match)', function(done){
      var goalId = 'a00000000000000000000002',
          userId = Mongo.ObjectID('000000000000000000000001');
      Goal.findByGoalIdAndUserId(goalId, userId, function(err, goal){
        expect(goal).to.be.ok;
        done();
      });
    });
    it('should return null (user IDs don\'t match)', function(done){
      var goalId = 'a00000000000000000000003',
          userId = Mongo.ObjectID('000000000000000000000001');
      Goal.findByGoalIdAndUserId(goalId, userId, function(err, goal){
        expect(goal).to.be.null;
        done();
      });
    });
  });

  describe('.addTask', function(){
    it('should add a task to user\'s goal', function(done){
      var goalId = 'a00000000000000000000002',
          body = {name:'Adopt a second kitteh', description:'Go to Happy Tales & adopt the first kitteh you see.', difficulty:'2', rank:'2'},
          userId = Mongo.ObjectID('000000000000000000000001');
      Goal.addTask(body, goalId, userId, function(err, goal){
        expect(goal.tasks).to.have.length(1);
        expect(goal.tasks[0].rank).to.equal(2);
        done();
      });
    });
    it('should not add a task to non-logged in users goal', function(done){
      var goalId = 'a00000000000000000000003',
          body = {name:'Adopt a second kitteh', description:'Go to Happy Tales & adopt the first kitteh you see.', difficulty:'2', rank:'2'},
          userId = Mongo.ObjectID('000000000000000000000001');
      Goal.addTask(body, goalId, userId, function(err, goal){
        expect(goal).to.be.undefined;
        done();
      });
    });
  });
// Last Bracket
});
