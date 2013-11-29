var beanstalkControllers = angular.module('beanstalkControllers', []);

beanstalkControllers.controller('beanstalkCommits', function($scope, $rootScope, $timeout, $http) {
  $scope.commits = {};
  $scope.repositories = {};

  var addCommit = function(data) {
    var date = new Date(data.time);

    var commit = {
      repository_id: data.repository_id,
      repository: $scope.repositories[data.repository_id],
      time: date.getTime(),
      user_id: data.user_id,
      email: data.email,
      message: data.message.replace(/\n(.|\n)+/gi, '')
    };

    $scope.commits[data.revision] = commit;
    $rootScope.$broadcast('newCommit', commit);
  };

  (function getChangesets() {
    $http.get('/api/changesets.php').
      success(function(data, status) {
        angular.forEach(data, function(commit) {
          if (typeof $scope.commits[commit.revision_cache.revision] == 'undefined') {
            if (typeof commit.repository == 'undefined') {
              $http.get('/api/repository.php', {params: {id: commit.revision_cache.repository_id}}).
                success(function(data, status) {
                  $scope.repositories[data.repository.id] = data.repository.title;
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
});

beanstalkControllers.controller('beanstalkRepositories', function($scope, $http) {
  $scope.repositories = {};

  $scope.$on('newRepository', function(event, repository) {
    if (typeof $scope.repositories[repository.id] == 'undefined') {
      $scope.repositories[repository.id] = {
        title: repository.title,
        commits: 0,
        users: {}
      };
    }
  });

  $scope.$on('newCommit', function(event, commit) {
    $scope.repositories[commit.repository_id].users[commit.user_id] = commit.email;
    $scope.repositories[commit.repository_id].commits = $scope.repositories[commit.repository_id].commits + 1;
  });

});
