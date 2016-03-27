module.exports = {
	serverUrl: 'http://localhost:3000',
	mongodbHost: process.env.EVERCODE_MONGODB_1_PORT_27017_TCP_ADDR || 'mongodb://127.0.0.1',
	mongodbName: '/everCodeFiles',
	mongodbPort: ':27017',
	secretToken: 'donkey',
}