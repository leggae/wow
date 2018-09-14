var React = require('react');
const _ = require('lodash')
class Table extends React.Component {

	generateData(data) {
		const application = data.application, 
			policy = data.policy, 
			submission = data.submission,
			appDocs = _.get(application,'_attachments', []),
			policyDocs = _.get(policy,'_attachments', []),
			subDocs = _.get(submission,'documents', [])
		const appAttachment = Object.keys(appDocs)
		const policyAttachment = Object.keys(policyDocs)
		const submissionAttachment = Object.keys(subDocs)
		const all = appAttachment.concat(policyAttachment).concat(submissionAttachment)
		const attachment = {}
		all.map(element => {
			if(!attachment[element]) {
				attachment[element] = {
					app: appAttachment.includes(element),
					policy: policyAttachment.includes(element),
					submission: submissionAttachment.includes(element)
				}
			}
		})
		return attachment
	}

	getDownloadLink(key, attachment, data, policyId) {
		if(attachment[key].policy || key === 'atp' || key.includes('ecbr'))
			return `/file/esub/${policyId}/${key}`
		else if(attachment[key].app)
			return `/file/application/${data.application._id}/${key}`
	}

	render(){
		const { data, policyId } = this.props;
		const attachment = this.generateData(data)
		return (
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">Attachment</th>
						<th scope="col">In App</th>
						<th scope="col">In Policy</th>
						<th scope="col">In Submission</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(attachment).map((key) => 
						<tr key={key}>
							<td>{attachment[key].policy || key==='atp' || attachment[key].app || key.includes('ecbr')? 
								<a href={this.getDownloadLink(key, attachment, data, policyId)}>{key}</a> : key}
							</td>
							<td>{attachment[key].app? <i className="glyphicon glyphicon-ok"></i> : '-'}</td>
							<td>{attachment[key].policy? <i className="glyphicon glyphicon-ok"></i> : '-'}</td>
							<td>{attachment[key].submission? <i className="glyphicon glyphicon-ok"></i> : '-'}</td>
						</tr>
					)}
          
				</tbody>
			</table>)
	}
}

module.exports = Table;
