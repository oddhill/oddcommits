/**
 * Beanstalk client.
 */

'use strict';

// Create the client with the required headers and basic authentication.
var request = require('request-json');
var client = request.newClient('https://' + process.env.BEANSTALK_ACCOUNT + '.beanstalkapp.com/api/', {
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Beanstalker'
  }
});
client.setBasicAuth(process.env.BEANSTALK_USERNAME, process.env.BEANSTALK_TOKEN);

// Return the client.
module.exports = client;
