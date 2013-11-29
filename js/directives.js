var beanstalkDirectives = angular.module('beanstalkDirectives', []);

beanstalkDirectives.directive('beanstalkCommit', function() {
  return {
    restrict: 'E',
    scope: {
      repository: '@',
      time: '@',
      email: '@',
      message: '@'
    },
    replace: true,
    templateUrl: 'templates/commit.html'
  };
});

beanstalkDirectives.directive('beanstalkRepository', function() {
  return {
    restrict: 'E',
    scope: {
      title: '@',
      commits: '@',
      users: '='
    },
    templateUrl: 'templates/repository.html'
  };
});
