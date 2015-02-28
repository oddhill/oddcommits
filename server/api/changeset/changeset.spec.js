'use strict';

var app = require('../../app');
var should = require('should');
var request = require('request');

describe('changeset endpoint', function() {
  // Store the returned changesets in a variable since this will be used
  // throughout the tests.
  var changesets;

  // Fetch the changeset index before any tests.
  before('fetch data from the index', function(done) {
    request.get('http://localhost:9000/api/changesets', function(err, res, body) {
      changesets = JSON.parse(body);
      done();
    });
  });

  describe('changeset index', function() {
    it('should respond with an array', function() {
      changesets.should.be.an.Array;
    });

    it('should include revision_cache objects', function() {
      changesets[0].revision_cache.should.be.an.Object;
    });
  });
});
