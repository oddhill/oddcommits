'use strict';

angular.module('oddcommitsApp')
  .controller('RepositoryCtrl', function ($scope) {
    $scope.repositories = {};

    // Watch for the new-commit event, and add each commit to the scope.
    $scope.$on('new-commit', function(event, commit) {
      $scope.repositories[commit.revision] = commit;
    });
  });
