const nconf = require('nconf');
const path = require('path');

const store = new nconf.Provider();
store
  .file('local', { file: path.join(__dirname, '..', '..', 'config', 'local.config.json') })
  .file('default', { file: path.join(__dirname, '..', '..', 'config', 'default.config.json') });

module.exports = store;
