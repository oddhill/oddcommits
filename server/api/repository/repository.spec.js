'use strict';

var app = require('../../app');
var should = require('should');
var request = require('request');

describe('repository endpoint', function() {
  // Store the returned repositories in a variable since these will be used
  // throughout the tests.
  var repositories;

  // Fetch the repository index before any tests.
  before('fetch data from the index', function(done) {
    request.get('http://localhost:9000/api/repositories', function(err, res, body) {
      repositories = JSON.parse(body);
      done();
    });
  });

  describe('repository index', function() {
    it('should respond with an array', function() {
      repositories.should.be.an.Array;
    });

    it('should include repository objects', function() {
      repositories[0].repository.should.be.an.Object;
    });
  });

  describe('repository details', function() {
    // Store the response in a variable as this will be used throught the
    // tests.
    var response;

    // Fetch details from the first repository before any tests.
    before('fetch data from the first repository', function(done) {
      request.get('http://localhost:9000/api/repositories/' + repositories[0].repository.id, function(err, res, body) {
        response = JSON.parse(body);
        done();
      });
    });

    it('should respond with an object', function() {
      response.should.be.an.Object;
    });

    it('should include a single repository object', function() {
      response.repository.should.be.an.Object;
    });

    it('should include the name of the repository', function() {
      response.repository.name.should.be.a.String;
    });
  });
});
