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
    // Create a function that retrieves the changeset, and invoke it
    // immediately.
    (function getChangeset() {
      beanstalk.getChangeset({per_page: 30}, function(commits) {
        // Broadcast an event for each commit.
        angular.forEach(commits, function(commit) {
          $rootScope.$broadcast('new-commit', commit.revision_cache);
        });
      });

      // Call this function again, after 60 seconds.
      setTimeout(getChangeset, 60 * 1000);
    })();
  });
