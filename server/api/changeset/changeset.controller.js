'use strict';

var beanstalk = require('../../components/beanstalk');

// Get list of changesets
exports.index = function(req, res) {
  beanstalk.get('changesets.json', function(error, response, body) {
    res.json(body);
  });
};
