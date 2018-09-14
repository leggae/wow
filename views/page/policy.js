const React = require('react');
const Moment = require('moment')
const JSONPretty = require('react-json-pretty');
const _ = require('lodash')
const { Label, Panel, PanelGroup, Table, Tabs, Tab } = require('react-bootstrap');
const AttachmentTable = require('../component/TableAttachment');
const RiderLabel = require('../component/RiderLabel')
const DocTiffSubmitted = require('../component/DocTiffSubmitted')
const PaymentTable = require('../component/PaymentTable')
const dataFormat = 'YYYY-MM-DD HH:mm:ss'

class PolicyPage extends React.Component {

	render() {
		const { policyNo, data } = this.props;
		const policyDoc = _.get(data, 'policy', {})
		const submissionDoc = _.get(data, 'submission', {})
		const subDocs = _.get(submissionDoc, 'documents', {})
		const { application, bi } = subDocs
		const applicationDoc = _.get(data, 'application', {})
		const paymentDoc = _.get(data, 'payment', {})
		const policyInsured = _.get(policyDoc, 'insured', {})
		const coveragePlan = _.get(policyDoc, 'coveragePlan', {})
		const riders = _.get(coveragePlan, 'riders', [])
		const quickQuote = _.get(applicationDoc, 'quickQuote', {})
		const appInsured = _.get(quickQuote, 'insured', {})
		const agent = _.get(quickQuote, 'agent', {})
		const advisor = _.get(data, 'advisor', {})
		const policyStatus = _.get(data, 'policy.status', 'not found')
		const actualReceipt = _.get(applicationDoc, 'receipts', [])
    
		const renderAttachmentTable = (data, policyNo) => {
			if(_.has(data, 'application') && _.has(data, 'submission') && _.has(data, 'policy') )
				return <AttachmentTable data={data} policyId={policyNo} />
			else return 
		}
    
		return (
			<div className='container'>
				<h1>Policy : {policyNo} <span style={styles.smallSpan}><Label bsStyle={policyStatus === 'submitted' ? 'success' : 'warning'}>{policyStatus}</Label></span></h1>
				<Tabs defaultActiveKey={1} id='table-tab'>
					<Tab eventKey={1} title='Table'>
						<h3>Insured Detail</h3>
						<Table style={styles.dataTable}>
							<thead>
							</thead>
							<tbody>
								<tr>
									<th style={styles.dataTableHead}>
                    Name
									</th>
									<td>
										{_.get(policyInsured, 'title.text', '')} {_.get(policyInsured, 'firstName', 'firstName not found')} {_.get(policyInsured, 'lastName', 'lastName not found')}
									</td>
									<th style={styles.dataTableHead}>
                    Birth Date
									</th>
									<td>
										{_.get(appInsured, 'birthdate.value', 'birthdate not found')} ( {_.get(appInsured, 'age.value', 'age not found')} { _.has(appInsured, 'age.value')?'ปี ':''})
									</td>
								</tr>
								<tr>
									<th style={styles.dataTableHead}>
                    Basic Plan
									</th>
									<td>
										{_.get(quickQuote,'selectedDisplayProduct.basicPlanName','selectedDisplayProduct.basicPlanName not found')} ({_.get(quickQuote,'selectedDisplayProduct.basicPlanCode','selectedDisplayProduct.basicPlanCode not found')})
									</td>
									<th style={styles.dataTableHead}>
                    Product
									</th>
									<td>
										{_.get(quickQuote,'selectedDisplayProduct.name','selectedDisplayProduct.name not found')} ({_.get(quickQuote,'selectedDisplayProduct.category','selectedDisplayProduct.category not found')})
									</td>
								</tr>
								<tr>
									<th style={styles.dataTableHead}>
                    Signed At </th>
									<td>
										{Moment(policyDoc.signedTimestamp).format(dataFormat)}
									</td>
									<th style={styles.dataTableHead}>Submitted At</th>
									{policyDoc.submittedTimestamp? 
										<td>{Moment(policyDoc.submittedTimestamp).format(dataFormat)}</td>
										: <td>'No data' </td>
									}
								</tr>
								<tr>
									<th style={styles.dataTableHead} >Sum Assured</th>
									<td>
										{_.get(coveragePlan, 'basicPlan.sumAssured', 'ERROR: basicPlan.sumAssured not found')}
									</td>
									<th style={styles.dataTableHead} >Riders</th>
									<td>
										{riders.map(function (object, i) {
											return <RiderLabel rider={object} key={i} />
										})}
									</td>
								</tr>
								<tr>
									<th style={styles.dataTableHead}>
                    Application Created At
									</th>
									<td colSpan='3'>
										{Moment(_.get(applicationDoc, 'createdAt', '' )).format(dataFormat)}
									</td>
								</tr>
							</tbody>
						</Table>

						<h3>Submission</h3>
						<Table style={styles.dataTable}>
							<thead></thead>
							<tbody>
								<tr>
									<th style={styles.dataTableHead}>Submitted At (tries)</th>
									{submissionDoc.submittedAt? 
										<td colSpan='3'>{Moment(submissionDoc.submittedAt).format(dataFormat)} ({submissionDoc.tries} tries)</td>
										: <td colSpan='3'>No data, last submitting attempt at {Moment(submissionDoc.submittingAt).format(dataFormat)} ({submissionDoc.tries} tries)</td>
									}
                  
								</tr>
								<tr>
									<th style={styles.dataTableHead}>Application Submitted At</th>
									<td><DocTiffSubmitted doc={application} /></td>

									<th style={styles.dataTableHead}>BI Submitted At</th>
									<td><DocTiffSubmitted doc={bi} /></td>
								</tr>
								<tr>
									<th style={styles.dataTableHead}>Documents</th>
									<td colSpan='3'>{Object.keys(subDocs).join(', ')}</td>
								</tr>
							</tbody>
						</Table>

						<h3>Payments</h3>
						<PaymentTable payments={paymentDoc} receipts={actualReceipt} customStyle={styles} />
            
						{renderAttachmentTable(data, policyNo)}

						<h3>Agent Detail</h3>
						<Table style={styles.dataTable}>
							<thead>
							</thead>
							<tbody>
								<tr>
									<th style={styles.dataTableHead}>
                    Name
									</th>
									<td>
										{_.get(agent,'fullName','fullName not found')}
									</td>
									<th style={styles.dataTableHead}>ID / Code / Status</th>
									<td>{_.get(agent,'advisorId','advisorId not found')} / {_.get(agent,'advisorCode','advisorCode not found')} / {_.get(agent,'status','status not found')}</td>
								</tr>
								<tr>
									<th style={styles.dataTableHead}>
                    Telephone
									</th>
									<td>
										{ _.get(agent, 'contactMethods.phoneContacts[0].localNumber', 'phoneContact[0] not found')}
									</td>
									<th style={styles.dataTableHead}>
                    Email </th>
									<td>
										{_.get(agent, 'contactMethods.emailContact[1].url', 'emailContact not found')}
									</td>
								</tr>
							</tbody>
						</Table>
						<h3>Advisor Detail</h3>
						<Table style={styles.dataTable}>
							<thead>
							</thead>
							<tbody>
								<tr>
									<th style={styles.dataTableHead}>
                    Name
									</th>
									<td>
										{_.get(advisor,'party.fullName','fullName not found')}
									</td>
									<th style={styles.dataTableHead}>
									ID / Code / Status / Type
									</th>
									<td>{_.get(advisor,'advisorId','advisorId not found')} / {_.get(advisor,'advisorCode','advisorCode not found')} / {_.get(advisor,'status','status not found')} / { _.get(advisor, 'type.name', 'type.name not found')}</td>
								</tr>
								<tr>
									<th style={styles.dataTableHead}>
                    Telephone
									</th>
									<td>
										{ _.get(advisor, 'contactMethods.phoneContacts[0].localNumber', 'phoneContact[0] not found')}
									</td>
									<th style={styles.dataTableHead}>
                    Email </th>
									<td>
										{_.get(advisor, 'contactMethods.emailContact[1].url', 'emailContact not found')}
									</td>
								</tr>
								<tr>
									<th style={styles.dataTableHead}>
                    Office
									</th>
									<td>
										{ _.get(advisor, 'office.ga.name', 'office.ga.name not found')}({ _.get(advisor, 'office.ga.code', 'office.ga.code not found') })
									</td>
									<th style={styles.dataTableHead}>
                    Party </th>
									<td>
										{_.get(advisor, 'party.positionCode', 'positionCode not found')} ({ _.get(advisor, 'party.type', 'party.type not found')})
									</td>
								</tr>
							</tbody>
						</Table>
					</Tab>
					<Tab eventKey={2} title='Pretty JSON'>
						<PanelGroup accordion id="accordion-example">
							<Panel id="policy-panel" eventKey="1">
								<Panel.Heading>
									<Panel.Title toggle>
                    Policy
									</Panel.Title>
									<Panel.Toggle componentClass="a">Toggle Collapse</Panel.Toggle>
								</Panel.Heading>
								<Panel.Body collapsible>
									<JSONPretty id="json-pretty" json={data.policy}></JSONPretty>
								</Panel.Body>
							</Panel>
							<Panel id="submission-panel" eventKey="2">
								<Panel.Heading>
									<Panel.Title toggle>
                    Submission
									</Panel.Title>
									<Panel.Toggle componentClass="a">Toggle Collapse</Panel.Toggle>
								</Panel.Heading>
								<Panel.Body collapsible>
									<JSONPretty id="json-pretty" json={data.submission}></JSONPretty>
								</Panel.Body>
							</Panel>
							<Panel id="application-panel" eventKey="3">
								<Panel.Heading>
									<Panel.Title toggle>
                    Application
									</Panel.Title>
									<Panel.Toggle componentClass="a">Toggle Collapse</Panel.Toggle>
								</Panel.Heading>
								<Panel.Body collapsible>
									<JSONPretty id="json-pretty" json={data.application}></JSONPretty>
								</Panel.Body>
							</Panel>
							<Panel id="payment-panel" eventKey="4">
								<Panel.Heading>
									<Panel.Title toggle>
                    Payment
									</Panel.Title>
									<Panel.Toggle componentClass="a">Toggle Collapse</Panel.Toggle>
								</Panel.Heading>
								<Panel.Body collapsible>
									<JSONPretty id="json-pretty" json={data.payment}></JSONPretty>
								</Panel.Body>
							</Panel>
							<Panel id="advisor-panel" eventKey="5">
								<Panel.Heading>
									<Panel.Title toggle>
                    Advisor
									</Panel.Title>
									<Panel.Toggle componentClass="a">Toggle Collapse</Panel.Toggle>
								</Panel.Heading>
								<Panel.Body collapsible>
									<JSONPretty id="json-pretty" json={data.advisor}></JSONPretty>
								</Panel.Body>
							</Panel>
						</PanelGroup>
					</Tab>
				</Tabs>
			</div>
		);
	}
}

const styles = {
	'dataTable': {
		'paddingTop': 7,
		'paddingBottom': 6,
		'paddingLeft': 8,
		'paddingRight': 8,
		'minWidth': '50%',
		'border': '1px solid #ccc',
		'borderRadius': 8,
	},
	dataTableHead: {
		'backgroundColor': '#337ab7',
		'fontWeight': 600,
		'color': 'white',
		'width': 200
	},
	smallSpan: {
		'fontSize': '0.6em',
		'marginLeft': '8px'
	},
	title: {
		fontSize: 19,
		fontWeight: 'bold',
	},
	activeTitle: {
		color: 'red',
	},
}

module.exports = PolicyPage;
