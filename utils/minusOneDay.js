const moment = require('moment-timezone')

function minusOneDay(date) {
	if (!moment(date).isValid())
		return false
	return moment(date)
		.add(-1, 'd')
		.format('YYYY-MM-DD')
}
module.exports = minusOneDay