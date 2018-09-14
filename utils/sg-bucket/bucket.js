const axios = require('axios');

module.exports = (bucketUrl, auth) => {

	const getDoc = async (key) => {
		const url = `${bucketUrl}/${key}`
		return await axios({
			method: 'GET',
			url,
			auth
		});
	}
    
	const getDocs = async (keys) => {
		const url = `${bucketUrl}/_all_docs?keys=${JSON.stringify(keys)}&include_docs=true`
		return await axios({
			method: 'GET',
			url,
			auth
		});
	}
	const getAdditionalDocs = async function (policyId){
		const url = `${bucketUrl}/_all_docs?startkey="additional-doc_${policyId}"&endkey="additional-doc_${policyId}[]"&include_docs=true`
		return await axios({
			method: 'GET',
			url,
			auth
		})
	} 

	const getSubmissionDocs = async (start, end) => {
		const url = `${bucketUrl}/_design/policies/_view/application_submissions?startkey="${start}"&endkey="${end}"&stale=false`
		return await axios({
			method: 'GET',
			url,
			auth
		});
	}

	const getPolicyAdvisor = async function ( advisorId ) {
		const url = `${bucketUrl}/${advisorId}`
		return await axios({
			method: 'GET',
			url,
			auth
		});
	}
    
	const getAttachment = async (path) => {
		const url = `${bucketUrl}/${path}`
		try { 
			return await axios({
				method: 'GET',
				url,
				auth,
				responseType: 'arraybuffer'
			})
		} catch (e) {
			return e
		}
	}
    
	return {
		getDoc,
		getDocs,
		getAdditionalDocs,
		getSubmissionDocs,
		getAttachment,
		getPolicyAdvisor
	}
}