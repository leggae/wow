const React = require('react')
const { Alert, Table } = require('react-bootstrap')
const _ = require('lodash')

const onlyUnique = function (value, index, self) {
	return self.indexOf(value) === index;
}
class PaymentTable extends React.Component {
	render() {
		const { payments, receipts, customStyle } = this.props
		const actualReceiptsNumbers = receipts.map( x => x.receiptNo)
		if (payments.type === 'invest'){
			return (
				<tr>
					<td colSpan='4'>
						{payments.message}
					</td>
				</tr>
			)
		} else if(payments.type === 'error') {
			return (
				<Alert bsStyle="danger">
					<strong>Error!</strong> There's an error while fetching payments document. ({payments.message})
				</Alert>
			)
		} if (payments.length > 0) {
			let totalAmount = 0, currency = []
			const paymentElems = payments.map(key => {
				totalAmount += typeof parseFloat(key.amount) !== NaN ? parseFloat(key.amount) : 0
				currency.push(key.currency)
				const receiptNo = _.get(key, 'receiptNo', 'Error! payment.doc.reciptNo not found')
				if(actualReceiptsNumbers.indexOf(receiptNo)<0){ 
					return (
						<tr>
							<th style={customStyle.dataTableHead}>Payment No.</th>
							<td style={{color:'red'}}>{receiptNo} (not found in application.receipts)</td>
							<th>Amount</th>
							<td>{_.get(key, 'amount', 'NaN')} {_.get(key, 'currency', ' (currency not specified.)')} with {_.get(key, 'type', '(payment type not specified.)')}</td>
						</tr>
					)
				} else {
					return ( 
						<tr>
							<th style={customStyle.dataTableHead}>Payment No.</th>
							<td>{receiptNo}</td>
							<th>Amount</th>
							<td>{_.get(key, 'amount', 'NaN')} {_.get(key, 'currency', ' (currency not specified.)')} with {_.get(key, 'type', '(payment type not specified.)')}</td>
						</tr>
					)
				}
			})
			const uniqueCurrency = currency.filter(onlyUnique)
			let displayTotalText
			if (uniqueCurrency.length > 1) {
				displayTotalText = "Payments currency inconsistent. Cannot sum total"
			} else {
				displayTotalText = totalAmount + uniqueCurrency[0]
			}
			return (
				<Table style={customStyle.dataTable}>
					<thead></thead>
					<tbody>
						{paymentElems}
						<tr><th style={customStyle.dataTableHead}>Sum Total</th> <td colSpan="3" style={{ textAlign: 'right', fontWeight:600 }}>{displayTotalText}</td></tr>
					</tbody>
				</Table>
			)
		} else {
			return (
				<Alert bsStyle="danger">
					<strong>Error!</strong> There's no payment in submission document.
				</Alert>
			)
		}
		return 0
	}
}

module.exports = PaymentTable