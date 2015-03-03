'use strict';

angular.module('oddcommitsApp')
  .controller('MainCtrl', function ($scope, beanstalk) {
    $scope.commits = {};
    $scope.repositories = {};

    // Watch for the new-commit event.
    $scope.$on('new-commit', function(event, commit) {
      // Add this commit to the scope.
      $scope.commits[commit.revision] = commit;

      // Update the corresponding repository.
      if (!$scope.repositories[commit.repository_id]) {
        // The repository doesn't exist in the scope. Fetch the details for this
        // repository in order to add them to the scope.
        beanstalk.getRepository({id: commit.repository_id}, function(data) {
          $scope.repositories[data.repository.id] = data.repository;
          $scope.repositories[data.repository.id].commitsCount = 1;
          $scope.repositories[data.repository.id].users = {};
          $scope.repositories[data.repository.id].users[commit.user_id] = commit.email;
        });
      }
      else {
        // Increase the commit count and add the user to the repository.
        $scope.repositories[commit.repository_id].commitsCount++;
        $scope.repositories[commit.repository_id].users[commit.user_id] = commit.email;
      }
    });
  });
