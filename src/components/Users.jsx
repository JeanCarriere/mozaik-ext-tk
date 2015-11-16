import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';
import Contacts from './Contacts';

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: []
		};
	}

	getApiRequest() {
		return {
			id: 'intercom.getUsers'
		}
	}

	onApiData(users) {
		this.setState({
			users: users
		});
	}

	render() {
		let { users } = this.state;

		return (
			<div>
				<div className="widget__header">
                    Users
                </div>
                <div className="widget__body">
					<span className="users__count">{users.length}</span>
					<Contacts />
				</div>
			</div>
		);
	}
}

reactMixin(Users.prototype, ListenerMixin);
reactMixin(Users.prototype, Mozaik.Mixin.ApiConsumer);

export default Users;