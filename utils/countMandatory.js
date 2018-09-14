function countMandatory(docsList) {
	const MANDATORY_DOCS = [ 'application', 'bank-slip_\\d{10}|edc_\\d{8}', 'bi', 'ecbr_\\d{10}', 'insured\-*']
	const IWEALTH_DOCS = ['kyc','rpq']
	let totalMandatory = 0
	if(docsList !== undefined){
		MANDATORY_DOCS.forEach(DOC => {
			if (docsList === null || typeof docsList === 'undefined')
				return 0
			Object.keys(docsList).forEach(key => {
				totalMandatory += RegExp(DOC).test(key) ? 1 : 0
			})
		})
		if (totalMandatory < 5) {
			IWEALTH_DOCS.forEach(DOC => {
				if (docsList === null || typeof docsList === 'undefined')
					return 0
				Object.keys(docsList).forEach(key => {
					totalMandatory += RegExp(DOC).test(key) ? 1 : 0
				})
			})
		}
	} else {
		return '0'
	}
	return totalMandatory
}

module.exports = countMandatory