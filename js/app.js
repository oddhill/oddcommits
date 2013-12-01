var beanstalk = angular.module('beanstalk', ['beanstalkControllers', 'ngRoute', 'md5', 'ui-gravatar']);

beanstalk.config(function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/root.html'
    }).
    otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});

beanstalk.run(function($rootScope, $timeout) {

  $rootScope.getNextMonday = function() {
    var now = new Date();
    var nextMonday = new Date();

    // Set the date based on the specified clearDay and clearHour.
    nextMonday.setDate(now.getDate() + (1 - 1 - now.getDay() + 7) % 7 + 1);
    nextMonday.setHours(7, 0, 0, 0);

    return nextMonday;
  };

  $rootScope.getPreviousMonday = function() {
    var previousMonday = new Date();
    var nextMonday = $rootScope.getNextMonday();

    previousMonday.setDate(nextMonday.getDate() - 7);

    return previousMonday;
  };

  (function setClearTime() {
    var now = new Date();
    var nextMonday = $rootScope.getNextMonday();
    var clearTime = nextMonday.getTime() - now.getTime();

    $timeout(function() {
      $rootScope.$broadcast('clearData');
      setClearTime();
    }, clearTime);
  })();
});
