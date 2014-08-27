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
    it('should create a new Goal object', function(done){
      var body = {name:'write a book', dueDate:'2014-08-27', tags:'work, capitalism'},
          userId = Mongo.ObjectID('000000000000000000000001');
      console.log('----------TEST body----------');
      console.log(body);
      console.log('----------TEST userId----------');
      console.log(userId);
      Goal.create(body, userId, function(err, goal){
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

  describe('#save', function(){
    it('should save a goal', function(done){
      var userId = Mongo.ObjectID('000000000000000000000001'),
          goalId = 'a00000000000000000000002';
      Goal.findByGoalIdAndUserId(goalId, userId, function(err, goal){
        goal.name = 'stuff';
        goal.save(function(err, count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

  describe('#addTask', function(){
    it('should save a goal', function(done){
      var userId = Mongo.ObjectID('000000000000000000000001'),
          goalId = 'a00000000000000000000001';
      Goal.findByGoalIdAndUserId(goalId, userId, function(err, goal){
        goal.addTask({name:'w', difficulty:'x', description:'y', rank:'z'});
        expect(goal.tasks[0].name).to.equal('w');
        expect(goal.tasks[0]._isComplete).to.be.false;
        done();
      });
    });
  });
// Last bracket
});
