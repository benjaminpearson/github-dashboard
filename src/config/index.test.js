const config = require('./');

describe('src/config', () => {
  it('should ensure core config is defined', () => {
    expect(config.get('githubAccessToken')).toBeDefined();
    expect(config.get('repos')).toBeDefined();
  });
});
