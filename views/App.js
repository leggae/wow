const React = require('react');
const Policy = require('./page/policy');
const Home = require('./page/home');
const Login = require('./page/login')

class App extends React.Component {
	render() {
		const { page } = this.props
		let component
		switch (page) {
		case 'login': component = <Login {...this.props}/>; break;
		case 'policy': component = <Policy {...this.props}/>; break;
		default: component = <Home {...this.props}/>; break;
		}
		return (component);
	}
}

module.exports = App;
