import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Company from './Company.jsx'
import Mozaik from 'mozaik/browser';

class CompanieSegment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: 0
		};
	}

	getApiRequest() {
		let { segment, title } = this.props; 

		return {
			id: `intercom.getCompaniesBySegment.${ segment }`,
			params: {
				segment: segment,
				title: title
			}
		}
	}

	onApiData(response) {
		this.setState({
			total: response.total_count
		});
	}

	render() {
		let { total } = this.state;
		let { title } = this.props;
		return (
			<div>
	        	<div className="widget__body">
	        		<span className="intercom__companies__count">
						{ total }
						<span className="intercom__companies__body">{ title }</span>
					</span>
					
				</div>
			</div>
		)
	}
}

reactMixin(CompanieSegment.prototype, ListenerMixin);
reactMixin(CompanieSegment.prototype, Mozaik.Mixin.ApiConsumer);

export { CompanieSegment as default };