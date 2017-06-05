const _ = require('lodash');
const async = require('async');
const github = require('octonode');

class Github {
  constructor(githubAccessToken) {
    this.client = github.client(githubAccessToken);
  }

  getRepoStatus(repoName, callback) {
    if (!_.isString(repoName)) {
      return callback(new TypeError('Invalid repoName when getting status'));
    }

    const repo = this.client.repo(repoName);

    const tasks = {
      commits: done => repo.commits(done),
      tags: done => repo.tags(done),
      pullRequests: done => repo.prs({ state: 'closed' }, done),
    };

    async.parallel(tasks, (err, res) => {
      if (err) {
        return callback(err);
      }

      // Format the tags
      // Strip any that start with a 'v'
      const tags = _.map(res.tags[0], tag => _.replace(_.get(tag, 'name', ''), /^v/i, ''));

      // Format the commits
      const commits = _.map(res.commits[0], commit => ({
        sha: commit.sha,
        message: _.get(commit, 'commit.message'),
        author: {
          username: _.get(commit, 'author.login'),
          avatar: _.get(commit, 'author.avatar_url'),
        },
      }));

      // Format the pull requests
      const pullRequests = _.map(res.pullRequests[0], pullRequest => ({
        title: pullRequest.title,
        author: {
          username: _.get(pullRequest, 'user.login'),
          avatar: _.get(pullRequest, 'user.avatar_url'),
        },
        created: pullRequest.created_at,
        updated: pullRequest.updated_at,
        urls: {
          html: pullRequest.html_url,
          comments: pullRequest.comments_url,
          statuses: pullRequest.statuses_url,
        },
      }));

      return callback(null, { commits, pullRequests, tags });
    });
  }
}

module.exports = Github;
