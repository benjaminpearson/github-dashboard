const _ = require('lodash');
const config = require('../config');
const Github = require('./');

describe('src/github', () => {
  const githubAccessToken = config.get('githubAccessToken');

  describe('constructor', () => {
    it('should initialise a Github instance with access token', () => {
      const github = new Github(githubAccessToken);
      expect(github.client).toBeDefined();
    });

    it('should initialise a Github instance without access token', () => {
      const github = new Github();
      expect(github.client).toBeDefined();
    });
  });

  describe('getRepoStatus', () => {
    const github = new Github(githubAccessToken);
    const repoName = 'benjaminpearson/github-dashboard';

    it('should get status of public repo', (done) => {
      github.getRepoStatus(repoName, (err, res) => {
        expect(err).toBeNull();
        expect(_.last(res.commits)).toEqual({
          author: {
            avatar: 'https://avatars0.githubusercontent.com/u/85269?v=3',
            username: 'benjaminpearson',
          },
          message: 'Initial commit',
          sha: '6ce37a935b84e08ca0d02829299a485552a0f1f2',
        });
        expect(_.last(res.pullRequests)).toEqual({
          author: {
            avatar: 'https://avatars0.githubusercontent.com/u/85269?v=3',
            username: 'benjaminpearson',
          },
          created: '2017-06-04T02:13:18Z',
          title: 'Tailored to github-dashboard project',
          updated: '2017-06-04T02:19:39Z',
          urls: {
            comments: 'https://api.github.com/repos/benjaminpearson/github-dashboard/issues/1/comments',
            html: 'https://github.com/benjaminpearson/github-dashboard/pull/1',
            statuses: 'https://api.github.com/repos/benjaminpearson/github-dashboard/statuses/dce1a18c4f8c50c3b7d7a8af59f10439f3bc1ecf', // eslint-disable-line max-len
          },
        });
        expect(_.isArray(res.tags)).toEqual(true);
        done();
      });
    });

    it('should fail to get status of repo if unknown repo', (done) => {
      github.getRepoStatus('unknown', (err, res) => {
        expect(err.message).toEqual('Not Found');
        expect(res).not.toBeDefined();
        done();
      });
    });

    it('should fail to get status of repo if unsupplied', (done) => {
      github.getRepoStatus(null, (err, res) => {
        expect(err.message).toEqual('Invalid repoName when getting status');
        expect(res).not.toBeDefined();
        done();
      });
    });
  });
});
