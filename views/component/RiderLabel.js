const React = require('react')
const { Badge } = require('react-bootstrap')

class RiderLabel extends React.Component {
	render() {
		const { rider } = this.props
		return ( 
    	<span style={styles.riderSpan}>{rider.name}</span>
		)
	}
}

const styles = {
	'riderSpan': {
		'marginRight': 8,
		'border': '1px solid #337ab7',
		'borderRadius': 8,
		'padding': 4
	}
}

// <span>{rider.name}<Badge>{rider.sumAssured}</Badge></span>

module.exports = RiderLabel 