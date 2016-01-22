import React, { Component, DOM } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';
import _ from 'lodash';

class Paying extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            companies: false
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
            companies: response.segment.companies
        });
    }

    render() {
        var nbCompanies = this.state.companies? this.state.companies.length : 0;
        var nbUsers = _.reduce(this.state.companies, function(memo, comp) {
            return memo + (comp.user_count || 0);
        }, 0);
        return (
            <div>
                <div className="widget__header">
                  Paying customers
                </div>
                <div className="widget__body">
                    <div className="widget_value widget_value_small">
                        {nbCompanies} comp. / {nbUsers} users
                    </div>
                </div>
            </div>
        )
    }
}

reactMixin(Paying.prototype, ListenerMixin);
reactMixin(Paying.prototype, Mozaik.Mixin.ApiConsumer);

export { Paying as default };