/* global describe, it, before, beforeEach */

'use strict';

process.env.PORT = '5555';
process.env.DB = 'life-coach-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('goals', function(){ // Name of controller
  before(function(done){ // Make sure MongoDB & app is running
    request(app).get('/').end(done); // Done is called once request is sent back to the 'fake' test browser
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  // test home page
  describe('get /', function(){
    it('should fetch the home page', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Home');
        done();
      });
    });
  });

  describe('get /goals/new', function(){
    it('should show the new goals page', function(done){
      request(app)
      .get('/goals/new')
      .set('cookie', cookie) // attaches cookie to request; now get 404
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Name');
        expect(res.text).to.include('Due');
        expect(res.text).to.include('Tags');
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should create a new goal and redirect to the goals page', function(done){
      request(app)
      .post('/goals')
      .set('cookie', cookie)
      .send('name=be+the+most+interesting+person+in+the+world&dueDate=2014-08-27&tags=charisma%2C+world+domination')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should show the goals page', function(done){
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('world domination');
        expect(res.text).to.include('be the most interesting person in the world');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000002').set('cookie', cookie).end(function(err, res){
        console.log(res);
        expect(res.status).to.equal(200);
        expect(res.text).to.include('kitteh');
        done();
      });
    });

    it('should NOT show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000003').set('cookie', cookie).end(function(err, res){
        console.log(res);
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals/3/tasks', function(){
    it('should create a task for a specific goal', function(done){
      request(app)
      .post('/goals/a00000000000000000000002/tasks').set('cookie', cookie).send('name=Adopt+1+kitteh&description=Go+to+Happy+Tales+and+adopt+the+first+kitteh+you+see%21&difficulty=2&rank=1')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

// Last Bracket
});
