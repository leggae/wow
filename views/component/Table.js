const React = require('react');
const numberWithCommas = require('../../utils/numberWithCommas')

class Table extends React.Component {

	render(){
		const { data, headerNames, skip } = this.props;
		return (
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						{headerNames.filter(x => x !== 'Agent').map((headerName, index) => 
							<th scope="col" key={index}>{headerName}</th>
						)}
					</tr>
				</thead>
				<tbody>
					{data.map((element, key) => 
						<tr key={key}>
							<th scope="row">{key+1+skip}</th>
							{Object.keys(element).map(x => 
							{switch(x) {
							case 'policyId' :
								return <td key={x}><a href={`detail/${element[x]}`} target='_blank'>{element[x]}</a></td>
								break
							case 'sumAssured' :
							case 'totalPremium' :
								return <td style={{textAlign:'right'}} key={x}>{numberWithCommas(element[x].toFixed(2)) || '-'}</td>
								break
							case 'agent' :
								break
							default :
								return <td key={x}>{element[x] || '-'}</td>
							}}
							)}
						</tr>
					)}
          
				</tbody>
			</table>)
	}
}

module.exports = Table;
