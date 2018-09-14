module.exports = require('./sg-bucket').createBucket(`${process.env.PRODUCTION_URL}/esub`, {
	username: process.env.LOCAL_USERNAME,
	password: process.env.PRODUCTION_PASS
})