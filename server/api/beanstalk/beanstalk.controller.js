'use strict';

var querystring = require('querystring');

// Create the client with the required headers and basic authentication.
var request = require('request-json');
var beanstalk = request.createClient('https://' + process.env.BEANSTALK_ACCOUNT + '.beanstalkapp.com/api/', {
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Odd Commits'
  }
});
beanstalk.setBasicAuth(process.env.BEANSTALK_USERNAME, process.env.BEANSTALK_TOKEN);

// Get list of repositories
exports.request = function(req, res) {
  // Get the path and query string from the request.
  var path = req.path.replace(/^\//gi, '');
  var query = querystring.stringify(req.query);

  // Send the request to Beanstalk, and return the result as JSON data.
  beanstalk.get(path + (query ? '?' + query : ''), function(error, response, body) {
    res.json(body);
  });
};
