'use strict';

var beanstalk = require('../../components/beanstalk');

// Get list of repositorys
exports.index = function(req, res) {
  beanstalk.get('repositories.json', function(error, response, body) {
    res.json(body);
  });
};
