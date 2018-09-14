const React = require('react');

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.myRef = React.createRef()
		this.state = {
            hi : 'hi'
		}
	}


	render() {
		const { renderData, googleURL } = this.props
		const { hi } = this.state
        console.log(renderData,hi)
		return (
			<div className="container">
				<div>
                    <a href={googleURL}>Login with Google</a>
                </div>
			</div>
		);
	}
}

module.exports = Login
