import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Company from './Company.jsx'
import Mozaik from 'mozaik/browser';

class Companies extends Component {
	constructor(props) {
		super(props);
		this.state = {
			companies: [],
			total: 0
		};
	}

	getApiRequest() {
		return {
			id: 'intercom.getCompanies'
		}
	}

	onApiData(response) {
		this.setState({
			companies: response.companies,
			total: response.total_count
		});
	}

	render() {

		let { companies, total } = this.state;

		return (
			<div>
				<div className="widget__header">
          Companies
          <span className="widget__header__count">
              {total}
          </span>
          <i className="fa fa-building" />
        </div>
        <div className="widget__body">
					{companies.map(company => {
						return <Company key={company.id} company={company} />
					})}
				</div>
			</div>
		)
	}
}

reactMixin(Companies.prototype, ListenerMixin);
reactMixin(Companies.prototype, Mozaik.Mixin.ApiConsumer);

export { Companies as default };