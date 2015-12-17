import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';

class UserSegment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: 0
		};
	}

	getApiRequest() {
		let { segment, title } = this.props; 

		return {
			id: `intercom.getUsersBySegment.${ segment }`,
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

reactMixin(UserSegment.prototype, ListenerMixin);
reactMixin(UserSegment.prototype, Mozaik.Mixin.ApiConsumer);

export { UserSegment as default };