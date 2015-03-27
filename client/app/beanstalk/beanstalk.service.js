'use strict';

angular.module('oddcommitsApp')
  .service('beanstalk', function ($resource, $rootScope) {
    // Resource for communicating with the backend.
    var api = $resource('/', {}, {
      getChangeset: {
        url: '/api/changesets',
        isArray: true
      },
      getRepository: {
        url: '/api/repositories/:id'
      }
    });

    // Store the hash of the commits that has been processed.
    var processedCommits = [];

    /**
     * Gets commits.
     *
     * This function will get commits from every page until it finds a commit
     * that has already been added, or a commit that from the past week.
     *
     * @param int currentPage
     *   Internal use only. Specifies which page that should be fetched.
     */
    var getCommits = function(currentPage) {
      // Default to the first page, if one hasn't been specified.
      currentPage = currentPage ? currentPage : 1;

      // Fetch the changeset for the current page.
      api.getChangeset({page: currentPage, per_page: 30}, function(commits) {
        var fetchNextPage = true;

        // Process each commit.
        angular.forEach(commits, function(commit) {
          if (processedCommits.length && processedCommits[0] == commit.revision_cache.revision) {
            // This commit has already been processed, which means that there
            // are no more commits to fetch.
            fetchNextPage = false;
            return;
          }

          if (moment(commit.revision_cache.time).unix() < $rootScope.startOfWeek) {
            // This commit is older than the specified time, stop fetching older
            // commits, and exit.
            fetchNextPage = false;
            return;
          }

          // Add the hash of this commit to the array of processed commits.
          processedCommits.push(commit.revision_cache.revision);

          // Broadcast an event for this commit.
          $rootScope.$broadcast('new-commit', commit.revision_cache);
        });

        if (fetchNextPage) {
          // Fetch commits from the next page.
          getCommits(currentPage + 1);
        }
        else {
          // Fetch new commits once a minute.
          $timeout(getCommits, 60 * 1000);
        }
      });
    };

    // Return the service.
    return {
      getCommits: getCommits,
      api: api
    };
  });
