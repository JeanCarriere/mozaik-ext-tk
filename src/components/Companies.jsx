import React, { Component, PropTypes } from 'react';
import reactMixin                      from 'react-mixin';
import { ListenerMixin }               from 'reflux';
import Company 						   from './Company.jsx'
import _                               from 'lodash';
import Mozaik                          from 'mozaik/browser';

class Companies extends Component {
	constructor(props) {
		super(props);
		this.state = {
			companies: []
		}
	}

	getApiRequest() {
		return {
			id: 'intercom.getCompanies'
		}
	}

	onApiData(companies) {
		this.setState({
			companies: companies
		})
	}

	render() {
		let { companies } = this.state;
 
		return (
			<div>
				 <div className="widget__header">
                    Companies
                    <span className="widget__header__count">
                        {this.state.companies.length}
                    </span>
                    <i className="fa fa-github-alt" />
                </div>
                <div className="widget__body">
				{ companies.map(company => {
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