module.exports = {
  serverUrl: 'http://localhost:3000',
  githubClientId: '',
  githubSecret: '',
	mongodbHost: process.env.EVERCODE_MONGODB_1_PORT_27017_TCP_ADDR || 'mongodb://127.0.0.1',
	mongodbName: '/everCode',
	mongodbPort: ':27017',
	redisHost: process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1',
	redisPort: process.env.REDIS_PORT_6379_TCP_PORT || 6379,
	secretToken: ''

}
