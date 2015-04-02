'use strict';

angular.module('oddcommitsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.gravatar',
  'srph.timestamp-filter',
  'angular-toArrayFilter'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, $window, $timeout, beanstalk, github) {
    // Add timestamps for the start and end of the current week to the root
    // scope.
    $rootScope.startOfWeek = moment().startOf('isoWeek').valueOf();
    $rootScope.endOfWeek = moment().endOf('isoWeek').valueOf();

    // Reload the window when the next week begins.
    $timeout(function() {
      $window.location.reload();
    }, $rootScope.endOfWeek - moment().valueOf());

    // Start fetching commits.
    beanstalk.init();
    github.init();
  });
