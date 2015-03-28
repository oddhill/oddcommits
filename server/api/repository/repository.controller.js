'use strict';

var beanstalk = require('../../components/beanstalk');
var querystring = require('querystring');

// Get list of repositories
exports.index = function(req, res) {
  // Create a query string from the passed in query object.
  var query = querystring.stringify(req.query);

  beanstalk.get('repositories.json' + (query ? '?' + query : ''), function(error, response, body) {
    res.json(body);
  });
};

// Get specific repository.
exports.repository = function(req, res) {
  beanstalk.get('repositories/' + req.params.id + '.json', function(error, response, body) {
    res.json(body);
  });
};
