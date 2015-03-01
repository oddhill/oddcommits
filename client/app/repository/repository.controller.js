'use strict';

angular.module('oddcommitsApp')
  .controller('RepositoryCtrl', function ($scope, beanstalk) {
    $scope.repositories = {};

    // Watch for the new-commit event, and add each commit to the scope.
    $scope.$on('new-commit', function(event, commit) {
      beanstalk.getRepository({id: commit.repository_id}, function(repository) {
        repository = repository.repository;

        if (!$scope.repositories[repository.id]) {
          $scope.repositories[repository.id] = repository;
          $scope.repositories[repository.id].commitsCount = 1;
          $scope.repositories[repository.id].users = {};
          $scope.repositories[repository.id].users[commit.user_id] = commit.email;
        }
        else {
          $scope.repositories[repository.id].commitsCount++;
          $scope.repositories[repository.id].users[commit.user_id] = commit.email;
        }
      });
    });
  });
