module.exports = {
	serverUrl: 'http://localhost:3000',
	githubClientId: 'ea4d12b771b2cce728d1',
	githubSecret: '300a63e4183b37345b94cf44f005d3a3bb8a98ca',
  mongodbHost: process.env.EVERCODE_MONGODB_1_PORT_27017_TCP_ADDR || 'mongodb://127.0.0.1',
  mongodbName: '/everCode',
  mongodbPort: ':27017',
  redisHost: process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1',
  redisPort: process.env.REDIS_PORT_6379_TCP_PORT || 6379,
  secretToken: 'donkey'
}