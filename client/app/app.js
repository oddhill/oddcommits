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
  .run(function($rootScope, beanstalk) {
    // Get the changeset.
    beanstalk.getChangeset(function(commits) {
      // Broadcast an event for each commit.
      angular.forEach(commits, function(commit) {
        $rootScope.$broadcast('new-commit', commit.revision_cache);
      });
    });
  });
