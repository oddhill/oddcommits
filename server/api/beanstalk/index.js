'use strict';

var express = require('express');
var controller = require('./beanstalk.controller');

var router = express.Router();

router.get('*', controller.request);

module.exports = router;
