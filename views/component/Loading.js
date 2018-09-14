const React = require('react')

const styles = {
	'overlay': {
		'height': '100%',
		'width': '100%',
		'position': 'fixed',
		'z-index': '1000',
		'left': 0,
		'top': 0,
		'backgroundColor': 'rgb(0,0,0)',
		'backgroundColor': 'rgba(0,0,0, 0.3)',
		'overflowX': 'hidden'
	},
	'spinner': {
		'fontSize': 64,
		'top': '50%',
		'left': '50%',
		'marginTop': -50,
		'marginLeft': -50,
		'position': 'absolute'
	}
}

class Loading extends React.Component {
	render() {
		const { isLoading } = this.props
		return (
			isLoading?
    	<div style={styles.overlay}><i className="fas fa-spinner fa-spin" style={styles.spinner}></i></div> : null
		)
	}
}

module.exports = Loading 