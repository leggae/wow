module.exports = require('./sg-bucket').createBucket(`${process.env.PRODUCTION_URL}/application`, {
	username: process.env.LOCAL_USERNAME,
	password: process.env.PRODUCTION_PASS
})
