const _ = require('lodash')
const getExtension = require('../utils/getExtension')
const AppBucket = require('../utils/app-bucket')
const EsubBucket = require('../utils/esub-bucket')

const getPolicyById = async function (policy_id) {
	try {
		return await EsubBucket.getDoc(`policy_${policy_id}`)
	} catch (e) {
		return e
	}
}

const getSubmissionById = async function (policy_id) {
	try {
		return await EsubBucket.getDoc(`submission_${policy_id}`)
	} catch (e) {
		return e
	}
}

const getApplicationById = async function (app_id) {
	try {
		return await AppBucket.getDoc(app_id)
	} catch (e) {
		return e
	}
}

const getAdditionalBulk = async function(policyId){
	try {
		return await EsubBucket.getAdditionalDocs(policyId)
	} catch (e) {
		return e
	}
}

const getPaymentsBulk = async function (paymentArray) {
	try {
		return await EsubBucket.getDocs(paymentArray)
	} catch (e) {
		return e
	}
}

const getAdvisor = async function (policyId){
	try {
		return await EsubBucket.getPolicyAdvisor( `advisor_${policyId}` )
	} catch (e) {
		return e
	}
}

const script = async function (POLICY_NO) {
	let response = {};
	const policyDoc = await getPolicyById(POLICY_NO)
	const application_id = _.get(policyDoc, 'data.applicationId', false)
	response.policy = policyDoc.data

	const submissionDoc = await getSubmissionById(POLICY_NO) 
	response.submission = _.get(submissionDoc, 'data', {})

	const applicationDoc = await getApplicationById(application_id) 
	response.application = _.get(applicationDoc, 'data', {})

	const subPaymentObject = _.get(submissionDoc, 'data.payments', {})
	const subPaymentProps = Object.getOwnPropertyNames(subPaymentObject)
	let paymentList = []
	subPaymentProps.forEach( key => {
		const subPayment = 'payment_' + POLICY_NO + key
		paymentList.push(subPayment)
	})

	const polAdditionDoc = _.get( await getAdditionalBulk(POLICY_NO), 'data', {})
	for(let i=0; i<polAdditionDoc.total_rows; i++){
		const thisDoc = polAdditionDoc.rows[i].doc
		const thisDocId = `additional-doc_${thisDoc.documentId}`
		const thisPolDoc = _.get(thisDoc, `_attachments[${thisDoc.documentId}]`, {})
		response.policy._attachments[thisDocId] = thisPolDoc
	}
	const subAddDoc = _.get(response, `submission.documents['additional-doc']`, {})
	for( let x in subAddDoc ){ 
		const thisDoc = `additional-doc_${x}`
		response.submission.documents[thisDoc] = response.submission.documents['additional-doc'][x]
	}
	if(_.has(response.submission, `documents['additional-doc']`))
		delete response.submission.documents['additional-doc']

	if( _.get(policyDoc, 'data.productCategory', 'ERROR') === 'INVESTMENT'){
		response.payment = { type: 'invest',message: 'Investment does not have payment.', paid: false }
	} else if ( paymentList.length > 0 ){
		const paymentDoc = await getPaymentsBulk(paymentList)
		response.payment = paymentDoc.data.rows.filter(doc => doc.status !== 404 ).map(doc=> doc.doc)
	} else {
		response.payment = { type: 'error', message: 'payment not found', paid: false }
	}
	response.advisor = _.get( await getAdvisor(POLICY_NO), 'data', {} )
	return response;
}

const getPolicyDetail = async function (req, res) {
	const policyNo = req.params.policy_no;
	const data = await script(policyNo);
	res.render('Html', { data: { policyNo, data, page: 'policy' } });
}

const getPolicyAttachFile = async function (req, res) {
	const bucket = req.params.bucket
	const filename = req.params.filename
	const id = req.params.id
	let key, response
	
	if(filename === 'atp')
		key = `recurring-payment_${id}/atp`
	else if(filename.includes('ecbr'))
		key = `payment_${id}_${filename.split('_')[1]}/ecbr`
	else if(bucket === 'esub')
		key = `policy_${id}/${filename}`
	else if(bucket === 'application')
		key = `${id}/${filename}`

	switch(bucket) {
		case 'esub' : response = await EsubBucket.getAttachment(key); break;
		case 'application' : response = await AppBucket.getAttachment(key); break;
	}

	const ext = getExtension(response.headers['content-type'])
	res.setHeader('Content-Disposition', 'attachment; filename=' + `${filename}.${ext}`);
	res.setHeader('content-type', response.headers['content-type']);
	res.setHeader('content-length', response.headers['content-length']);
	res.send(response.data)
}

module.exports = {
	'getPolicyDetail' : getPolicyDetail,
	'getPolicyAttachFile' : getPolicyAttachFile
}