'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('assert');

describe('GET /api/changesets', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/changesets')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should include revision_cache objects', function(done) {
    request(app)
      .get('/api/changesets')
      .end(function(err, res) {
        if (err) return done(err);

        // Parse the resturned text as JSON.
        var changesets = JSON.parse(res.text);

        // Assert that there is a value in the array, and that the first value
        // contans the revision cache object.
        assert(typeof changesets[0] == 'object');
        assert(typeof changesets[0].revision_cache == 'object');

        done();
      });
  });
});
