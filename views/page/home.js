const React = require('react');
const Table = require('../component/Table');
const ReactPaginate = require('react-paginate');
const Loading = require('../component/Loading');

class Home extends React.Component {
	constructor(props) {
		super(props)
		this.myRef = React.createRef()
		this.onChange = this.onChange.bind(this)
		this.search = this.search.bind(this)
		this.export = this.export.bind(this)
		this.handlePage = this.handlePage.bind(this)
		this.state = {
			startDate: props.etc.start || '',
			endDate: props.etc.end || '',
			policyId: props.etc.policyId || '',
			isExport: false,
			activePage: props.etc.page || 0,
			pageLimit: props.etc.limit || 10,
			isLoading: false
		};
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value})
	}

	search() {
		console.log('search')
		this.setState({
			isExport : false,
			isLoading: true 
		})
	}

	export() {
		console.log('export')
		this.setState({isExport : true})
	}

	handlePage(data) {
		const activePage = data.selected
		const { startDate, endDate, pageLimit } = this.state
		if(activePage !== this.state.activePage)
			this.setState({ isLoading: true }, () => window.location.href = `/?startDate=${startDate}&endDate=${endDate}&page=${activePage}&limit=${pageLimit}`)
	}

	render() {
		const { renderData, headerNames, etc } = this.props
		const { startDate, endDate, policyId, isExport, activePage, isLoading } = this.state
    
		return (
			<div className="container">
				<Loading isLoading={isLoading}/>
				<div>
					<h3>AdvisorZone Tool
						{etc.start?
							<h4 style={{float: 'right'}}>Date: {etc.displayDate.start} to {etc.displayDate.end} Total: {etc.total}</h4>
							: null }
					</h3>
					<form className="form-inline" action='/'>
						<input type="hidden" name="isExport" value={isExport} onChange={this.onChange} />
						<div className="form-group">
							<label>Search Submission By</label> &nbsp;
							<label>Date from</label> &nbsp;
							<input
								type="date"
								name="startDate"
								className="form-control"
								onChange={this.onChange}
								value={startDate}
							/> &nbsp;
							<label>to</label> &nbsp;
							<input
								type="date"
								name="endDate"
								className="form-control"
								onChange={this.onChange}
								value={endDate}
							/>
						</div>
            &nbsp;
						<button className="btn btn-primary" disabled={startDate === '' || endDate === ''} onClick={this.search}>Search</button>
            &nbsp;
						<button className="btn btn-success" disabled={startDate === '' || endDate === ''} onClick={this.export}>Export</button>
					</form>
					<br/>
            
					<form className="form-inline" action='/'>
						<div className="form-group">
							<label>Search Policy Id: </label> &nbsp;
							<input
								type="text"
								name="policyId"
								className="form-control"
								onChange={this.onChange}
								value={policyId}
							/>
						</div>
            &nbsp;
						<button className="btn btn-primary" disabled={policyId === ''} onClick={this.search}>Search</button>
					</form>
					<Table data={renderData} headerNames={headerNames} skip={etc.limit*etc.page}/>
					<br/>
					{etc.totalPage !== 0?
						<ReactPaginate previousLabel={"previous"}
							breakLabel={<a>...</a>}
							pageCount={etc.totalPage}
							initialPage={activePage}
							marginPagesDisplayed={2}
							pageRangeDisplayed={5} 
							onPageChange={this.handlePage}
							containerClassName={"pagination"}
							subContainerClassName={"pages pagination"}
							activeClassName={"active"}/>
						: null
					}

				</div>
				<a href="/logout">Logout</a>
			</div>
		);
	}
}

module.exports = Home
