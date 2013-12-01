var beanstalkControllers = angular.module('beanstalkControllers', []);

beanstalkControllers.controller('beanstalkCommits', function($scope, $rootScope, $timeout, $http) {
  $scope.commits = [];
  $scope.repositoryNames = {};

  var findCommitKey = function(revision) {
    var found = false;

    angular.forEach($scope.commits, function(value, key) {
      if (value.revision == revision) {
        found = key;
        return;
      }
    });

    return found;
  };

  var addCommit = function(data) {
    var date = new Date(data.time);
    var previousMonday = $rootScope.getPreviousMonday();

    if (date.getTime() < previousMonday.getTime()) {
      return;
    }

    var commit = {
      revision: data.revision,
      repository_id: data.repository_id,
      repository: $scope.repositoryNames[data.repository_id],
      time: date.getTime(),
      user_id: data.user_id,
      email: data.email,
      message: data.message.replace(/\n(.|\n)+/gi, '')
    };

    $scope.commits.push(commit);
    $rootScope.$broadcast('newCommit', commit);
  };

  (function getChangesets() {
    $http.get('/api/changesets.php').
      success(function(data, status) {
        angular.forEach(data, function(commit) {
          if (!findCommitKey(commit.revision_cache.revision)) {
            if (typeof $scope.repositoryNames[commit.revision_cache.repository_id] == 'undefined') {
              $http.get('/api/repository.php', {params: {id: commit.revision_cache.repository_id}}).
                success(function(data, status) {
                  $scope.repositoryNames[data.repository.id] = data.repository.title;
                  $rootScope.$broadcast('newRepository', data.repository);
                  addCommit(commit.revision_cache);
                });
            }
            else {
              addCommit(commit.revision_cache);
            }
          }
        });

        $timeout(getChangesets, 5000);
      });
  })();

  $scope.$on('clearData', function(event) {
    $scope.commits = [];
    $scope.repositoryNames = {};
  });
});

beanstalkControllers.controller('beanstalkRepositories', function($scope, $http) {
  $scope.repositories = [];

  var findRepositoryKey = function(id) {
    var found = false;

    angular.forEach($scope.repositories, function(value, key) {
      if (value.id == id) {
        found = key;
        return;
      }
    });

    return found;
  };

  $scope.$on('newRepository', function(event, repository) {
    if (!findRepositoryKey(repository.id)) {
      $scope.repositories.push({
        id: repository.id,
        title: repository.title,
        commits: 1,
        users: {}
      });
    }
  });

  $scope.$on('newCommit', function(event, commit) {
    var repositoryKey = findRepositoryKey(commit.repository_id);
    if (repositoryKey) {
      $scope.repositories[repositoryKey].users[commit.user_id] = commit.email;
      $scope.repositories[repositoryKey].commits = $scope.repositories[repositoryKey].commits + 1;
    }
  });

  $scope.$on('clearData', function(event) {
    $scope.repositories = [];
  });
});
