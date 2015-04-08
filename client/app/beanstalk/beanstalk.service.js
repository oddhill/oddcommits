'use strict';

angular.module('oddcommitsApp')
  .service('beanstalk', function ($resource, $rootScope, $timeout) {
    // Resource for communicating with the backend.
    var api = $resource('/', {}, {
      getChangeset: {
        url: '/api/beanstalk/changesets.json',
        isArray: true
      },
      getRepositories: {
        url: '/api/beanstalk/repositories.json',
        isArray: true
      },
      getRepository: {
        url: '/api/beanstalk/repositories/:id.json'
      }
    });

    // Store the hash of the commits that has been processed.
    var processedCommits = [];

    // Store the names of the repositories. These needs to be handled manually
    // since they're not included in the changeset.
    var repositoryNames = {};

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
    var processCommit = function(data) {
      return {
        revision: data.revision,
        repository: {
          id: 'beanstalk-' + data.repository_id,
          title: repositoryNames[data.repository_id]
        },
        message: data.message.match(/^.+(\n|)/)[0],
        user: data.email,
        time: new Date(data.time).toISOString()
      };
    };

    /**
     * Get every repository title.
     *
     * This will be used as the init function. It will get the title of every
     * repository, since these will be used for the commits later on.
     *
     * @param int currentPage
     *   Internal use only. Specifies which page that should be fetched.
     */
    var getRepositoryTitles = function(currentPage) {
      // Default to the first page, if one hasn't been specified.
      currentPage = currentPage ? currentPage : 1;

      // Fetch the repositories for the current page.
      api.getRepositories({page: currentPage, per_page: 50}, function(repositories) {
        // Save the title for every repository.
        angular.forEach(repositories, function(repository) {
          repositoryNames[repository.repository.id] = repository.repository.title;
        });

        // We should check the next page for more repositories if we've got
        // exactly 50 repositories for this request. Otherwise, we'll start
        // fetching commits.
        if (repositories.length === 50) {
          getRepositoryTitles(currentPage + 1);
        }
        else {
          getCommits();
        }
      });
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
      api.getChangeset({page: currentPage, per_page: 30}, function(commits) {
        var fetchNextPage = true;

        // Process each commit.
        angular.forEach(commits, function(commit) {
          if (processedCommits.indexOf(commit.revision_cache.revision) !== -1) {
            // This commit has already been processed, which means that there
            // are no more commits to fetch.
            fetchNextPage = false;
          }

          if (new Date(commit.revision_cache.time).getTime() < $rootScope.startOfWeek) {
            // This commit is older than the specified time, stop fetching older
            // commits.
            fetchNextPage = false;
          }

          // Exit if we should fetch the next page.
          if (!fetchNextPage) {
            return;
          }

          // Prepare the commit.
          var commit = processCommit(commit.revision_cache);

          // Add the hash of this commit to the array of processed commits.
          processedCommits.push(commit.revision);

          if (commit.repository.title) {
            // We've got the title for this repository. Broadcast an event
            // right away.
            $rootScope.$broadcast('new-commit', commit);
          }
          else {
            // We haven't got a title for this repository. Get the details from
            // the API, add the title to the commit object, and broadcast an
            // event once finished.
            api.getRepository({id: commit.repository.id}, function(repository) {
              repositoryNames[commit.repository_id] = repository.repository.title;
              commit.repository.title = repository.repository.title;
              $rootScope.$broadcast('new-commit', commit);
            });
          }
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
    return {init: getRepositoryTitles};
  });
