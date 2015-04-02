'use strict';

angular.module('oddcommitsApp')
  .service('github', function ($resource, $rootScope, $timeout) {
    // Resource for communicating with the backend.
    var api = $resource('/', {}, {
      getEvents: {
        url: '/api/github/users/olofjohansson/events/orgs/oddhill',
        isArray: true
      }
    });

    // Store the id of the events that has been processed.
    var processedEvents = [];

    /**
     * Process a commit.
     *
     * @param obj data
     *   The commit data as its returned by the API.
     *
     * @return obj
     *   The commit object, formatted in a way which the controller will be able
     *   to handle.
     */
    var processCommit = function(repository, commit, time) {
      return {
        revision: commit.sha,
        repository: {
          id: 'github-' + repository.id,
          title: repository.name
        },
        message: commit.message.match(/^.+(\n|)/)[0],
        user: commit.author.email,
        time: time
      };
    };

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
      api.getEvents({page: currentPage}, function(events) {
        var fetchNextPage = true;

        // Process each commit.
        angular.forEach(events, function(event) {
          if (moment(event.created_at).unix() < $rootScope.startOfWeek) {
            // This event is older than the specified time, stop fetching older
            // events.
            fetchNextPage = false;
          }

          if (event.type !== 'PushEvent') {
            // This isn't a PushEvent, continue to the next event.
            return;
          }

          if (processedEvents.length && processedEvents[0] == event.id) {
            // This event has already been processed, which means that there
            // are no more events to fetch.
            fetchNextPage = false;
          }

          // Exit if we should fetch the next page.
          if (!fetchNextPage) {
            return;
          }

          // Add the id of this event to the array of processed events.
          processedEvents.push(event.id);

          // Broadcast an event for every commit.
          event.payload.commits.forEach(function(commit) {
            $rootScope.$broadcast('new-commit', processCommit(event.repo, commit, event.created_at));
          });
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
    return {init: getCommits};
  });
