import React, { Component, DOM } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';

class OnlineUsers extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            total: 0
        };
    }


    getApiRequest() {
        return {
            id: `intercom.getOnlineUsers`
        }
    }

    onApiData(response) {
        console.log('response online users', response);
        this.setState({
            total: response
        });
    }

    render() {
        return (
            <div>
                <div className="widget__header">
                  Realtime Online Users
                </div>
                <div className="widget__body">
                    <div className="widget_value">
                    {this.state.total}
                    </div>
                </div>
            </div>
        )
    }
}

reactMixin(OnlineUsers.prototype, ListenerMixin);
reactMixin(OnlineUsers.prototype, Mozaik.Mixin.ApiConsumer);

export { OnlineUsers as default };