import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';

class BiggestCompaniesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			companies: []
		};
	}

	getApiRequest() {
		let { segment, title } = this.props; 
		return {
			id: `tk.getCompaniesBySegment.${ segment }`,
			params: {
				segment: segment,
				title: title
			}
		}
	}

	onApiData(response) {
		this.setState({
			companies: response.segment.companies,
			total:response.segment.total_count
		});
	}

	render() {

		let {total, companies} = this.state;
		companies = companies.sort(function(a, b){
		 return b.user_count - a.user_count;
		});

		return (
			<div className="intercom__companies">
				<div className="widget__header">Biggest Active Companies (>10 users)
					<span className="widget__header__count">
		              #{total}
		          	</span>
				</div>
    			<div className="widget__body">
					{companies.map(company => {
						return (<div key={company.id} className="list__item">
								{ company.name } <span  className="list__item_count">{company.user_count} users</span>
							</div>);
					})}
				</div>
			</div>
		)
	}
}

reactMixin(BiggestCompaniesList.prototype, ListenerMixin);
reactMixin(BiggestCompaniesList.prototype, Mozaik.Mixin.ApiConsumer);

export { BiggestCompaniesList as default };