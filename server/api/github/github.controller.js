'use strict';

var querystring = require('querystring');

// Create the client with the required headers and basic authentication.
var request = require('request-json');
var github = request.createClient('https://api.github.com/', {
  headers: {
    'User-Agent': 'Odd Commits',
    'Authorization': 'token ' + process.env.GITHUB_TOKEN,
  }
});

// Get list of repositories
exports.request = function(req, res) {
  // Get the path and query string from the request.
  var path = req.path.replace(/^\//gi, '');
  var query = querystring.stringify(req.query);

  // Send the request to Beanstalk, and return the result as JSON data.
  github.get(path + (query ? '?' + query : ''), function(error, response, body) {
    res.json(body);
  });
};
