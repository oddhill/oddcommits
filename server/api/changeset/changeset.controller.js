'use strict';

var beanstalk = require('../../components/beanstalk');
var querystring = require('querystring');

// Get list of changesets
exports.index = function(req, res) {
  // Create a query string from the passed in query object.
  var query = querystring.stringify(req.query);

  // Perform the request.
  beanstalk.get('changesets.json' + (query ? '?' + query : ''), function(error, response, body) {
    res.json(body);
  });
};
