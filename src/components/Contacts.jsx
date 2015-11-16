import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';

class Contacts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contacts: []
		};
	}

	getApiRequest() {
		return {
			id: 'intercom.getContacts'
		};
	}

	onApiData(data) {
		this.setState({
			contacts: data
		});
	}

	render() {
		let totalCount = this.state.contacts.total_count;
		
		return(
			<div className="contact__count">
				Subscribers : {totalCount}
			</div>
		);
	}
}

reactMixin(Contacts.prototype, ListenerMixin);
reactMixin(Contacts.prototype, Mozaik.Mixin.ApiConsumer);

export default Contacts;