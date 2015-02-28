'use strict';

var beanstalk = require('../../components/beanstalk');

// Get list of repositories
exports.index = function(req, res) {
  beanstalk.get('repositories.json', function(error, response, body) {
    res.json(body);
  });
};

// Get specific repository.
exports.repository = function(req, res) {
  beanstalk.get('repositories/' + req.params.id + '.json', function(error, response, body) {
    res.json(body);
  });
};
