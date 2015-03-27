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
     *   The full commit object as returned by the API.
     *
     * @return bool
     *   True if the commit was added to the scope, but false if a commit with
     *   the same revision ID already exists.
     */
    var addCommit = function(commit) {
      if (!$scope.commits[commit.revision]) {
        // Replace the message with everything before the first new line
        // character.
        commit.message = commit.message.match(/^.+(\n|)/)[0];

        // Add the commit to the scope and return true.
        $scope.commits[commit.revision] = commit;
        return true;
      }

      // A commit with the same revision ID already exists, return false.
      return false;
    };

    /**
     * Add a repository to the scope.
     *
     * @param obj repository
     *   The full repository object as returned by the API.
     *
     * @return bool
     *   True if the repository was added to the scope, but false if a
     *   repository with the same ID already exists.
     */
    var addRepository = function(repository) {
      if (!$scope.repositories[repository.id]) {
        // Add the required default values to the repository object before
        // adding it to the scope.
        repository.commitsCount = 0;
        repository.users = [];
        $scope.repositories[repository.id] = repository;
        return true;
      }

      // A repository with the same ID already exists, return false.
      return false;
    };

    /**
     * Increment the commit count for a repository with 1.
     *
     * @param int id
     *   The repository ID.
     *
     * @return int
     *   The new commit count.
     */
    var incrementRepositoryCommitsCount = function(id) {
      $scope.repositories[id].commitsCount++;
      return $scope.repositories[id].commitsCount;
    };

    /**
     * Add a user to a repository.
     *
     * @param int id
     *   The repository ID.
     * @param string email
     *   The email address of the user.
     *
     * @return bool
     *   True if the user was added, false if the email already has been added
     *   to the repository.
     */
    var addUserToRepository = function(id, email) {
      if ($scope.repositories[id].users.indexOf(email) == -1) {
        // Add the user to the repository and return true.
        $scope.repositories[id].users.push(email);
        return true;
      }

      // The email already exists in the array, return false.
      return false;
    };


    // Watch for the new-commit event.
    $scope.$on('new-commit', function(event, commit) {
      // Add the commit to the scope, and update the corresponding repository if
      // the commit was added successfully.
      if (addCommit(commit)) {
        if (!$scope.repositories[commit.repository_id]) {
          // The repository doesn't exist in the scope. Fetch the details for this
          // repository in order to add them to the scope.
          beanstalk.api.getRepository({id: commit.repository_id}, function(data) {
            // Add the repository, increase the commit count and add the user to
            // this repository.
            addRepository(data.repository);
            incrementRepositoryCommitsCount(data.repository.id);
            addUserToRepository(data.repository.id, commit.email);
          });
        }
        else {
          // Increase the commit count and add the user to the repository.
          incrementRepositoryCommitsCount(commit.repository_id);
          addUserToRepository(commit.repository_id, commit.email);
        }
      }
    });
  });
