import React, { Component } from 'react';

class Company extends Component {
	render() {
		let { company } = this.props;
		return (
			<div className="list__item">
				{ company.name } - ({company.user_count})
			</div>
		)
	}
}

export default Company;