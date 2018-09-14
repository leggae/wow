const moment = require('moment-timezone')
const correctTimezone = function (data, startDate, endDate, tz) {
	return data.map(x => ({
		policyId: x.value.policyId,
		submittedAt: x.value.application.submittedAt,
		date: moment(x.value.application.submittedAt)
			.tz(tz)
			.format('YYYY-MM-DD')
	}))
		.filter(x => x.date >= startDate && x.date <= endDate)
		.sort((a, b) => moment(a.submittedAt).unix() - moment(b.submittedAt).unix())
}

module.exports = correctTimezone
