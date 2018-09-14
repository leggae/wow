const React = require('react')
const Moment = require('moment')
const dataFormat = 'YYYY-MM-DD HH:mm:ss'

class RiderLabel extends React.Component {
	render() {
		const { doc } = this.props

		if (typeof doc === 'undefined') {
	    return ( 
	      <span>Document detail is missing. Please check for more info in JSON.</span>
	    )
		} else if (typeof doc.tiff === 'undefined') {
	    return ( 
	      <span>Document detail is missing. Please check for more info in JSON.</span>
	    )
		} else {
    	return (
    		<span>{ Moment(doc.tiff.submittedAt).format(dataFormat) }</span>
    	)
		}
	}
}

module.exports = RiderLabel