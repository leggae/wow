var React = require('react');
var { Tabs, Tab } = require('react-bootstrap');

class ControlledTabs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			key: 1
		};
		this.handleSelect = this.handleSelect.bind(this);
	}
  
	handleSelect(key) {
		this.setState({ key });
	}
  
	render() {
		const { content1, content2 } = this.props
		return (
			<Tabs
				activeKey={this.state.key}
				onSelect={this.handleSelect}
				id="controlled-tab-example"
			>
				<Tab eventKey={1} title="Table">
					{content1}
				</Tab>
				<Tab eventKey={2} title="Response">
					{content2}
				</Tab>
			</Tabs>
		);
	}
}
  
module.exports = ControlledTabs