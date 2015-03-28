'use strict';

angular.module('oddcommitsApp')
  .controller('MainCtrl', function ($scope, beanstalk) {
    // Create the initial properties for the scope.
    $scope.commits = {};
    $scope.repositories = {};

    /**
     * Add a commit to the scope.
     *
     * @param obj commit
     *   The full commit object.
     */
    var addCommit = function(commit) {
      // Add the commit to the scope and return true.
      $scope.commits[commit.revision] = commit;
    };

    /**
     * Add a repository to the scope.
     *
     * @param obj repository
     *   The full repository object as returned by the API.
     */
    var addRepository = function(repository) {
      // Add the required default values to the repository object before adding
      // it to the scope.
      repository.commitsCount = 0;
      repository.users = [];
      $scope.repositories[repository.id] = repository;
    };

    /**
     * Increment the commit count for a repository with 1.
     *
     * @param int id
     *   The repository ID.
     */
    var incrementRepositoryCommitsCount = function(id) {
      $scope.repositories[id].commitsCount++;
    };

    /**
     * Add a user to a repository.
     *
     * @param int id
     *   The repository ID.
     * @param string email
     *   The email address of the user.
     */
    var addUserToRepository = function(id, email) {
      // Add to the repository if the email doesn't exist already.
      if ($scope.repositories[id].users.indexOf(email) == -1) {
        $scope.repositories[id].users.push(email);
      }
    };


    // Watch for the new-commit event.
    $scope.$on('new-commit', function(event, commit) {
      // Add the commit to the scope.
      addCommit(commit);

      // Add the repository to the scope if it doesn't exist already.
      if (!$scope.repositories[commit.repository.id]) {
        addRepository(commit.repository);
      }

      // Increase the commit count for the repository.
      incrementRepositoryCommitsCount(commit.repository.id);

      // Add the user to the repository.
      addUserToRepository(commit.repository.id, commit.user);
    });
  });
