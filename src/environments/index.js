const _ = require('lodash');
const async = require('async');
const rest = require('restler');

const getEnvironmentVersions = (environments, callback) => {
  const tasks = _.mapValues(environments, url => done =>
    rest.get(url).on('complete', res => (_.isError(res) ? done(res) : done(null, res))));
  async.parallel(tasks, (err, res) => {
    if (err) {
      callback(err);
      return;
    }
    const versions = _.mapValues(res, 'version');
    callback(null, versions);
  });
};

module.exports = {
  getEnvironmentVersions,
};
