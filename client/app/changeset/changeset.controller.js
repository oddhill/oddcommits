'use strict';

angular.module('oddcommitsApp')
  .controller('ChangesetCtrl', function ($scope) {
    $scope.commits = {};

    // Watch for the new-commit event, and add each commit to the scope.
    $scope.$on('new-commit', function(event, commit) {
      $scope.commits[commit.revision] = commit;
    });
  });
