'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('assert');

describe('GET /api/repositories', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/repositories')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should include repository objects', function(done) {
    request(app)
      .get('/api/repositories')
      .end(function(err, res) {
        if (err) return done(err);

        // Parse the resturned text as JSON.
        var repositories = JSON.parse(res.text);

        // Assert that there is a value in the array, and that the first value
        // contans the repository object.
        assert(typeof repositories[0] == 'object');
        assert(typeof repositories[0].repository == 'object');

        done();
      });
  });
});
