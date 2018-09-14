const moment = require('moment-timezone')
const _ = require('lodash')
const minusOneDay = require('../utils/minusOneDay')
const countMandatory = require('../utils/countMandatory')
const correctTimezone = require('../utils/correctTimezone')
const numberWithCommas = require('../utils/numberWithCommas')
const AppBucket = require('../utils/app-bucket')
const EsubBucket = require('../utils/esub-bucket')

const tz = 'Asia/Bangkok'

Array.prototype.sum = function (prop) {
	let total = 0
	for ( let i = 0, _len = this.length; i < _len; i++ ) {
		total += parseFloat(this[i][prop])
	}
	return total
}

const dateRange = function (startDate, endDate){
	if (moment(startDate).isAfter(endDate)){
		this.startDate = endDate
		this.endDate = startDate
	} else {
		this.startDate = startDate
		this.endDate = endDate
	}
}

const getPolicyArrayFromSubmissionByRange = async function (range) {
	let result 
	try { 
		result = await EsubBucket.getSubmissionDocs(minusOneDay(range.startDate), range.endDate)
	} catch (e) {
		console.error('ERROR!: ',e)
	}  
	const { status, statusText, data } = result;
	const { rows } = data;
	let policies = correctTimezone(rows, range.startDate, range.endDate, tz)
	policies = policies.map(policy => 'policy_' + policy.policyId)
	return policies
}
const homeController = async function (req, res) {
	var policyArray, startDate, endDate, appArray, submitArray, paymentsArray, total = 0, page
	page = parseInt(req.query.page) || 0
	const limit = parseInt(req.query.limit) || 10
	const skip = limit * page
	const headerNames = ['Policy-no', 'Insured Name', 'Product', 'Sum Assured', 'First Premium', 'Payment', 'Doc', 'Agent', 'Status', 'Submited At']
	let range
	if (!req.query.policyId) {
		startDate = moment(req.query.startDate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')
		endDate = moment(req.query.endDate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')
		range = new dateRange(startDate, endDate)
		try {
			policyArray = await getPolicyArrayFromSubmissionByRange(range)
			total = policyArray.length
			if(req.query.isExport !== 'true') // slice data to page (export not slice)
				policyArray = policyArray.slice(skip, skip+limit)
		} catch (e) {
			console.error('ERROR!:', e)
		}
	} else policyArray = ['policy_' + req.query.policyId]

	const policyList = await EsubBucket.getDocs(policyArray)

	//get application documents
	appArray = policyList.data.rows.filter(policy => policy.status !== 404).map(policy => policy.doc.applicationId)
	const applicationList = await AppBucket.getDocs(appArray)
	const applicationDoc = applicationList.data.rows

	//get submission documents
	submitArray = policyList.data.rows.filter(policy => policy.status !== 404)
		.map(policy => 'submission_' + policy.doc.policyId)
	const submitList = await EsubBucket.getDocs(submitArray)
	const submitDoc = submitList.data.rows

	//get payment documents
	paymentsArray = submitDoc.map(submission => {
		const subPaymentArray  = Object.keys(_.get(submission, 'doc.payments', {}))
		let paymentList = []
		subPaymentArray.forEach(key => {
			const subPayment = 'payment' + submission.doc._id.slice(10) + key
			paymentList.push(subPayment)
		})
		return paymentList.join(',')
	})
	const paymentList = await EsubBucket.getDocs(paymentsArray)
	const paymentDoc = paymentList.data.rows

	let renderData = policyList.data.rows.filter(policy => policy.status !== 404)
		.map((policy, index) => {
			const { policyId, insured, status, submittedTimestamp, coveragePlan } = _.get(policy, 'doc')
			const { quickQuote } = _.get(applicationDoc[index], 'doc', {})
			let ownPayment = paymentDoc
				.filter( payment => payment.status !== 400)
				.filter( payment => {
					const payDocId = _.get(payment, 'doc._id', 'error')
					return payDocId.indexOf(policyId) > 0} )
				.map(doc => doc.doc)
			const paymentType = ownPayment.map( payment => payment.type).join(',')
			const totalPremium = ownPayment.sum('amount')
			const doc = _.has(submitDoc[index],'doc.documents')? countMandatory(_.get(submitDoc[index], 'doc.documents', []) ) : '0'
			return {
				policyId,
				insuredName: insured.firstName + ' ' + insured.lastName,
				product: _.get(quickQuote, 'selectedDisplayProduct.basicPlanName', 'no name'),
				sumAssured: parseFloat(_.get(coveragePlan, 'basicPlan.sumAssured', 0)),
				totalPremium,
				payment: paymentType,
				doc,
				agent: _.get(quickQuote, 'agent.advisorCode', '') + ' ' + _.get(quickQuote, 'agent.fullName', ''),
				status,
				submittedAt: moment(submittedTimestamp).tz(tz).format("DD MMM YYYY HH:mm:ss")
			}
		})
	const etc = {
		start: startDate || '',
		end: endDate || '',
		displayDate : {
			start : range? moment(range.startDate).format('DD MMM YYYY') : '',
			end : range? moment(range.endDate).format('DD MMM YYYY') : '',
		},
		policyId: req.query.policyId || '',
		page,
		limit,
		total,
		totalPage: Math.ceil(total/limit)
	}

	if(req.query.isExport === 'true') {
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'export' + startDate + ' ' + endDate + '.csv');
		res.setHeader('content-type', 'text/csv; charset=utf-8');

		let result = ''
		headerNames.forEach(headerName => {
			result += headerName + ','
		})
		result = result.slice(0, -1) + '\n';
    
		renderData.map((element) => 
			Object.keys(element).map(x => {
				switch(x) {
				case 'sumAssured' :
				case 'totalPremium' :
					result += '"'+numberWithCommas(element[x]) + '",'
					break
				case 'submittedAt' :
					result += element[x] + '\n'
					break
				default :
					result += element[x] + ','
				}
			})
		)

		res.send('\uFEFF' + result)
	}

	else res.render('Html', { data: { renderData, headerNames, etc, page: 'home' } });
}

module.exports = homeController