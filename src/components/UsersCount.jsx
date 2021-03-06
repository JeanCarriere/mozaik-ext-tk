import React, { Component, DOM } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';
import c3 from 'c3';

class DonutChart {

  constructor(bindTo, opts, data) {
    this.chart = c3.generate({
        bindto: bindTo,
        data: {
            columns: data,
            type: 'donut'
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return value + ' ' + id;
                },
                show: true
            }
        },
        color: {
          pattern: ['#1f77b4', '#60B044']
        },
        legend: {
          hide: true
        }
    });
  }

  load(data) {
    return this.chart.load(data);
  }

  destroy () {
    console.log('destroy chart');   
    this.chart.destroy();
  }
}

class UsersCount extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            total: 0
        };
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    getApiRequest() {
        let { segment, title, segmentCompanies } = this.props; 

        return {
            id: `tk.getInvited.${ segment }`,
            params: {
                segment: segment,
                segmentCompanies:segmentCompanies,
                title: title
            }
        }
    }

    onApiData(response) {
        var data = [
            ['Invited', response.invited],
            ['SignedUp', response.total]
            ];
        if(!this.chart) {
            var chartElement = React.findDOMNode(this.refs.chart);
            this.chart = new DonutChart(chartElement, null, data);
        } else if(this.state.invited !== response.invited || this.state.total !== response.total) {
            this.chart.load({
                columns: data
            });
        }
        this.setState({
            invited: response.invited,
            total: response.total,
        });
    }

    render() {
        return (
            <div>
                <div className="widget__header">
                  Users
                </div>
                <div className="widget__body">
                    <div ref="chart" className="widget__chart"></div>
                </div>
            </div>
        )
    }
}

reactMixin(UsersCount.prototype, ListenerMixin);
reactMixin(UsersCount.prototype, Mozaik.Mixin.ApiConsumer);

export { UsersCount as default };